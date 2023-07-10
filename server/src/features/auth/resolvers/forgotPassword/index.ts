import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import forgotPasswordMail from "./forgotPasswordMail";
import { EmailValidationError } from "../types";
import { generateBytes } from "@features/auth/utils";
import {
  MailError,
  NotAllowedError,
  RegistrationError,
  Response,
  ServerError,
} from "@utils";

import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type ForgotPassword = ResolverFunc<MutationResolvers["forgotPassword"]>;

const forgotPassword: ForgotPassword = async (_, { email }, { db }) => {
  const schema = Joi.string().email().required().trim().messages({
    "string.empty": "Enter an e-mail address",
    "string.email": "Invalid e-mail address",
  });

  const query = `UPDATE users SET reset_token = $1 WHERE lower(email) = $2`;
  let timerId: number | null = null;
  let validatedEmail: string | null = null;

  try {
    validatedEmail = await schema.validateAsync(email);

    const findUser = db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE lower(email) = $1`,
      [validatedEmail.toLowerCase()]
    );

    const generateToken = generateBytes(120, "base64url");
    const [token, { rows }] = await Promise.all([generateToken, findUser]);

    if (rows.length === 0) {
      return new NotAllowedError("Unable to reset the password for this user");
    }

    if (!rows[0].isRegistered) {
      return new RegistrationError(
        "Unable to reset password for unregistered user"
      );
    }

    const timer = 303_000;
    const callback = (mail: string) => {
      (async () => {
        await db.query(query, [null, mail.toLowerCase()]);
      })()
        .then(() => null)
        .catch(() => null);
    };

    timerId = setTimeout(callback, timer, validatedEmail)[Symbol.toPrimitive]();

    await db.query(query, [
      `{${token}, ${timerId}}`,
      validatedEmail.toLowerCase(),
    ]);

    await forgotPasswordMail(validatedEmail, token);

    return new Response(
      "Your request is being processed and a mail will be sent to you shortly if that email address exists"
    );
  } catch (err) {
    const msg = "Unable to send password reset link. Please try again later";

    if (timerId !== null) clearTimeout(timerId);

    if (err instanceof ValidationError) {
      return new EmailValidationError(err.message);
    }

    if (err instanceof MailError && validatedEmail) {
      try {
        await db.query(query, [null, validatedEmail.toLowerCase()]);

        return new ServerError(err.message);
      } catch {
        throw new GraphQLError(msg);
      }
    }

    throw new GraphQLError(msg);
  }
};

export default forgotPassword;
