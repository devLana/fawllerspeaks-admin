import { GraphQLError } from "graphql";
import { ValidationError } from "joi";
import bcrypt from "bcrypt";

import changePasswordMail from "@services/mail/changePassword";
import { ChangePasswordValidationError } from "@typeResolvers/settings/ChangePasswordValidationError";
import { ErrorResponse, Response } from "@typeResolvers/commonResolvers";
import { changePasswordValidator as schema } from "@validators/settings/changePassword";
import { MailError } from "@lib/Errors";
import generateErrorsObject from "@utils/generateErrorsObject";
import deleteSession from "@utils/deleteSession";
import type { ChangePassword as Fn, User } from "types/settings/changePassword";

const changePassword: Fn = async (_, args, { db, user, req, res }) => {
  try {
    const MSG = "Unable to change password";
    const { auth } = req.cookies;

    if (!user || !auth) {
      deleteSession(db, req, res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const input = await schema.validateAsync(args, { abortEarly: false });
    const { newPassword, currentPassword } = input;

    const { rows } = await db.query<User>(
      `WITH find_user AS (
        SELECT
          id,
          password,
          is_Registered,
          email
        FROM users
        WHERE user_id = $1
      )
      SELECT
        fu.id "uId",
        fu.password,
        fu.is_registered,
        fu.email,
        s.id "sId"
      FROM find_user fu
      LEFT JOIN sessions s ON fu.id = s.user_id
      WHERE s.refresh_token = $2`,
      [user, auth]
    );

    if (rows.length === 0) {
      deleteSession(db, req, res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const [{ uId, email, is_registered, password, sId }] = rows;

    if (!is_registered) return new ErrorResponse("RegistrationError", MSG);

    const matchPasswords = await bcrypt.compare(currentPassword, password);

    if (!matchPasswords) return new ErrorResponse("NotAllowedError", MSG);

    const hash = await bcrypt.hash(newPassword, 10);

    await db.query(
      `WITH change_password AS (
        UPDATE users SET password = $1 WHERE id = $2
      ),
      revoke_sessions AS (
        UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP(3) WHERE revoked_at IS NULL AND user_id = $2 AND id != $3
      )
      SELECT 1`,
      [hash, uId, sId]
    );

    await changePasswordMail(email);

    return new Response("Password changed");
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = generateErrorsObject(err.details);

      return new ChangePasswordValidationError(
        errors.currentPasswordError,
        errors.newPasswordError,
        errors.confirmNewPasswordError
      );
    }

    if (err instanceof MailError) {
      // log the mail error
      return new Response("Password changed");
    }

    // log any other system error

    throw new GraphQLError("Unable to change password. Please try again later");
  }
};

export default changePassword;
