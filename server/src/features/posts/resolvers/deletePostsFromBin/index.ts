import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { getPostUrl, mapPostTags } from "@features/posts/utils";
import {
  Posts,
  PostIdsValidationError,
  PostsWarning,
  UnauthorizedAuthorError,
} from "../types";
import { NotAllowedError, UnknownError, dateToISOString } from "@utils";

import type { MutationResolvers, PostTag, Post } from "@resolverTypes";
import type { GetPostDBData, ResolverFunc } from "@types";

type DeletePosts = ResolverFunc<MutationResolvers["deletePostsFromBin"]>;
type DbPost = Omit<GetPostDBData, "author" | "isInBin" | "isDeleted">;

interface User {
  isRegistered: boolean;
  name: string;
  image: string | null;
}

const deletePostsFromBin: DeletePosts = async (_, args, { user, db }) => {
  const schema = Joi.array<typeof args.postIds>()
    .required()
    .items(
      Joi.string().trim().guid({ version: "uuidv4", separator: "-" }).messages({
        "string.empty": "Input post ids cannot be empty values",
        "string.guid": "Invalid post id",
      })
    )
    .min(1)
    .max(10)
    .unique()
    .messages({
      "array.max": "Input post ids can only contain at most {{#limit}} ids",
      "array.min": "No post ids provided",
      "array.unique": "Input post ids can only contain unique ids",
      "array.base": "Post id input must be an array",
    });

  const postOrPosts = args.postIds.length > 1 ? "posts" : "post";

  try {
    if (!user) {
      return new NotAllowedError(`Unable to delete ${postOrPosts} from bin`);
    }

    const validatedPostIds = await schema.validateAsync(args.postIds, {
      abortEarly: false,
    });

    const findUser = db.query<User>(
      `SELECT
        is_registered "isRegistered",
        first_name || ' ' || last_name name
      FROM users WHERE user_id = $1`,
      [user]
    );

    const checkPostIds = db.query(
      `SELECT id FROM posts WHERE post_id = ANY ($1) AND NOT author = $2`,
      [validatedPostIds, user]
    );

    const allPostTags = db.query<PostTag>(
      `SELECT
        tag_id id,
        name,
        date_created "dateCreated",
        last_modified "lastModified"
      FROM post_tags`
    );

    const [foundUser, checkedPost, postTags] = await Promise.all([
      findUser,
      checkPostIds,
      allPostTags,
    ]);

    if (foundUser.rows.length === 0 || !foundUser.rows[0].isRegistered) {
      return new NotAllowedError(`Unable to delete ${postOrPosts} from bin`);
    }

    const [{ image, name }] = foundUser.rows;

    if (checkedPost.rows.length > 0) {
      return new UnauthorizedAuthorError(
        `Cannot delete another author's ${postOrPosts} from bin`
      );
    }

    const map = new Map<string, PostTag>();

    postTags.rows.forEach(postTag => {
      const tag = {
        ...postTag,
        dateCreated: dateToISOString(postTag.dateCreated),
        lastModified: postTag.lastModified
          ? dateToISOString(postTag.lastModified)
          : postTag.lastModified,
      };

      map.set(tag.id, tag);
    });

    const { rows: deletedPosts } = await db.query<DbPost>(
      `UPDATE posts SET
        is_deleted = $1
      WHERE
        post_id = ANY ($2)
      AND
        author = $3
      AND
        is_in_bin = $4
      RETURNING
        post_id "postId",
        title,
        description,
        content,
        status,
        image_banner "imageBanner",
        date_created "dateCreated",
        date_published "datePublished",
        last_modified "lastModified",
        views`,
      [true, validatedPostIds, user, true]
    );

    const set = new Set<string>();

    const mappedDeletedPosts = deletedPosts.map<Post>(deletedPost => {
      const { url, slug } = getPostUrl(deletedPost.title);
      // const tags = deletedPost.tags ? mapPostTags(deletedPost.tags, map) : null;

      set.add(deletedPost.postId);

      return {
        id: deletedPost.postId,
        title: deletedPost.title,
        description: deletedPost.description,
        content: deletedPost.content,
        author: { name, image },
        status: deletedPost.status,
        url,
        slug,
        imageBanner: deletedPost.imageBanner,
        dateCreated: dateToISOString(deletedPost.dateCreated),
        datePublished: deletedPost.datePublished
          ? dateToISOString(deletedPost.datePublished)
          : deletedPost.datePublished,
        lastModified: deletedPost.lastModified
          ? dateToISOString(deletedPost.lastModified)
          : deletedPost.lastModified,
        views: deletedPost.views,
        isInBin: true,
        isDeleted: true,
        tags: null,
      };
    });

    const notDeletedPosts: string[] = [];

    for (const validatedPostId of validatedPostIds) {
      if (set.has(validatedPostId)) continue;

      notDeletedPosts.push(validatedPostId);
    }

    if (notDeletedPosts.length > 0) {
      const notDeletedPostOrPosts =
        notDeletedPosts.length > 1 ? "posts" : "post";

      if (deletedPosts.length === 0) {
        return new UnknownError(
          `The provided ${notDeletedPostOrPosts} could not be deleted from bin`
        );
      }

      const msg =
        deletedPosts.length === 1
          ? "1 post deleted from bin"
          : `${deletedPosts.length} posts deleted from bin`;

      const message = `${msg}. ${notDeletedPosts.length} other ${notDeletedPostOrPosts} could not be deleted from bin`;

      return new PostsWarning(mappedDeletedPosts, message);
    }

    return new Posts(mappedDeletedPosts);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdsValidationError(err.message);
    }

    throw new GraphQLError(
      `Unable to delete ${postOrPosts} from bin. Please try again later`
    );
  }
};

export default deletePostsFromBin;
