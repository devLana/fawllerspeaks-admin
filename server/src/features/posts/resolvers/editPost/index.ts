import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { getPostTags, getPostUrl } from "@features/posts/utils";
import {
  DuplicatePostTitleError,
  NotAllowedPostActionError,
  PostValidationError,
  SinglePost,
  UnauthorizedAuthorError,
} from "../types";
import {
  dateToISOString,
  NotAllowedError,
  UnknownError,
  generateErrorsObject,
} from "@utils";

import type { MutationResolvers, PostTag, PostStatus } from "@resolverTypes";
import type { PostDBData, ResolverFunc, ValidationErrorObject } from "@types";

type EditPost = ResolverFunc<MutationResolvers["editPost"]>;

interface DbFindPost {
  authorId: string;
  authorName: string;
  authorImage: string | null;
  postStatus: PostStatus;
  foundImageBanner: string | null;
  foundTags: string[] | null;
}

const editPost: EditPost = async (_, { post }, { user, db }) => {
  const schema = Joi.object<typeof post>({
    postId: Joi.string()
      .required()
      .trim()
      .uuid({ version: "uuidv4", separator: "-" })
      .messages({
        "string.empty": "Provide post id",
        "string.guid": "Invalid post id",
      }),
    title: Joi.string().required().trim().messages({
      "string.empty": "Provide post title",
    }),
    description: Joi.string().required().trim().messages({
      "string.empty": "Provide post description",
    }),
    content: Joi.string().required().trim().messages({
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
    imageBanner: Joi.string()
      .trim()
      .messages({ "string.empty": "Provide post image banner link" }),
  });

  try {
    if (!user) return new NotAllowedError("Unable to edit post");

    const input = await schema.validateAsync(post, { abortEarly: false });
    const {
      postId,
      title,
      description,
      content,
      tags,
      imageBanner = null,
    } = input;

    let postTags: PostTag[] = [];

    if (tags) {
      const gottenTags = await getPostTags(db, tags);

      if (!gottenTags || gottenTags.length < tags.length) {
        return new UnknownError("Unknown post tag id provided");
      }

      postTags = gottenTags;
    }

    const findUser = db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    const findPostById = db.query<DbFindPost>(
      `SELECT
        author "authorId",
        first_name || ' ' || last_name "authorName",
        image "authorImage",
        status "postStatus",
        image_banner "foundImageBanner",
        tags "foundTags"
      FROM posts LEFT JOIN users ON author = user_id
      WHERE post_id = $1`,
      [postId]
    );

    const checkTitle = db.query<{ postId: string }>(
      `SELECT post_id "postId" FROM posts WHERE lower(title) = $1`,
      [title.toLowerCase()]
    );

    const [{ rows: foundUser }, { rows: foundPost }, { rows: checkedTitle }] =
      await Promise.all([findUser, findPostById, checkTitle]);

    if (foundUser.length === 0 || !foundUser[0].isRegistered) {
      return new NotAllowedError("Unable to edit post");
    }

    if (foundPost.length === 0) {
      return new UnknownError(
        "We could not find the post you are trying to edit"
      );
    }

    const [
      {
        authorId,
        authorName,
        authorImage,
        postStatus,
        foundImageBanner,
        foundTags,
      },
    ] = foundPost;

    if (authorId !== user) {
      return new UnauthorizedAuthorError(
        "Unable to edit another author's post"
      );
    }

    if (postStatus !== "Published" && postStatus !== "Unpublished") {
      return new NotAllowedPostActionError(
        "Can only edit published or unpublished posts"
      );
    }

    if (checkedTitle.length > 0 && checkedTitle[0].postId !== postId) {
      return new DuplicatePostTitleError(
        "A post has already been created with that title"
      );
    }

    if (!tags && foundTags) {
      const gottenTags = await getPostTags(db, foundTags);
      postTags = gottenTags ?? [];
    }

    const dbImageBanner = imageBanner ?? foundImageBanner;
    const tagsToSave = tags ?? foundTags;
    const dbTags = tagsToSave ? `{${tagsToSave.join(", ")}}` : null;

    const { rows: editedPost } = await db.query<Omit<PostDBData, "postId">>(
      `UPDATE posts SET
        title = $1,
        description = $2,
        content = $3,
        image_banner = $4,
        last_modified = $5,
        tags = $6
      WHERE post_id = $7
      RETURNING
        slug,
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
        dbImageBanner,
        new Date().toISOString(),
        dbTags,
        postId,
      ]
    );

    const [edited] = editedPost;
    const { url, slug } = getPostUrl(dbImageBanner ?? title);
    const returnTags = postTags.length === 0 ? null : postTags;

    return new SinglePost({
      ...edited,
      id: postId,
      title,
      description,
      content,
      author: { name: authorName, image: authorImage },
      status: postStatus,
      url,
      slug,
      imageBanner: dbImageBanner,
      dateCreated: dateToISOString(edited.dateCreated),
      datePublished: edited.datePublished
        ? dateToISOString(edited.datePublished)
        : edited.datePublished,
      lastModified: edited.lastModified
        ? dateToISOString(edited.lastModified)
        : edited.lastModified,
      tags: returnTags,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = generateErrorsObject(err.details) as ValidationErrorObject<
        typeof post
      >;

      return new PostValidationError(errors);
    }

    throw new GraphQLError("Unable to edit post. Please try again later");
  }
};

export default editPost;
