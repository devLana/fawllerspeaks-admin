import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { EditedProfile, EditProfileValidationError } from "./types";
import {
  AuthenticationError,
  RegistrationError,
  UnknownError,
  dateToISOString,
  generateErrorsObject,
} from "@utils";

import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc, ValidationErrorObject } from "@types";

type EditProfile = ResolverFunc<MutationResolvers["editProfile"]>;

interface UserInfo {
  dateCreated: string;
  email: string;
  image: string | null;
}

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
    image: Joi.string().uri().trim().allow(null).messages({
      "string.empty": "Profile image url cannot be empty",
      "string.uri": "Profile image url is not a valid link",
    }),
  });

  try {
    if (!user) return new AuthenticationError("Unable to edit user profile");

    const validated = await schema.validateAsync(args, { abortEarly: false });
    const { firstName, lastName, image } = validated;

    const { rows } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (rows.length === 0) {
      return new UnknownError("Unable to edit user profile");
    }

    if (!rows[0].isRegistered) {
      return new RegistrationError("Unable to edit user profile");
    }

    let query: string;
    let params: (string | null)[];

    if (image === undefined) {
      query = `
        UPDATE users
        SET first_name = $1, last_name = $2
        WHERE user_id = $3
        RETURNING email, date_created "dateCreated", image
      `;

      params = [firstName, lastName, user];
    } else {
      query = `
        UPDATE users
        SET first_name = $1, last_name = $2, image = $3
        WHERE user_id = $4
        RETURNING email, date_created "dateCreated", image
      `;

      params = [firstName, lastName, image, user];
    }

    const { rows: userInfo } = await db.query<UserInfo>(query, params);

    return new EditedProfile({
      id: user,
      email: userInfo[0].email,
      firstName,
      lastName,
      image: userInfo[0].image,
      isRegistered: rows[0].isRegistered,
      dateCreated: dateToISOString(userInfo[0].dateCreated),
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      const { firstNameError, lastNameError, imageError } =
        generateErrorsObject(err.details) as ValidationErrorObject<typeof args>;

      return new EditProfileValidationError(
        firstNameError,
        lastNameError,
        imageError
      );
    }

    throw new GraphQLError(
      "Unable to edit user profile. Please try again later"
    );
  }
};

export default editProfile;
