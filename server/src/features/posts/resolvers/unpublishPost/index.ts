import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import {
  NotAllowedPostActionError,
  PostIdValidationError,
  SinglePost,
  UnauthorizedAuthorError,
} from "../types";
import { getPostTags, getPostUrl } from "@features/posts/utils";
import { dateToISOString, NotAllowedError, UnknownError } from "@utils";

import { type MutationResolvers, PostStatus } from "@resolverTypes";
import type { DbFindPost, ResolverFunc } from "@types";

type UnpublishPost = ResolverFunc<MutationResolvers["unpublishPost"]>;
type Keys = "status" | "author" | "datePublished" | "postId";

interface DbPost {
  authorId: string;
  authorName: string;
  status: PostStatus;
}

const unpublishPost: UnpublishPost = async (_, { postId }, { user, db }) => {
  const schema = Joi.string()
    .required()
    .trim()
    .guid({ version: "uuidv4", separator: "-" })
    .messages({
      "string.empty": "Provide post id",
      "string.guid": "Invalid post id",
    });

  try {
    if (!user) return new NotAllowedError("Unable to unpublish post");

    const post = await schema.validateAsync(postId);

    const findUser = db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    const findPost = db.query<DbPost>(
      `SELECT
        author "authorId",
        first_name || ' ' || last_name "authorName",
        status
      FROM posts LEFT JOIN users ON author = user_id
      WHERE post_id = $1`,
      [post]
    );

    const [{ rows: foundUser }, { rows: foundPost }] = await Promise.all([
      findUser,
      findPost,
    ]);

    if (foundUser.length === 0 || !foundUser[0].isRegistered) {
      return new NotAllowedError("Unable to unpublish post");
    }

    if (foundPost.length === 0) {
      return new UnknownError("Unable to unpublish post");
    }

    if (foundPost[0].authorId !== user) {
      return new UnauthorizedAuthorError(
        "Cannot unpublish another author's post"
      );
    }

    if (foundPost[0].status === PostStatus.Unpublished) {
      return new NotAllowedPostActionError("Post is currently unpublished");
    }

    if (foundPost[0].status !== PostStatus.Published) {
      return new NotAllowedPostActionError(
        "Only published posts can be unpublished"
      );
    }

    const { rows: updatePost } = await db.query<Omit<DbFindPost, Keys>>(
      `UPDATE posts SET
        status = $1,
        date_published = $2
      WHERE post_id = $3
      RETURNING
        title,
        description,
        content,
        slug,
        image_banner "imageBanner",
        date_created "dateCreated",
        last_modified "lastModified",
        views,
        likes,
        is_in_bin "isInBin",
        is_deleted "isDeleted",
        tags`,
      [PostStatus.Unpublished, null, post]
    );

    const [updated] = updatePost;

    const url = getPostUrl(updated.slug ?? updated.title);
    const tags = updated.tags ? await getPostTags(db, updated.tags) : null;

    return new SinglePost({
      id: post,
      title: updated.title,
      description: updated.description,
      content: updated.content,
      author: foundPost[0].authorName,
      status: PostStatus.Unpublished,
      url,
      slug: updated.slug,
      imageBanner: updated.imageBanner,
      dateCreated: dateToISOString(updated.dateCreated),
      datePublished: null,
      lastModified: updated.lastModified
        ? dateToISOString(updated.lastModified)
        : updated.lastModified,
      views: updated.views,
      likes: updated.likes,
      isInBin: updated.isInBin,
      isDeleted: updated.isDeleted,
      tags,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdValidationError(err.message);
    }

    throw new GraphQLError("Unable to unpublish post. Please try again later");
  }
};

export default unpublishPost;
