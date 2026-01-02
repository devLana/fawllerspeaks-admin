import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { EmailValidationError } from "@typeResolvers/auth/EmailValidationError";
import { ErrorResponse, Response } from "@typeResolvers/commonResolvers";
import { emailValidator } from "@validators/auth/email";
import generatePasswordMail from "@services/mail/generatePassword";
import { MailError } from "@lib/Errors";
import bytesHash from "@utils/auth/bytesHash";
import type { GeneratePassword } from "types/auth/generatePassword";

const generatePassword: GeneratePassword = async (_, arg, { db }) => {
  try {
    const MSG = `A confirmation mail will be sent to the email address provided`;
    const validated = await emailValidator.validateAsync(arg.email);

    const { rows } = await db.query<{ is_registered: boolean }>(
      `SELECT is_registered FROM users WHERE lower(email) = $1`,
      [validated.toLowerCase()]
    );

    if (rows.length === 0) return new ErrorResponse("ForbiddenError", MSG);

    if (rows[0].is_registered) return new ErrorResponse("ForbiddenError", MSG);

    const { hash, password } = await bytesHash();

    await db.query("BEGIN");

    await db.query(`UPDATE users SET password = $1 WHERE lower(email) = $2`, [
      hash,
      validated.toLowerCase(),
    ]);

    await generatePasswordMail(validated, password);
    await db.query("COMMIT");

    return new Response(`Default password generated. ${MSG}`);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new EmailValidationError(err.message);
    }

    if (err instanceof MailError) {
      const msg = `An error has occurred in generating a new default password. Please try again later`;

      // log the generatePassword mail error
      await db.query("ROLLBACK");
      return new ErrorResponse("ServerError", msg);
    }

    // log any system error

    throw new GraphQLError("Something went wrong. Please try again later");
  }
};

export default generatePassword;
