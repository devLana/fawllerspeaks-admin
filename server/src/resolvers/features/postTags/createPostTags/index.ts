import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { PostTags } from "@typeResolvers/postTags/PostTags";
import { CreatePostTagsValidationError } from "@typeResolvers/postTags/CreatePostTagsValidationError";
import { CreatedPostTagsWarning } from "@typeResolvers/postTags/CreatedPostTagsWarning";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { createPostTagsValidator as schema } from "@validators/postTags/createPostTags";
import deleteSession from "@utils/deleteSession";
import type { PostTag } from "@resolverTypes";
import type { CreatePostTags as Fn } from "types/postTags/createPostTags";

const createPostTags: Fn = async (_, { tags }, { user, db, req, res }) => {
  const tagOrTags = tags.length > 1 ? "tags" : "tag";
  const MSG = `Unable to create post ${tagOrTags}`;

  try {
    if (!user) {
      void deleteSession(db, req, res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const inputTags = await schema.validateAsync(tags, { abortEarly: false });

    const { rows: author } = await db.query<{ is_registered: boolean }>(
      `SELECT is_registered FROM users WHERE user_id = $1`,
      [user]
    );

    if (author.length === 0) {
      void deleteSession(db, req, res);
      return new ErrorResponse("UnknownError", MSG);
    }

    if (!author[0].is_registered) {
      return new ErrorResponse("RegistrationError", MSG);
    }

    const values: string[] = [];
    let params = "";
    let createdPostTags: PostTag[] = [];

    inputTags.forEach((tag, index, arr) => {
      const comma = index !== arr.length - 1 ? "," : "";

      params = `${params}($${index + 1})${comma}`;
      values.push(tag);
    });

    if (params && values.length > 0) {
      ({ rows: createdPostTags } = await db.query<PostTag>(
        `INSERT INTO post_tags (name)
        VALUES ${params}
        ON CONFLICT (name) DO NOTHING
        RETURNING
          tag_id id,
          name,
          date_created "dateCreated",
          last_Modified "lastModified"`,
        values
      ));
    }

    if (createdPostTags.length === 0) {
      const msg =
        inputTags.length > 1
          ? "Post tags with similar names to the ones provided already exist"
          : "A post tag with a similar name to the one provided already exists";

      return new ErrorResponse("DuplicatePostTagError", msg);
    }

    if (createdPostTags.length < inputTags.length) {
      const _tagOrTags = createdPostTags.length > 1 ? "tags" : "tag";
      const diff = Math.abs(createdPostTags.length - inputTags.length);
      const msg = `${createdPostTags.length} post ${_tagOrTags} created. ${diff} of the post ${tagOrTags} provided already exist`;

      return new CreatedPostTagsWarning(createdPostTags, msg);
    }

    return new PostTags(createdPostTags);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new CreatePostTagsValidationError(err.details[0].message);
    }

    // log any system error

    throw new GraphQLError(`${MSG}. Please try again later`);
  }
};

export default createPostTags;
