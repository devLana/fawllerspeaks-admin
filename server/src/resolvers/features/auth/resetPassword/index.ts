import { GraphQLError } from "graphql";
import { ValidationError } from "joi";
import bcrypt from "bcrypt";

import { ErrorResponse, Response } from "@typeResolvers/commonResolvers";
import { ResetPasswordValidationError } from "@typeResolvers/auth/ResetPasswordValidationError";
import resetPasswordMail from "@services/mail/resetPassword";
import { resetPasswordValidator as schema } from "@validators/auth/resetPassword";
import { MailError } from "@lib/Errors";
import generateErrorsObject from "@utils/generateErrorsObject";
import type { Reset, User } from "types/auth/resetPassword";

const resetPassword: Reset = async (_, args, { db }) => {
  try {
    const MSG = "Unable to reset password";
    const validations = await schema.validateAsync(args, { abortEarly: false });
    const { token, password } = validations;

    const generateHash = bcrypt.hash(password, 10);
    const findUser = db.query<User>(
      `SELECT
        u.id "userId",
        u.email,
        u.is_registered "isRegistered",
        fp.id "resetId"
      FROM users U INNER JOIN forgot_password fp
      ON u.id = fp.user_id
      WHERE fp.is_valid = TRUE AND fp.reset_token = $1`,
      [token]
    );

    const [hash, { rows }] = await Promise.all([generateHash, findUser]);

    if (rows.length === 0) return new ErrorResponse("NotAllowedError", MSG);

    const [{ userId, email, isRegistered, resetId }] = rows;

    if (!isRegistered) {
      void db.query(
        `UPDATE forgot_password SET is_valid = FALSE WHERE id = $1`,
        [resetId]
      );

      const msg = `This account is currently unregistered. Please log in with the default generated password sent to you in box and register your account with a new password or reach out to support so a new default password can be generated for you`;
      return new ErrorResponse("RegistrationError", msg);
    }

    await db.query(
      `UPDATE forgot_password SET is_valid = FALSE WHERE resetId = $1`,
      [resetId]
    );

    await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [
      hash,
      userId,
    ]);

    await resetPasswordMail(email);

    return new Response("Your password has been reset");
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = generateErrorsObject(err.details);

      return new ResetPasswordValidationError(
        errors.tokenError,
        errors.passwordError,
        errors.confirmPasswordError
      );
    }

    if (err instanceof MailError) return new Response(err.message, "WARN");

    throw new GraphQLError("Unable to reset password. Please try again later");
  }
};

export default resetPassword;
