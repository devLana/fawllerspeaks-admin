import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import { EditedProfile } from "./types/EditedProfile";
import { EditProfileValidationError } from "./types/EditProfileValidationError";
import { editProfileValidator } from "./utils/editProfile.validator";
import {
  AuthenticationError,
  RegistrationError,
  UnknownError,
} from "@utils/ObjectTypes";
import generateErrorsObject from "@utils/generateErrorsObject";
import deleteSession from "@utils/deleteSession";

import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc, ValidationErrorObject } from "@types";

type EditProfile = ResolverFunc<MutationResolvers["editProfile"]>;

interface SelectUSerInfo {
  isRegistered: boolean;
  image: string | null;
}

interface UserInfo {
  dateCreated: string;
  email: string;
  image: string | null;
}

const editProfile: EditProfile = async (_, args, { db, user, req, res }) => {
  try {
    if (!user) {
      if (args.image) supabaseEvent.emit("removeImage", args.image);
      await deleteSession(db, req, res);
      return new AuthenticationError("Unable to edit user profile");
    }

    const validated = await editProfileValidator.validateAsync(args, {
      abortEarly: false,
    });

    const { firstName, lastName, image } = validated;

    const { rows } = await db.query<SelectUSerInfo>(
      `SELECT is_registered "isRegistered", image FROM users WHERE user_id = $1`,
      [user]
    );

    if (rows.length === 0) {
      if (image) supabaseEvent.emit("removeImage", image);
      await deleteSession(db, req, res);
      return new UnknownError("Unable to edit user profile");
    }

    const [{ isRegistered, image: userImage }] = rows;

    if (!isRegistered) {
      if (image) supabaseEvent.emit("removeImage", image);
      return new RegistrationError("Unable to edit user profile");
    }

    let query: string;
    let params: (string | null)[];

    if (image === undefined) {
      params = [firstName, lastName, user];
      query = `
        UPDATE users
        SET first_name = $1, last_name = $2
        WHERE user_id = $3
        RETURNING email, date_created "dateCreated", image
      `;
    } else {
      params = [firstName, lastName, image, user];
      query = `
        UPDATE users
        SET first_name = $1, last_name = $2, image = $3
        WHERE user_id = $4
        RETURNING email, date_created "dateCreated", image
      `;
    }

    const { rows: userInfo } = await db.query<UserInfo>(query, params);

    if (image !== undefined && userImage) {
      supabaseEvent.emit("removeImage", userImage);
    }

    return new EditedProfile({
      id: user,
      email: userInfo[0].email,
      firstName,
      lastName,
      image: userInfo[0].image,
      isRegistered,
      dateCreated: userInfo[0].dateCreated,
    });
  } catch (err) {
    if (args.image) supabaseEvent.emit("removeImage", args.image);

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
