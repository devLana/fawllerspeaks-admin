import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { EmailValidationError } from "../types";

import { MailError, Response, NotAllowedError, ServerError } from "@utils";
import createUserMail from "./utils/createUserMail";
import { bytesHash } from "@features/auth/utils";

import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type CreateUser = ResolverFunc<MutationResolvers["createUser"]>;

const createUser: CreateUser = async (_, { email }, { db }) => {
  const msg = "A confirmation mail has been sent to the email address provided";
  let validatedEmail: string | null = null;

  const schema = Joi.string().email().required().trim().messages({
    "string.empty": "Enter an e-mail address",
    "string.email": "Invalid e-mail address",
  });

  try {
    validatedEmail = await schema.validateAsync(email);

    const generatePassword = bytesHash();
    const findUser = db.query(
      `SELECT is_registered FROM users WHERE lower(email) = $1`,
      [validatedEmail.toLowerCase()]
    );

    const [{ hash, password }, { rows }] = await Promise.all([
      generatePassword,
      findUser,
    ]);

    if (rows.length > 0) return new NotAllowedError(msg);

    await db.query(`INSERT INTO users (email, password) VALUES ($1, $2)`, [
      validatedEmail,
      hash,
    ]);

    await createUserMail(validatedEmail, password);

    return new Response(msg);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new EmailValidationError(err.message);
    }

    if (err instanceof MailError && validatedEmail) {
      try {
        await db.query(`DELETE FROM users WHERE lower(email) = $1`, [
          validatedEmail.toLowerCase(),
        ]);

        return new ServerError(err.message);
      } catch {
        throw new GraphQLError("Unable to create user. Please try again later");
      }
    }

    throw new GraphQLError("Unable to create user. Please try again later");
  }
};

export default createUser;
