import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { EmailValidationError } from "@typeResolvers/auth/EmailValidationError";
import { ErrorResponse, Response } from "@typeResolvers/commonResolvers";
import createUserMail from "@services/mail/createUser";
import { emailValidator } from "@validators/auth/email";
import { MailError } from "@lib/Errors";
import bytesHash from "@utils/auth/bytesHash";
import type { CreateUser } from "types/auth/createUser";

const createUser: CreateUser = async (_, { email }, { db }) => {
  try {
    const validatedEmail = await emailValidator.validateAsync(email);

    const user = await db.query(`SELECT 1 FROM users WHERE lower(email) = $1`, [
      validatedEmail.toLowerCase(),
    ]);

    if (user.rows.length > 0) {
      const msg = "The new user you are trying to create already exits";
      return new ErrorResponse("NotAllowedError", msg);
    }
    const { hash, password } = await bytesHash();

    await db.query("BEGIN");

    await db.query(`INSERT INTO users (email, password) VALUES ($1, $2)`, [
      validatedEmail,
      hash,
    ]);

    await createUserMail(validatedEmail, password);
    void db.query("COMMIT");

    const msg = `New user created. A confirmation mail has been sent to their email address`;
    return new Response(msg);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new EmailValidationError(err.message);
    }

    if (err instanceof MailError) {
      const msg = `An error has occurred in trying to create the new user. Please try again later`;

      // log the create user mail error
      void db.query("ROLLBACK");
      return new ErrorResponse("ServerError", msg);
    }

    // log any system error

    throw new GraphQLError("Unable to create user. Please try again later");
  }
};

export default createUser;
