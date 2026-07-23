import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { EditPostTagValidationError } from "@typeResolvers/postTags/EditPostTagValidationError";
import { EditedPostTag } from "@typeResolvers/postTags/EditedPostTag";
import { EditedPostTagWarning } from "@typeResolvers/postTags/EditedPostTagWarning";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { editPostTagValidator as schema } from "@validators/postTags/editPostTag";
import { generateErrorsObject } from "@utils/generateErrorsObject";
import { clearAuthCookie } from "@utils/auth/cookies";
import type { PostTag } from "@appTypes/resolverTypes";
import type { EditPostTag } from "@appTypes/postTags/editPostTag";

const editPostTag: EditPostTag = async (_, args, { db, user, res }) => {
  try {
    const MSG = "Unable to edit post tag";

    if (!user) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const input = await schema.validateAsync(args, { abortEarly: false });
    const { name, tagId } = input;

    const { rows: findUser } = await db.query<{ is_registered: boolean }>(
      `SELECT is_registered FROM users WHERE user_id = $1`,
      [user]
    );

    if (findUser.length === 0) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    if (!findUser[0].is_registered) {
      return new ErrorResponse("RegistrationError", MSG);
    }

    const { rows } = await db.query<PostTag & { duplicateExists?: number }>(
      `WITH tag AS (
        SELECT
          name,
          tag_id id,
          date_created "dateCreated",
          last_modified "lastModified"
        FROM post_tags
        WHERE tag_id = $1
      ),
      dup AS (
        SELECT 1 as "duplicateExists"
        FROM post_tags
        WHERE tag_id != $1 AND lower(name) = $2
      )
      SELECT *
      FROM tag
      LEFT JOIN dup ON true`,
      [tagId, name.toLowerCase()]
    );

    if (rows.length === 0) {
      const msg = "The post tag you are trying to edit does not exist";
      return new ErrorResponse("NotFoundError", msg);
    }

    const [{ duplicateExists, ...tag }] = rows;

    if (tag.name === name) {
      const msg = `Post tag not updated. New post tag name is the same as the old one`;
      return new EditedPostTagWarning(tag, msg);
    }

    if (duplicateExists) {
      const msg = `A post tag with the name "${name}" already exists`;
      return new ErrorResponse("ForbiddenError", msg);
    }

    const { rows: updateTag } = await db.query<PostTag>(
      `UPDATE post_tags
      SET
        name = $1,
        last_modified = CURRENT_TIMESTAMP(3)
      WHERE tag_id = $2
      RETURNING
        tag_id id,
        name,
        date_created "dateCreated",
        last_Modified "lastModified"`,
      [name, tagId]
    );

    return new EditedPostTag(updateTag[0]);
  } catch (err) {
    if (err instanceof ValidationError) {
      const { nameError, tagIdError } = generateErrorsObject(err.details);
      return new EditPostTagValidationError(tagIdError, nameError);
    }

    // log any system error

    throw new GraphQLError("Unable to edit post tag. Please try again later");
  }
};

export default editPostTag;
