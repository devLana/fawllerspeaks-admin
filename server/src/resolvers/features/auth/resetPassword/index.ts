import { GraphQLError } from "graphql";
import { ValidationError } from "joi";
import bcrypt from "bcrypt";

import { ErrorResponse, Response } from "@typeResolvers/commonResolvers";
import { ResetPasswordValidationError } from "@typeResolvers/auth/ResetPasswordValidationError";
import resetPasswordMail from "@services/mail/resetPassword";
import { resetPasswordValidator as schema } from "@validators/auth/resetPassword";
import { MailError } from "@lib/Errors";
import { generateResetHash } from "@utils/auth/generateResetToken";
import generateErrorsObject from "@utils/generateErrorsObject";
import type { Reset, User } from "types/auth/resetPassword";

const resetPassword: Reset = async (_, args, { db }) => {
  try {
    const MSG = "Unable to reset password";
    const input = await schema.validateAsync(args, { abortEarly: false });
    const tokenHash = generateResetHash(input.token);

    const { rows } = await db.query<User>(
      `SELECT
        u.id "userId",
        u.email,
        u.is_registered,
        pr.used,
        pr.expire_date
      FROM password_reset pr
      INNER JOIN users u ON pr.user_id = u.id
      WHERE pr.token = $1`,
      [tokenHash]
    );

    if (rows.length === 0) return new ErrorResponse("ForbiddenError", MSG);

    const [{ userId, email, is_registered, expire_date, used }] = rows;

    if (!is_registered) {
      const msg = "The password of unregistered accounts cannot be reset";
      return new ErrorResponse("ForbiddenError", msg);
    }

    if (used) return new ErrorResponse("ForbiddenError", MSG);

    if (Date.parse(expire_date) < Date.now()) {
      const msg = "The password reset token has already expired";
      return new ErrorResponse("ForbiddenError", msg);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    await db.query(
      `WITH reset_password AS (
        UPDATE users SET password = $1 WHERE id = $2
      ),
      set_reset_token_as_used AS (
        UPDATE password_reset SET used = true WHERE token = $3
      ),
      revoke_all_sessions AS (
        UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP(3) WHERE revoked_at IS NULL AND user_id = $2
      )
      SELECT 1`,
      [passwordHash, userId, tokenHash]
    );

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

    if (err instanceof MailError) {
      // log mail error
      return new Response("Your password has been reset");
    }

    // log any system errors

    throw new GraphQLError("Unable to reset password. Please try again later");
  }
};

export default resetPassword;
