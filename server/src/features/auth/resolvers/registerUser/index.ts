import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import Joi, { ValidationError } from "joi";

import { UserData } from "../types";
import { RegisterUserValidationError } from "./RegisterUserValidationError";
import { clearCookies } from "@features/auth/utils";

import {
  AuthenticationError,
  DATE_CREATED_MULTIPLIER,
  NotAllowedError,
  RegistrationError,
  UnknownError,
  generateErrorsObject,
} from "@utils";

import type { MutationResolvers } from "@resolverTypes";
import type { Cookies, ResolverFunc, ValidationErrorObject } from "@types";

type RegisterUser = ResolverFunc<MutationResolvers["registerUser"]>;

interface Select {
  email: string;
  image: string | null;
  isRegistered: boolean;
  dateCreated: number;
  sessionId: string;
}

const registerUser: RegisterUser = async (_, { userInput }, ctx) => {
  const { db, user, res, req } = ctx;

  const schema = Joi.object<typeof userInput>({
    firstName: Joi.string()
      .required()
      .trim()
      .pattern(/[\d]/, { invert: true })
      .messages({
        "string.empty": "Enter first name",
        "string.pattern.invert.base": "First name cannot contain numbers",
      }),
    lastName: Joi.string()
      .required()
      .trim()
      .pattern(/[\d]/, { invert: true })
      .messages({
        "string.empty": "Enter last name",
        "string.pattern.invert.base": "Last name cannot contain numbers",
      }),
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
    if (!user) return new AuthenticationError("Unable to register user");

    const result = await schema.validateAsync(userInput, { abortEarly: false });
    const { firstName, lastName, password } = result;

    const { auth, sig, token } = req.cookies as Cookies;

    if (!auth || !sig || !token) {
      return new NotAllowedError("Unable to register user");
    }

    const jwToken = `${sig}.${auth}.${token}`;

    const generateHash = bcrypt.hash(password, 10);
    const findUser = db.query<Select>(
      `SELECT
        email,
        image,
        is_registered "isRegistered",
        date_created "dateCreated",
        session_id "sessionId"
      FROM users LEFT JOIN sessions ON user_id = "user"
      WHERE user_id = $1 AND refresh_token = $2`,
      [user, jwToken]
    );

    const [hash, { rows }] = await Promise.all([generateHash, findUser]);

    if (rows.length === 0 || !rows[0].sessionId) {
      clearCookies(res);
      return new UnknownError("Unable to register user");
    }

    if (rows[0].isRegistered) {
      return new RegistrationError("User is already registered");
    }

    await db.query(
      `UPDATE users
      SET
        first_name = $1,
        last_name = $2,
        password = $3,
        is_registered = $4
      WHERE user_id = $5`,
      [firstName, lastName, hash, true, user]
    );

    const accessToken = (req.headers.authorization ?? "").slice(7);

    return new UserData({
      id: user,
      email: rows[0].email,
      firstName,
      lastName,
      image: rows[0].image,
      isRegistered: true,
      dateCreated: rows[0].dateCreated * DATE_CREATED_MULTIPLIER,
      accessToken,
      sessionId: rows[0].sessionId,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = generateErrorsObject(err.details) as ValidationErrorObject<
        typeof userInput
      >;
      return new RegisterUserValidationError(errors);
    }

    throw new GraphQLError("Unable to register. Please try again later");
  }
};

export default registerUser;
