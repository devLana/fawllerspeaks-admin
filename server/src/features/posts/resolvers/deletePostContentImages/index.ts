import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { DeletePostContentImagesValidationError } from "./types/DeletePostContentImagesValidationError";
import {
  AuthenticationError,
  ForbiddenError,
  RegistrationError,
  Response,
  ServerError,
  UnknownError,
} from "@utils/ObjectTypes";
import { deleteFiles } from "@utils/deleteFiles";
import { deletePostContentImageSchema as schema } from "./utils/deletePostContentImages.validator";

import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type Delete = ResolverFunc<MutationResolvers["deletePostContentImages"]>;

const deletePostContentImages: Delete = async (_, { images }, { user, db }) => {
  try {
    if (!user) {
      return new AuthenticationError("Unable to delete post content image");
    }

    const input = await schema.validateAsync(images);

    if (input.length === 0) {
      return new ForbiddenError("Unable to delete post content image");
    }

    const { rows } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (rows.length === 0) {
      return new UnknownError("Unable to delete post content image");
    }

    if (!rows[0].isRegistered) {
      return new RegistrationError("Unable to delete post content image");
    }

    const { error } = await deleteFiles(input);

    if (error) {
      return new ServerError("Unable to delete post content image");
    }

    return new Response("Post content images deleted");
  } catch (err) {
    if (err instanceof ValidationError) {
      return new DeletePostContentImagesValidationError(err.details[0].message);
    }

    throw new GraphQLError("Unable to delete post content image");
  }
};

export default deletePostContentImages;
