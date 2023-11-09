import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { VerifyResetTokenValidationError, VerifiedResetToken } from "./types";
import { verifyTokenValidator } from "./utils/verifyToken.validator";
import { NotAllowedError, RegistrationError } from "@utils";

import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type VerifyToken = ResolverFunc<MutationResolvers["verifyResetToken"]>;

interface Verification {
  email: string;
  isRegistered: boolean;
}

const verifyResetToken: VerifyToken = async (_, { token }, { db }) => {
  try {
    const validatedToken = await verifyTokenValidator.validateAsync(token);

    const { rows } = await db.query<Verification>(
      `SELECT email, is_registered "isRegistered" FROM users WHERE reset_token[1] = $1`,
      [validatedToken]
    );

    if (rows.length === 0) {
      return new NotAllowedError("Unable to verify password reset token");
    }

    const [{ isRegistered, email }] = rows;

    if (!isRegistered) {
      await db.query(
        `UPDATE users SET reset_token = $1 WHERE reset_token[1] = $2`,
        [null, validatedToken]
      );

      return new RegistrationError("Unable to verify password reset token");
    }

    return new VerifiedResetToken(email, validatedToken);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new VerifyResetTokenValidationError(err.message);
    }

    throw new GraphQLError(
      "Unable to verify password reset token. Please try again later"
    );
  }
};

export default verifyResetToken;
