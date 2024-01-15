import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import {
  PostIdsValidationError,
  Posts,
  PostsWarning,
  UnauthorizedAuthorError,
} from "../types";
import { getPostUrl, mapPostTags } from "@features/posts/utils";
import { dateToISOString, NotAllowedError, UnknownError } from "@utils";

import type { MutationResolvers, PostTag, Post } from "@resolverTypes";
import type { GetPostDBData, ResolverFunc } from "@types";

type UnBinPosts = ResolverFunc<MutationResolvers["unBinPosts"]>;
type DbPost = Omit<GetPostDBData, "author" | "isInBin">;

interface User {
  isRegistered: boolean;
  name: string;
  image: string | null;
}

const unBinPosts: UnBinPosts = async (_, { postIds }, { db, user }) => {
  const schema = Joi.array<typeof postIds>()
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

  const postOrPosts = postIds.length > 1 ? "posts" : "post";

  try {
    if (!user) {
      return new NotAllowedError(`Unable to remove ${postOrPosts} from bin`);
    }

    const validatedPostIds = await schema.validateAsync(postIds, {
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
      return new NotAllowedError(`Unable to remove ${postOrPosts} from bin`);
    }

    const [{ name, image }] = foundUser.rows;

    if (checkedPost.rows.length > 0) {
      return new UnauthorizedAuthorError(
        `Cannot remove another author's ${postOrPosts} from bin`
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

    const { rows: unBinnedPosts } = await db.query<DbPost>(
      `UPDATE posts SET
        is_in_bin = $1
      WHERE
        post_id = ANY ($2)
      AND
        author = $3
      RETURNING
        post_id "postId",
        title,
        description,
        content,
        status,
        slug,
        image_banner "imageBanner",
        date_created "dateCreated",
        date_published "datePublished",
        last_modified "lastModified",
        views,
        likes,
        is_deleted "isDeleted",
        tags`,
      [false, validatedPostIds, user]
    );

    const set = new Set<string>();

    const mappedUnBinnedPosts = unBinnedPosts.map<Post>(unBinnedPost => {
      const { url, slug } = getPostUrl(unBinnedPost.title);

      // const tags = unBinnedPost.tags
      //   ? mapPostTags(unBinnedPost.tags, map)
      //   : null;

      set.add(unBinnedPost.postId);

      return {
        id: unBinnedPost.postId,
        title: unBinnedPost.title,
        description: unBinnedPost.description,
        content: unBinnedPost.content,
        author: { name, image },
        status: unBinnedPost.status,
        url,
        slug,
        imageBanner: unBinnedPost.imageBanner,
        dateCreated: dateToISOString(unBinnedPost.dateCreated),
        datePublished: unBinnedPost.datePublished
          ? dateToISOString(unBinnedPost.datePublished)
          : unBinnedPost.datePublished,
        lastModified: unBinnedPost.lastModified
          ? dateToISOString(unBinnedPost.lastModified)
          : unBinnedPost.lastModified,
        views: unBinnedPost.views,
        isInBin: false,
        isDeleted: unBinnedPost.isDeleted,
        tags: null,
      };
    });

    const notUnBinnedPosts: string[] = [];

    for (const validatedPostId of validatedPostIds) {
      if (set.has(validatedPostId)) continue;

      notUnBinnedPosts.push(validatedPostId);
    }

    if (notUnBinnedPosts.length > 0) {
      const notBinnedPostOrPosts =
        notUnBinnedPosts.length > 1 ? "posts" : "post";

      if (unBinnedPosts.length === 0) {
        return new UnknownError(
          `The provided ${notBinnedPostOrPosts} could not be removed from bin`
        );
      }

      const msg =
        unBinnedPosts.length === 1
          ? "1 post removed"
          : `${unBinnedPosts.length} posts removed`;

      const message = `${msg}. ${notUnBinnedPosts.length} other ${notBinnedPostOrPosts} could not be removed from bin`;

      return new PostsWarning(mappedUnBinnedPosts, message);
    }

    return new Posts(mappedUnBinnedPosts);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdsValidationError(err.message);
    }

    throw new GraphQLError("Unable to delete posts. Please try again later");
  }
};

export default unBinPosts;
