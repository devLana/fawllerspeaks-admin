import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { ErrorResponse, Response } from "@typeResolvers/commonResolvers";
import { DeletePostContentImagesValidationError } from "@typeResolvers/posts/DeletePostContentImagesValidationError";
import { deleteImages } from "@services/supabase/deleteImages";
import { deletePostContentImageSchema as schema } from "@validators/posts/deletePostContentImages";
import type { Delete } from "types/posts/deletePostContentImages";

const deletePostContentImages: Delete = async (_, { images }, { user, db }) => {
  const MSG = "Unable to delete post content image";

  try {
    if (!user) return new ErrorResponse("AuthenticationError", MSG);

    const input = await schema.validateAsync(images);

    if (input.length === 0) return new ErrorResponse("ForbiddenError", MSG);

    const { rows } = await db.query<{ is_registered: boolean }>(
      `SELECT is_registered FROM users WHERE user_id = $1`,
      [user]
    );

    if (rows.length === 0) return new ErrorResponse("UnknownError", MSG);

    if (!rows[0].is_registered) {
      return new ErrorResponse("RegistrationError", MSG);
    }

    const { error } = await deleteImages(input);

    if (error) return new ErrorResponse("ServerError", MSG);

    return new Response("Post content images deleted");
  } catch (err) {
    if (err instanceof ValidationError) {
      return new DeletePostContentImagesValidationError(err.details[0].message);
    }

    throw new GraphQLError(MSG);
  }
};

export default deletePostContentImages;
