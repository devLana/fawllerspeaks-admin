import { GraphQLError } from "graphql";
import { ValidationError } from "joi";
import bcrypt from "bcrypt";

import resetPasswordMail from "./utils/resetPasswordMail";
import { ResetPasswordValidationError } from "./types";
import { resetPasswordValidator } from "./utils/resetPassword.validator";

import {
  MailError,
  NotAllowedError,
  RegistrationError,
  Response,
  generateErrorsObject,
} from "@utils";

import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc, ValidationErrorObject } from "@types";

type Reset = ResolverFunc<MutationResolvers["resetPassword"]>;

interface User {
  isRegistered: boolean;
  email: string;
  timerId: number;
}

const resetPassword: Reset = async (_, args, { db }) => {
  try {
    const validations = await resetPasswordValidator.validateAsync(args, {
      abortEarly: false,
    });
    const { token, password } = validations;

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

    if (err instanceof MailError) return new Response(err.message, "WARN");

    throw new GraphQLError("Unable to reset password. Please try again later");
  }
};

export default resetPassword;
