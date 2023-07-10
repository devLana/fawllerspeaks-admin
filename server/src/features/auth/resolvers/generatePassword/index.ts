import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { bytesHash } from "@features/auth/utils";
import generatePasswordMail from "./generatePasswordMail";
import { EmailValidationError } from "../types";

import {
  MailError,
  NotAllowedError,
  RegistrationError,
  Response,
  ServerError,
} from "@utils";

import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type GeneratePassword = ResolverFunc<MutationResolvers["generatePassword"]>;

const generatePassword: GeneratePassword = async (_, arg, { db }) => {
  const schema = Joi.string().email().required().trim().messages({
    "string.empty": "Enter an e-mail address",
    "string.email": "Invalid e-mail address",
  });

  try {
    const validatedEmail = await schema.validateAsync(arg.email);

    const passwords = bytesHash();
    const findUser = db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE lower(email) = $1`,
      [validatedEmail.toLowerCase()]
    );

    const [{ hash, password }, { rows }] = await Promise.all([
      passwords,
      findUser,
    ]);

    if (rows.length === 0) {
      return new NotAllowedError(
        "A confirmation mail will be sent to the email address provided"
      );
    }

    if (rows[0].isRegistered) {
      return new RegistrationError(
        "A confirmation mail will be sent to the email address provided"
      );
    }

    await db.query(`UPDATE users SET password = $1 WHERE lower(email) = $2`, [
      hash,
      validatedEmail.toLowerCase(),
    ]);

    await generatePasswordMail(validatedEmail, password);

    return new Response(
      "A confirmation mail will be sent to the email address provided"
    );
  } catch (err) {
    if (err instanceof ValidationError) {
      return new EmailValidationError(err.message);
    }

    if (err instanceof MailError) return new ServerError(err.message);

    throw new GraphQLError("Something went wrong. Please try again later");
  }
};

export default generatePassword;
