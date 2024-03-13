import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { EmailValidationError } from "../types/EmailValidationError";

import generatePasswordMail from "./utils/generatePasswordMail";
import { MailError } from "@utils/Errors";
import {
  NotAllowedError,
  RegistrationError,
  Response,
  ServerError,
} from "@utils/ObjectTypes";
import bytesHash from "@features/auth/utils/bytesHash";
import { emailValidator } from "@features/auth/utils/email.validator";

import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type GeneratePassword = ResolverFunc<MutationResolvers["generatePassword"]>;

const generatePassword: GeneratePassword = async (_, arg, { db }) => {
  try {
    const validatedEmail = await emailValidator.validateAsync(arg.email);

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
