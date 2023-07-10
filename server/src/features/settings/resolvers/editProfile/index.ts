import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { EditedProfile } from "./EditedProfile";
import { EditProfileValidationError } from "./EditProfileValidationError";
import {
  NotAllowedError,
  RegistrationError,
  generateErrorsObject,
} from "@utils";

import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc, ValidationErrorObject } from "@types";

type EditProfile = ResolverFunc<MutationResolvers["editProfile"]>;

const editProfile: EditProfile = async (_, args, { db, user }) => {
  const schema = Joi.object<typeof args>({
    firstName: Joi.string()
      .required()
      .trim()
      .pattern(/[\d]/, { invert: true })
      .messages({
        "string.empty": "Enter first name",
        "string.pattern.invert.base": "First name cannot contain numbers",
      }),
    lastName: Joi.string()
      .required()
      .trim()
      .pattern(/[\d]/, { invert: true })
      .messages({
        "string.empty": "Enter last name",
        "string.pattern.invert.base": "Last name cannot contain numbers",
      }),
  });

  try {
    if (!user) return new NotAllowedError("Unable to edit user profile");

    const validated = await schema.validateAsync(args, { abortEarly: false });
    const { firstName, lastName } = validated;

    const { rows } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (rows.length === 0) {
      return new NotAllowedError("Unable to edit user profile");
    }

    if (!rows[0].isRegistered) {
      return new RegistrationError("Unable to edit user profile");
    }

    await db.query(
      `UPDATE users SET first_name = $1, last_name = $2 WHERE user_id = $3`,
      [firstName, lastName, user]
    );

    return new EditedProfile(user, firstName, lastName);
  } catch (err) {
    if (err instanceof ValidationError) {
      const { firstNameError, lastNameError } = generateErrorsObject(
        err.details
      ) as ValidationErrorObject<typeof args>;

      return new EditProfileValidationError(firstNameError, lastNameError);
    }

    throw new GraphQLError(
      "Unable to edit user profile. Please try again later"
    );
  }
};

export default editProfile;
