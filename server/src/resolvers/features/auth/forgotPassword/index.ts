import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { EmailValidationError } from "@typeResolvers/auth/EmailValidationError";
import { ErrorResponse, Response } from "@typeResolvers/commonResolvers";
import forgotPasswordMail from "@services/mail/forgotPassword";
import { emailValidator } from "@validators/auth/email";
import { MailError } from "@lib/Errors";
import generateResetToken from "@utils/auth/generateResetToken";
import type { ForgotPassword, UserData } from "types/auth/forgotPassword";

const forgotPassword: ForgotPassword = async (_, { email }, { db }) => {
  const MSG = "Unable to reset user password";

  try {
    const validated = await emailValidator.validateAsync(email);

    const { rows } = await db.query<UserData>(
      `SELECT id, email, is_registered FROM users WHERE lower(email) = $1`,
      [validated.toLowerCase()]
    );

    if (rows.length === 0) return new ErrorResponse("NotAllowedError", MSG);

    const [{ id, email: userEmail, is_registered }] = rows;

    if (!is_registered) return new ErrorResponse("RegistrationError", MSG);

    const { token, hash } = await generateResetToken();

    await db.query("BEGIN");

    await db.query(
      `INSERT into password_reset (user_id, token) VALUES ($1, $2)`,
      [id, hash]
    );

    await forgotPasswordMail(userEmail, token);
    await db.query("COMMIT");

    const msg = `A password reset link has been sent to the email address provided`;
    return new Response(msg);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new EmailValidationError(err.message);
    }

    if (err instanceof MailError) {
      const msg = `An error has occurred in trying to set up your password reset. Please try again later`;

      // log mail error
      void db.query("ROLLBACK");
      return new ErrorResponse("ServerError", msg);
    }

    // log any system errors

    throw new GraphQLError(`${MSG}. Please try again later`);
  }
};

export default forgotPassword;
