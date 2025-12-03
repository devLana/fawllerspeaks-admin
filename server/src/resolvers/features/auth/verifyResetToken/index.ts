import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { VerifyResetTokenValidationError } from "@typeResolvers/auth/VerifyResetTokenValidationError";
import { VerifiedResetToken } from "@typeResolvers/auth/VerifiedResetToken";
import { verifyTokenValidator } from "@validators/auth/verifyToken";
import type { Verification, VerifyToken } from "types/auth/verifyResetToken";

const verifyResetToken: VerifyToken = async (_, { token }, { db }) => {
  const MSG = "Unable to verify password reset token";

  try {
    const validatedToken = await verifyTokenValidator.validateAsync(token);

    const { rows } = await db.query<Verification>(
      `SELECT
        u.email,
        u.is_registered "isRegistered",
        fp.id "resetId"
      FROM users u INNER JOIN forgot_password fp
      ON u.id = fp.user_id
      WHERE fp.is_valid = TRUE AND fp.reset_token = $1`,
      [validatedToken]
    );

    if (rows.length === 0) return new ErrorResponse("NotAllowedError", MSG);

    const [{ isRegistered, email, resetId }] = rows;

    if (!isRegistered) {
      void db.query(
        `UPDATE forgot_password SET is_valid = FALSE WHERE id = $1`,
        [resetId]
      );

      const msg = `This account is currently unregistered. Please log in with the default generated password sent to you in box and register your account with a new password or reach out to support so a new default password can be generated for you`;
      return new ErrorResponse("RegistrationError", msg);
    }

    return new VerifiedResetToken(email, validatedToken);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new VerifyResetTokenValidationError(err.message);
    }

    throw new GraphQLError(`${MSG}. Please try again later`);
  }
};

export default verifyResetToken;
