import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { NotAllowedPostActionError } from "../types/NotAllowedPostActionError";
import { PostIdValidationError } from "../types/PostIdValidationError";
import { SinglePost } from "../types/SinglePost";
import { UnauthorizedAuthorError } from "../types/UnauthorizedAuthorError";
// import  getPostTags from "@features/posts/utils/getPostTags";
import getPostUrl from "@features/posts/utils/getPostUrl";
import { NotAllowedError, UnknownError } from "@utils/ObjectTypes";
import dateToISOString from "@utils/dateToISOString";

import type { MutationResolvers, PostStatus } from "@resolverTypes";
import type { GetPostDBData, ResolverFunc } from "@types";

type PublishPost = ResolverFunc<MutationResolvers["publishPost"]>;

interface DbPost {
  authorId: string;
  authorName: string;
  authorImage: string | null;
  status: PostStatus;
}

const publishPost: PublishPost = async (_, { postId }, { user, db }) => {
  const schema = Joi.string()
    .required()
    .trim()
    .guid({ version: "uuidv4", separator: "-" })
    .messages({
      "string.empty": "Provide post id",
      "string.guid": "Invalid post id",
    });

  try {
    if (!user) return new NotAllowedError("Unable to publish post");

    const post = await schema.validateAsync(postId);

    const findUser = db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    const findPost = db.query<DbPost>(
      `SELECT
        author "authorId",
        first_name || ' ' || last_name "authorName",
        image "authorImage"
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
      return new NotAllowedError("Unable to publish post");
    }

    if (foundPost.length === 0) {
      return new UnknownError("Unable to publish post");
    }

    if (foundPost[0].authorId !== user) {
      return new UnauthorizedAuthorError(
        "Cannot publish another author's post"
      );
    }

    if (foundPost[0].status === "Published") {
      return new NotAllowedPostActionError("Post has already been published");
    }

    if (foundPost[0].status !== "Unpublished") {
      return new NotAllowedPostActionError(
        "Only unpublished posts can be published"
      );
    }

    const { rows: updatePost } = await db.query<
      Omit<GetPostDBData, "status" | "author" | "postId">
    >(
      `UPDATE posts
      SET
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
        date_published "datePublished",
        last_modified "lastModified",
        views,
        likes,
        is_in_bin "isInBin",
        is_deleted "isDeleted",
        tags`,
      ["Published", new Date().toISOString(), post]
    );

    const [updated] = updatePost;
    const { href, slug } = getPostUrl(updated.title);
    // const tags = updated.tags ? await getPostTags(db, updated.tags) : null;
    return new NotAllowedPostActionError(
      "Only unpublished posts can be published"
    );

    // return new SinglePost({
    //   id: post,
    //   title: updated.title,
    //   description: updated.description,
    //   content: updated.content,
    //   author: {
    //     name: foundPost[0].authorName,
    //     image: foundPost[0].authorImage,
    //   },
    //   status: "Published",
    //   url:{ href, slug },
    //   imageBanner: updated.imageBanner,
    //   dateCreated: dateToISOString(updated.dateCreated),
    //   datePublished: updated.datePublished
    //     ? dateToISOString(updated.datePublished)
    //     : updated.datePublished,
    //   lastModified: updated.lastModified
    //     ? dateToISOString(updated.lastModified)
    //     : updated.lastModified,
    //   views: updated.views,
    //   isInBin: updated.isInBin,
    //   isDeleted: updated.isDeleted,
    //   tags: null,
    // });
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdValidationError(err.message);
    }

    throw new GraphQLError("Unable to publish post. Please try again later");
  }
};

export default publishPost;
