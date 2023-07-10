import { Worker } from "node:worker_threads";
import path from "node:path";

import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { getPostUrl, mapPostTags } from "@features/posts/utils";
import {
  Posts,
  PostIdsValidationError,
  PostsWarning,
  UnauthorizedAuthorError,
} from "../types";
import { NotAllowedError, UnknownError } from "@utils";
// import binPostsWorker from "./binPostsWorker";

import {
  type MutationResolvers,
  type PostTag,
  type Post,
} from "@resolverTypes";
import type { DbFindPost, ResolverFunc } from "@types";

type BinPosts = ResolverFunc<MutationResolvers["binPosts"]>;
type DbPost = Omit<DbFindPost, "author" | "isInBin">;

const binPosts: BinPosts = async (_, { postIds }, { db, user }) => {
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
      return new NotAllowedError(`Unable to move ${postOrPosts} to bin`);
    }

    const validatedPostIds = await schema.validateAsync(postIds, {
      abortEarly: false,
    });

    const findUser = db.query<{ isRegistered: boolean; name: string }>(
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

    const [foundUser, checkedPosts, postTags] = await Promise.all([
      findUser,
      checkPostIds,
      allPostTags,
    ]);

    if (foundUser.rows.length === 0 || !foundUser.rows[0].isRegistered) {
      return new NotAllowedError(`Unable to move ${postOrPosts} to bin`);
    }

    if (checkedPosts.rows.length > 0) {
      return new UnauthorizedAuthorError(
        `Cannot move another author's ${postOrPosts} to bin`
      );
    }

    const map = new Map<string, PostTag>();

    postTags.rows.forEach(postTag => {
      map.set(postTag.id, postTag);
    });

    const { rows: binnedPosts } = await db.query<DbPost>(
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
      [true, validatedPostIds, user]
    );

    const set = new Set<string>();
    const binnedPostIds: string[] = [];

    const mappedBinnedPosts = binnedPosts.map<Post>(binnedPost => {
      const postUrl = getPostUrl(binnedPost.slug ?? binnedPost.title);
      const tags = binnedPost.tags ? mapPostTags(binnedPost.tags, map) : null;

      set.add(binnedPost.postId);
      binnedPostIds.push(binnedPost.postId);

      return {
        id: binnedPost.postId,
        title: binnedPost.title,
        description: binnedPost.description,
        content: binnedPost.content,
        author: foundUser.rows[0].name,
        status: binnedPost.status,
        url: postUrl,
        slug: binnedPost.slug,
        imageBanner: binnedPost.imageBanner,
        dateCreated: binnedPost.dateCreated,
        datePublished: binnedPost.datePublished,
        lastModified: binnedPost.lastModified,
        views: binnedPost.views,
        likes: binnedPost.likes,
        isInBin: true,
        isDeleted: binnedPost.isDeleted,
        tags,
      };
    });

    if (binnedPostIds.length > 0) {
      const worker = new Worker(path.join(__dirname, "binPostsWorker.ts"));
      worker.postMessage(binnedPostIds);

      worker.on("error", err => {
        console.error("Bin posts worker error - ", err);
      });
      // binPostsWorker(binnedPostIds);
    }

    const notBinnedPosts: string[] = [];

    for (const validatedPostId of validatedPostIds) {
      if (set.has(validatedPostId)) continue;

      notBinnedPosts.push(validatedPostId);
    }

    if (notBinnedPosts.length > 0) {
      const notBinnedPostOrPosts = notBinnedPosts.length > 1 ? "posts" : "post";

      if (binnedPosts.length === 0) {
        return new UnknownError(
          `The selected ${notBinnedPostOrPosts} could not be moved to bin`
        );
      }

      const msg =
        binnedPosts.length === 1
          ? "1 post moved to bin"
          : `${binnedPosts.length} posts moved to bin`;

      const message = `${msg}. ${notBinnedPosts.length} other ${notBinnedPostOrPosts} could not be moved to bin`;

      return new PostsWarning(mappedBinnedPosts, message);
    }

    return new Posts(mappedBinnedPosts);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdsValidationError(err.message);
    }

    throw new GraphQLError(
      `Unable to move ${postOrPosts} to bin. Please try again later`
    );
  }
};

export default binPosts;
