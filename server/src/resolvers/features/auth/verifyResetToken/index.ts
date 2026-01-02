import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { VerifyResetTokenValidationError } from "@typeResolvers/auth/VerifyResetTokenValidationError";
import { VerifiedResetToken } from "@typeResolvers/auth/VerifiedResetToken";
import { verifyTokenValidator } from "@validators/auth/verifyToken";
import { generateResetHash } from "@utils/auth/generateResetToken";
import type { VerifyData, VerifyToken } from "types/auth/verifyResetToken";

const verifyResetToken: VerifyToken = async (_, { token }, { db }) => {
  const MSG = "Unable to verify password reset token";

  try {
    const validatedToken = await verifyTokenValidator.validateAsync(token);
    const hash = generateResetHash(validatedToken);

    const { rows } = await db.query<VerifyData>(
      `SELECT
        u.email,
        u.is_registered,
        pr.expire_date,
        pr.used
      FROM password_reset pr
      INNER JOIN users u ON pr.user_id = u.id
      WHERE pr.token = $1`,
      [hash]
    );

    if (rows.length === 0) return new ErrorResponse("ForbiddenError", MSG);

    const [{ is_registered, email, expire_date, used }] = rows;

    if (!is_registered) {
      const msg = "The password of unregistered accounts cannot be reset";
      return new ErrorResponse("ForbiddenError", msg);
    }

    if (used) return new ErrorResponse("ForbiddenError", MSG);

    if (Date.parse(expire_date) < Date.now()) {
      const msg = "The password reset token has already expired";
      return new ErrorResponse("ForbiddenError", msg);
    }

    return new VerifiedResetToken(email, validatedToken);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new VerifyResetTokenValidationError(err.message);
    }

    // log any system errors

    throw new GraphQLError(`${MSG}. Please try again later`);
  }
};

export default verifyResetToken;
