import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import {
  EditedPostTag,
  EditedPostTagWarning,
  EditPostTagValidationError,
} from "./types";
import { DuplicatePostTagError } from "../types";
import {
  AuthenticationError,
  NotAllowedError,
  RegistrationError,
  UnknownError,
  generateErrorsObject,
} from "@utils";
import { formatTagName } from "@features/postTags/utils";

import type { MutationResolvers, PostTag } from "@resolverTypes";
import type { ResolverFunc, ValidationErrorObject } from "@types";

type EditPostTag = ResolverFunc<MutationResolvers["editPostTag"]>;

const editPostTag: EditPostTag = async (_, args, { db, user }) => {
  const schema = Joi.object<typeof args>({
    tagId: Joi.string()
      .required()
      .trim()
      .uuid({ version: "uuidv4", separator: "-" })
      .messages({
        "string.guid": "Invalid post tag id",
        "string.empty": "Provide post tag id",
      }),
    name: Joi.string().required().trim().messages({
      "string.empty": "Provide post tag name",
    }),
  });

  try {
    if (!user) return new AuthenticationError("Unable to edit post tag");

    const { name, tagId } = await schema.validateAsync(args, {
      abortEarly: false,
    });

    const { rows: findUser } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (findUser.length === 0) {
      return new NotAllowedError("Unable to edit post tag");
    }

    if (!findUser[0].isRegistered) {
      return new RegistrationError("Unable to edit post tag");
    }

    const { rows: findTagId } = await db.query<PostTag>(
      `SELECT
        name,
        tag_id id,
        date_created "dateCreated",
        last_Modified "lastModified"
      FROM post_tags
      WHERE tag_id = $1`,
      [tagId]
    );

    if (findTagId.length === 0) {
      return new UnknownError(
        "The post tag you are trying to edit does not exist"
      );
    }

    const [tag] = findTagId;

    if (tag.name === name) {
      return new EditedPostTagWarning(
        tag,
        "Post tag not updated. New post tag name is the same as the old one"
      );
    }

    if (formatTagName(tag.name) === formatTagName(name)) {
      const { rows: updateTag } = await db.query<PostTag>(
        `UPDATE post_tags
        SET name = $1, last_modified = $2
        WHERE tag_id = $3
        RETURNING
          tag_id id,
          name,
          date_created "dateCreated",
          last_Modified "lastModified"`,
        [name, new Date().toISOString(), tagId]
      );

      return new EditedPostTag(updateTag[0]);
    }

    const { rows: findTagName } = await db.query<{ name: string }>(
      `SELECT name
      FROM post_tags
      WHERE lower(replace(replace(replace(name, '-', ''), ' ', ''), '_', '')) = $1`,
      [formatTagName(name)]
    );

    if (findTagName.length > 0) {
      const [{ name: tagName }] = findTagName;

      const str =
        tagName === name
          ? `A post tag with the name "${name}" already exists`
          : `A similar post tag, "${tagName}", already exists`;

      return new DuplicatePostTagError(str);
    }

    const { rows: updateTag } = await db.query<PostTag>(
      `UPDATE post_tags
      SET name = $1, last_modified = $2
      WHERE tag_id = $3
      RETURNING
        tag_id id,
        name,
        date_created "dateCreated",
        last_Modified "lastModified"`,
      [name, new Date().toISOString(), tagId]
    );

    return new EditedPostTag(updateTag[0]);
  } catch (err) {
    if (err instanceof ValidationError) {
      const { nameError, tagIdError } = generateErrorsObject(
        err.details
      ) as ValidationErrorObject<typeof args>;

      return new EditPostTagValidationError(tagIdError, nameError);
    }

    throw new GraphQLError("Unable to edit post tag. Please try again later");
  }
};

export default editPostTag;
