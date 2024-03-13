import { GraphQLError } from "graphql";
import { ValidationError } from "joi";
import bcrypt from "bcrypt";

import changePasswordMail from "./utils/changePasswordMail";
import { ChangePasswordValidationError } from "./types/ChangePasswordValidationError";
import { changePasswordValidator } from "./utils/changePassword.validator";
import {
  AuthenticationError,
  NotAllowedError,
  RegistrationError,
  Response,
  ServerError,
  UnknownError,
} from "@utils/ObjectTypes";
import { MailError } from "@utils/Errors";
import generateErrorsObject from "@utils/generateErrorsObject";

import { type MutationResolvers } from "@resolverTypes";
import type { ValidationErrorObject, ResolverFunc } from "@types";

type ChangePassword = ResolverFunc<MutationResolvers["changePassword"]>;

interface User {
  email: string;
  isRegistered: boolean;
  password: string;
}

const changePassword: ChangePassword = async (_, args, { db, user }) => {
  if (!user) return new AuthenticationError("Unable to change password");

  let currentPassword: string | null = null;

  try {
    const validate = await changePasswordValidator.validateAsync(args, {
      abortEarly: false,
    });
    const { newPassword } = validate;
    ({ currentPassword } = validate);

    const { rows } = await db.query<User>(
      `SELECT password, is_Registered "isRegistered", email FROM users WHERE user_id = $1`,
      [user]
    );

    if (rows.length === 0) return new UnknownError("Unable to change password");

    if (!rows[0].isRegistered) {
      return new RegistrationError("Unable to change password");
    }

    const matchPromise = bcrypt.compare(currentPassword, rows[0].password);
    const hashPromise = bcrypt.hash(newPassword, 10);

    const [match, hash] = await Promise.all([matchPromise, hashPromise]);

    if (!match) return new NotAllowedError("Unable to change password");

    await db.query(`UPDATE users SET password = $1 WHERE user_id = $2`, [
      hash,
      user,
    ]);

    await changePasswordMail(rows[0].email);

    return new Response("Password changed");
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = generateErrorsObject(err.details) as ValidationErrorObject<
        typeof args
      >;

      return new ChangePasswordValidationError(
        errors.currentPasswordError,
        errors.newPasswordError,
        errors.confirmNewPasswordError
      );
    }

    if (err instanceof MailError && currentPassword) {
      const hash = await bcrypt.hash(currentPassword, 10);

      await db.query(`UPDATE users SET password = $1 WHERE user_id = $2`, [
        hash,
        user,
      ]);

      return new ServerError(err.message);
    }

    throw new GraphQLError("Unable to change password. Please try again later");
  }
};

export default changePassword;
