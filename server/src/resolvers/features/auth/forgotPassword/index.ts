import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { EmailValidationError } from "@typeResolvers/auth/EmailValidationError";
import { ErrorResponse, Response } from "@typeResolvers/commonResolvers";
import forgotPasswordMail from "@services/mail/forgotPassword";
import { emailValidator } from "@validators/auth/email";
import { MailError } from "@lib/Errors";
import generateBytes from "@utils/generateBytes";

import type { ForgotPassword } from "types/auth/forgotPassword";

const forgotPassword: ForgotPassword = async (_, { email }, { db }) => {
  try {
    const validated = await emailValidator.validateAsync(email);

    const findUser = db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE lower(email) = $1`,
      [validated.toLowerCase()]
    );

    const generateToken = generateBytes(120, "base64url");
    const [token, { rows }] = await Promise.all([generateToken, findUser]);

    if (rows.length === 0) {
      const msg = "Unable to reset the password for this user";
      return new ErrorResponse("NotAllowedError", msg);
    }

    if (!rows[0].isRegistered) {
      const msg = "Unable to reset the password of an unregistered user";
      return new ErrorResponse("RegistrationError", msg);
    }

    await db.query("BEGIN");

    await db.query(`INSERT into forgot_password () VALUES ()`, [
      validated.toLowerCase(),
    ]);

    await forgotPasswordMail(validated, token);
    await db.query("COMMIT");

    const msg = `Your request is being processed and a mail will be sent to you shortly if that email address exists`;
    return new Response(msg);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new EmailValidationError(err.message);
    }

    if (err instanceof MailError) {
      await db.query("ROLLBACK");
      return new ErrorResponse("ServerError", err.message);
    }

    const msg = "Unable to send password reset link. Please try again later";
    throw new GraphQLError(msg);
  }
};

export default forgotPassword;
