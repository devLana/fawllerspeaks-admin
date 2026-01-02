import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { EditedProfile } from "@typeResolvers/settings/EditedProfile";
import { EditProfileValidationError } from "@typeResolvers/settings/EditProfileValidationError";
import { supabaseEvent } from "@events/supabase";
import { editProfileValidator as schema } from "@validators/settings/editProfile";
import { clearAuthCookie } from "@utils/auth/cookies";
import generateErrorsObject from "@utils/generateErrorsObject";
import type { Edit, SelectInfo, UserInfo } from "types/settings/editProfile";

const editProfile: Edit = async (_, args, { db, user, res }) => {
  const argsImage = args.image && args.image.trim();
  const MSG = "Unable to edit user profile";

  try {
    if (!user) {
      clearAuthCookie(res);
      if (argsImage) supabaseEvent.emit("removeImage", argsImage);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const input = await schema.validateAsync(args, { abortEarly: false });

    const { rows } = await db.query<SelectInfo>(
      `SELECT is_registered, image FROM users WHERE user_id = $1`,
      [user]
    );

    if (rows.length === 0) {
      clearAuthCookie(res);
      if (input.image) supabaseEvent.emit("removeImage", input.image);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const [{ is_registered, image }] = rows;

    if (!is_registered) {
      if (input.image) supabaseEvent.emit("removeImage", input.image);
      return new ErrorResponse("RegistrationError", MSG);
    }

    const updateImg = input.image !== undefined ? input.image : image;

    const { rows: userInfo } = await db.query<UserInfo>(
      `UPDATE users SET
        first_name = $1,
        last_name = $2,
        image = $3
      WHERE user_id = $4
      RETURNING email, date_created, image`,
      [input.firstName, input.lastName, updateImg, user]
    );

    if (input.image !== undefined && image) {
      supabaseEvent.emit("removeImage", image);
    }

    return new EditedProfile({
      id: user,
      email: userInfo[0].email,
      firstName: input.firstName,
      lastName: input.lastName,
      image: userInfo[0].image,
      isRegistered: is_registered,
      dateCreated: userInfo[0].date_created,
    });
  } catch (err) {
    if (argsImage) supabaseEvent.emit("removeImage", argsImage);

    if (err instanceof ValidationError) {
      const errors = generateErrorsObject(err.details);

      return new EditProfileValidationError(
        errors.firstNameError,
        errors.lastNameError,
        errors.imageError
      );
    }

    // log any system error

    throw new GraphQLError(`${MSG}. Please try again later`);
  }
};

export default editProfile;
