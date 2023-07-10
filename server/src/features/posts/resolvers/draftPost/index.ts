import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { getPostTags, getPostUrl } from "@features/posts/utils";
import {
  SinglePost,
  DuplicatePostTitleError,
  PostValidationError,
  UnauthorizedAuthorError,
  NotAllowedPostActionError,
} from "../types";
import { NotAllowedError, UnknownError, generateErrorsObject } from "@utils";

import {
  type MutationResolvers,
  type PostTag,
  PostStatus,
} from "@resolverTypes";
import type { ResolverFunc, DbCreatePost, ValidationErrorObject } from "@types";

type DraftPost = ResolverFunc<MutationResolvers["draftPost"]>;

interface DBUser {
  isRegistered: boolean;
  name: string;
}

interface DbPost {
  author: string;
  description: string | null;
  content: string | null;
  status: PostStatus;
  tags: string[] | null;
  slug: string | null;
}

const draftPost: DraftPost = async (_, { post }, { db, user }) => {
  const schema = Joi.object<typeof post>({
    postId: Joi.string()
      .trim()
      .uuid({ version: "uuidv4", separator: "-" })
      .messages({
        "string.empty": "Provide post id",
        "string.guid": "Invalid post id",
      }),
    title: Joi.string().required().trim().messages({
      "string.empty": "A title is required to save this post to draft",
    }),
    description: Joi.string().trim().messages({
      "string.empty": "Provide post description",
    }),
    content: Joi.string().trim().messages({
      "string.empty": "Provide post content",
    }),
    tags: Joi.array()
      .items(
        Joi.string()
          .trim()
          .uuid({ version: "uuidv4", separator: "-" })
          .messages({
            "string.empty": "Input post tags cannot be empty values",
            "string.guid": "Invalid post tag id",
          })
      )
      .min(1)
      .unique()
      .messages({
        "array.unique": "Input tags can only contain unique tags",
        "array.min": "No post tags were provided",
        "array.base": "Post tags input must be an array",
      }),
    slug: Joi.string().trim().messages({ "string.empty": "Provide post slug" }),
  });

  try {
    if (!user) return new NotAllowedError("Unable to save post to draft");

    const result = await schema.validateAsync(post, { abortEarly: false });
    const {
      postId,
      title,
      description = null,
      content = null,
      tags,
      slug = null,
    } = result;

    const findUser = db.query<DBUser>(
      `SELECT
        is_registered "isRegistered",
        concat(first_name,' ', last_name) name
      FROM users
      WHERE user_id = $1`,
      [user]
    );

    const findTitle = db.query<{ postId: string }>(
      `SELECT post_id "postId" FROM posts WHERE lower(title) = $1`,
      [title.toLowerCase()]
    );

    const [{ rows: foundUser }, { rows: foundTitle }] = await Promise.all([
      findUser,
      findTitle,
    ]);

    if (foundUser.length === 0 || !foundUser[0].isRegistered) {
      return new NotAllowedError("Unable to save post to draft");
    }

    // write content to a file on disk

    const dbTags = tags ? `{${tags.join(", ")}}` : null;
    let savedPost: DbCreatePost;
    let postTags: PostTag[] = [];

    if (tags) {
      const gottenTags = await getPostTags(db, tags);

      if (!gottenTags || gottenTags.length < tags.length) {
        return new UnknownError("Unknown post tag id provided");
      }

      postTags = gottenTags;
    }

    let newDescription: string | null = null;
    let newContent: string | null = null;
    let newTags: string[] | null = null;
    let newSlug: string | null = null;

    if (postId) {
      const { rows: checkPostId } = await db.query<DbPost>(
        `SELECT
          author,
          description,
          content,
          status,
          tags,
          slug
        FROM posts
        WHERE post_id = $1`,
        [postId]
      );

      if (checkPostId.length === 0) {
        return new UnknownError("Unknown post id provided");
      }

      if (checkPostId[0].author !== user) {
        return new UnauthorizedAuthorError(
          "Cannot update another author's draft post"
        );
      }

      if (checkPostId[0].status !== PostStatus.Draft) {
        return new NotAllowedPostActionError("Can only update a draft post");
      }

      if (foundTitle.length > 0 && foundTitle[0].postId !== postId) {
        return new DuplicatePostTitleError(
          "A post with that title has already been created"
        );
      }

      const newDbTags = checkPostId[0].tags
        ? `{${checkPostId[0].tags.join(", ")}}`
        : null;

      newDescription = checkPostId[0].description;
      newContent = checkPostId[0].content;
      newTags = checkPostId[0].tags;
      newSlug = checkPostId[0].slug;

      const {
        rows: [updateDraft],
      } = await db.query<DbCreatePost>(
        `UPDATE posts SET
          title = $1,
          description = $2,
          content = $3,
          status = $4,
          slug = $5,
          tags = $6
        WHERE post_id = $7
        RETURNING
          post_id "postId",
          image_banner "imageBanner",
          date_created "dateCreated",
          date_published "datePublished",
          last_modified "lastModified",
          views,
          likes,
          is_in_bin "isInBin",
          is_deleted "isDeleted"`,
        [
          title,
          description ?? checkPostId[0].description,
          content ?? checkPostId[0].content,
          PostStatus.Draft,
          slug ?? checkPostId[0].slug,
          dbTags ?? newDbTags,
          postId,
        ]
      );

      savedPost = updateDraft;
    } else {
      if (foundTitle.length > 0) {
        return new DuplicatePostTitleError(
          "A post with that title has already been created"
        );
      }

      const {
        rows: [newDraft],
      } = await db.query<DbCreatePost>(
        `INSERT INTO posts (
          title,
          description,
          content,
          author,
          status,
          slug,
          date_created,
          tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING
          post_id "postId",
          image_banner "imageBanner",
          date_created "dateCreated",
          date_published "datePublished",
          last_modified "lastModified",
          views,
          likes,
          is_in_bin "isInBin",
          is_deleted "isDeleted"`,
        [
          title,
          description,
          content,
          user,
          PostStatus.Draft,
          slug,
          Date.now(),
          dbTags,
        ]
      );

      savedPost = newDraft;
    }

    if (!tags && newTags) {
      const gottenTags = await getPostTags(db, newTags);
      postTags = gottenTags ?? [];
    }

    const postUrl = getPostUrl(slug ?? newSlug ?? title);
    const returnTags = postTags.length === 0 ? null : postTags;

    return new SinglePost({
      id: savedPost.postId,
      title,
      description: description ?? newDescription,
      content: content ?? newContent,
      author: foundUser[0].name,
      status: PostStatus.Draft,
      url: postUrl,
      slug: slug ?? newSlug,
      imageBanner: savedPost.imageBanner,
      dateCreated: savedPost.dateCreated,
      datePublished: savedPost.datePublished,
      lastModified: savedPost.lastModified,
      views: savedPost.views,
      likes: savedPost.likes,
      isInBin: savedPost.isInBin,
      isDeleted: savedPost.isDeleted,
      tags: returnTags,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = generateErrorsObject(err.details) as ValidationErrorObject<
        typeof post
      >;

      return new PostValidationError(errors);
    }

    throw new GraphQLError(
      "Unable to save post to draft. Please try again later"
    );
  }
};

export default draftPost;
