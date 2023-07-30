import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";
import bcrypt from "bcrypt";

import resetPasswordMail from "./utils/resetPasswordMail";
import { ResetPasswordValidationError } from "./types";

import {
  MailError,
  NotAllowedError,
  RegistrationError,
  Response,
  generateErrorsObject,
} from "@utils";

import { type MutationResolvers, Status } from "@resolverTypes";
import type { ResolverFunc, ValidationErrorObject } from "@types";

type Reset = ResolverFunc<MutationResolvers["resetPassword"]>;

interface User {
  isRegistered: boolean;
  email: string;
  timerId: number;
}

const resetPassword: Reset = async (_, args, { db }) => {
  const schema = Joi.object<typeof args>({
    token: Joi.string()
      .required()
      .trim()
      .messages({ "string.empty": "Provide reset token" }),
    password: Joi.string()
      .required()
      .pattern(/\d+/)
      .pattern(/[a-z]+/)
      .pattern(/[A-Z]+/)
      .pattern(/[^a-z\d]+/i)
      .min(8)
      .messages({
        "string.empty": "Enter password",
        "string.pattern.base":
          "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol",
        "string.min": "Password must be at least 8 characters long",
      }),
    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords do not match" }),
  });

  try {
    const { token, password } = await schema.validateAsync(args, {
      abortEarly: false,
    });

    const generateHash = bcrypt.hash(password, 10);
    const findUser = db.query<User>(
      `SELECT
        is_registered "isRegistered",
        email,
        reset_token[2]::INTEGER "timerId"
      FROM users
      WHERE reset_token[1] = $1`,
      [token]
    );

    const [hash, { rows }] = await Promise.all([generateHash, findUser]);

    if (rows.length === 0) {
      return new NotAllowedError("Unable to reset password");
    }

    const [{ isRegistered, email, timerId }] = rows;

    clearTimeout(timerId);

    if (!isRegistered) {
      await db.query(
        `UPDATE users SET reset_token = $1 WHERE reset_token[1] = $2`,
        [null, token]
      );

      return new RegistrationError("Unable to reset password");
    }

    await db.query(
      `UPDATE users SET password = $1, reset_token = $2 WHERE reset_token[1] = $3`,
      [hash, null, token]
    );

    await resetPasswordMail(email);

    return new Response("Your password has been reset");
  } catch (err) {
    if (err instanceof ValidationError) {
      const { tokenError, passwordError, confirmPasswordError } =
        generateErrorsObject(err.details) as ValidationErrorObject<typeof args>;

      return new ResetPasswordValidationError(
        tokenError,
        passwordError,
        confirmPasswordError
      );
    }

    if (err instanceof MailError) return new Response(err.message, Status.Warn);

    throw new GraphQLError("Unable to reset password. Please try again later");
  }
};

export default resetPassword;
