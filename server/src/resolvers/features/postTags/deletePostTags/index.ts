import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { DeletePostTagsValidationError } from "@typeResolvers/postTags/DeletePostTagsValidationError";
import { DeletedPostTags } from "@typeResolvers/postTags/DeletedPostTags";
import { DeletedPostTagsWarning } from "@typeResolvers/postTags/DeletedPostTagsWarning";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { deletePostTagsValidator as schema } from "@validators/postTags/deletePostTags";
import { clearAuthCookie } from "@utils/auth/cookies";
import type { DeletePostTags as Fn, Del } from "types/postTags/deletePostTags";

const deletePostTags: Fn = async (_, { tagIds }, { db, user, res }) => {
  const MSG = `Unable to delete post ${tagIds.length > 1 ? "tags" : "tag"}`;

  try {
    if (!user) {
      clearAuthCookie(res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const inputTags = await schema.validateAsync(tagIds, { abortEarly: false });

    const { rows: findUser } = await db.query<{ is_registered: boolean }>(
      `SELECT is_registered FROM users WHERE user_id = $1`,
      [user]
    );

    if (findUser.length === 0) {
      clearAuthCookie(res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    if (!findUser[0].is_registered) {
      return new ErrorResponse("RegistrationError", MSG);
    }

    const { rows: allDeletedTags } = await db.query<Del>(
      `DELETE FROM post_tags
      WHERE tag_id = ANY ($1)
      RETURNING tag_id id, name`,
      [inputTags]
    );

    if (allDeletedTags.length === 0) {
      const msg =
        inputTags.length === 1
          ? "The selected post tag could not be deleted"
          : "None of the selected post tags could be deleted";

      return new ErrorResponse("UnknownError", msg);
    }

    const deletedTagIds = allDeletedTags.map(tag => tag.id);

    if (allDeletedTags.length < inputTags.length) {
      const message = `${allDeletedTags.length} out of ${inputTags.length} post tags deleted`;
      return new DeletedPostTagsWarning(deletedTagIds, message);
    }

    return new DeletedPostTags(deletedTagIds);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new DeletePostTagsValidationError(err.details[0].message);
    }

    // log any system error

    throw new GraphQLError(`${MSG}. Please try again later`);
  }
};

export default deletePostTags;
