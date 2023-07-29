import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";
import bcrypt from "bcrypt";

import { changePasswordMail } from "./utils";
import { ChangePasswordValidationError } from "./types";
import {
  AuthenticationError,
  MailError,
  NotAllowedError,
  RegistrationError,
  Response,
  ServerError,
  UnknownError,
  generateErrorsObject,
} from "@utils";

import { type MutationResolvers } from "@resolverTypes";
import type { ValidationErrorObject, ResolverFunc } from "@types";

type ChangePassword = ResolverFunc<MutationResolvers["changePassword"]>;

interface User {
  email: string;
  isRegistered: boolean;
  password: string;
}

const changePassword: ChangePassword = async (_, args, { db, user }) => {
  const schema = Joi.object<typeof args>({
    currentPassword: Joi.string().required().messages({
      "string.empty": "Enter current password",
    }),
    newPassword: Joi.string()
      .required()
      .pattern(/\d+/)
      .pattern(/[a-z]+/)
      .pattern(/[A-Z]+/)
      .pattern(/[^a-z\d]+/i)
      .min(8)
      .messages({
        "string.empty": "Enter new password",
        "string.pattern.base":
          "New password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol",
        "string.min": "New Password must be at least 8 characters long",
      }),
    confirmNewPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({ "any.only": "Passwords do not match" }),
  });

  let currentPassword: string | null = null;

  try {
    if (!user) return new AuthenticationError("Unable to change password");

    const validate = await schema.validateAsync(args, { abortEarly: false });
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

    if (!match) {
      return new NotAllowedError(
        "Unable to change password. 'current password' does not match"
      );
    }

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
