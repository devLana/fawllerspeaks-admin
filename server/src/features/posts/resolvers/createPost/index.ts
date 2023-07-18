import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { getPostTags, getPostUrl } from "@features/posts/utils";
import { SinglePost, DuplicatePostTitleError } from "../types";
import { CreatePostValidationError } from "./CreatePostValidationError";
import {
  NotAllowedError,
  UnknownError,
  dateToISOString,
  generateErrorsObject,
} from "@utils";

import {
  type MutationResolvers,
  type PostTag,
  PostStatus,
} from "@resolverTypes";
import type { ResolverFunc, DbCreatePost, ValidationErrorObject } from "@types";

type CreatePost = ResolverFunc<MutationResolvers["createPost"]>;

interface FindUser {
  isRegistered: boolean;
  name: string;
}

const createPost: CreatePost = async (_, { post }, { db, user }) => {
  const schema = Joi.object<typeof post>({
    title: Joi.string()
      .required()
      .trim()
      .messages({ "string.empty": "Provide post title" }),
    description: Joi.string()
      .required()
      .trim()
      .messages({ "string.empty": "Provide post description" }),
    content: Joi.string()
      .required()
      .trim()
      .messages({ "string.empty": "Provide post content" }),
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
    if (!user) return new NotAllowedError("Unable to create post");

    const result = await schema.validateAsync(post, { abortEarly: false });
    const { title, description, content, tags, slug = null } = result;

    let postTags: PostTag[] = [];

    if (tags) {
      const gottenTags = await getPostTags(db, tags);

      if (!gottenTags || gottenTags.length < tags.length) {
        return new UnknownError("Unknown post tag id provided");
      }

      postTags = gottenTags;
    }

    const checkUser = db.query<FindUser>(
      `SELECT
        is_registered "isRegistered",
        concat(first_name,' ', last_name) name
      FROM users
      WHERE user_id = $1`,
      [user]
    );

    const checkTitle = db.query(
      `SELECT id FROM posts WHERE lower(title) = $1`,
      [title.toLowerCase()]
    );

    const [foundUser, foundTitle] = await Promise.all([checkUser, checkTitle]);
    const { rows: loggedInUser } = foundUser;
    const { rows: savedTitle } = foundTitle;

    if (loggedInUser.length === 0 || !loggedInUser[0].isRegistered) {
      return new NotAllowedError("Unable to create post");
    }

    if (savedTitle.length > 0) {
      return new DuplicatePostTitleError(
        "A post with that title has already been created"
      );
    }

    // write content to a file on disk

    const dbTags = tags ? `{${tags.join(", ")}}` : null;

    const { rows: savedPost } = await db.query<DbCreatePost>(
      `INSERT INTO posts (
        title,
        description,
        content,
        author,
        status,
        slug,
        tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
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
      [title, description, content, user, PostStatus.Unpublished, slug, dbTags]
    );

    const [saved] = savedPost;
    const postUrl = getPostUrl(slug ?? title);
    const returnTags = tags ? postTags : null;

    return new SinglePost({
      id: saved.postId,
      title,
      description,
      content,
      author: loggedInUser[0].name,
      status: PostStatus.Unpublished,
      url: postUrl,
      slug,
      imageBanner: saved.imageBanner,
      dateCreated: dateToISOString(saved.dateCreated),
      datePublished: saved.datePublished
        ? dateToISOString(saved.datePublished)
        : saved.datePublished,
      lastModified: saved.lastModified
        ? dateToISOString(saved.lastModified)
        : saved.lastModified,
      views: saved.views,
      likes: saved.likes,
      isInBin: saved.isInBin,
      isDeleted: saved.isDeleted,
      tags: returnTags,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = generateErrorsObject(err.details) as ValidationErrorObject<
        typeof post
      >;
      return new CreatePostValidationError(errors);
    }

    throw new GraphQLError("Unable to create post. Please try again later");
  }
};

export default createPost;
