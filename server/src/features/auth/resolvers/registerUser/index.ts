import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import { ValidationError } from "joi";

import { RegisterUserValidationError, RegisteredUser } from "./types";
import { registerUserValidator } from "./utils/registerUser.validator";

import {
  AuthenticationError,
  RegistrationError,
  UnknownError,
  generateErrorsObject,
} from "@utils";

import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc, ValidationErrorObject } from "@types";

type RegisterUser = ResolverFunc<MutationResolvers["registerUser"]>;

interface Select {
  email: string;
  image: string | null;
  isRegistered: boolean;
  dateCreated: string;
}

const registerUser: RegisterUser = async (_, { userInput }, { db, user }) => {
  if (!user) return new AuthenticationError("Unable to register user");

  try {
    const validations = await registerUserValidator.validateAsync(userInput, {
      abortEarly: false,
    });
    const { firstName, lastName, password } = validations;

    const generateHash = bcrypt.hash(password, 10);
    const findUser = db.query<Select>(
      `SELECT
        email,
        image,
        is_registered "isRegistered",
        date_created "dateCreated"
      FROM users
      WHERE user_id = $1`,
      [user]
    );

    const [hash, { rows }] = await Promise.all([generateHash, findUser]);

    if (rows.length === 0) return new UnknownError("Unable to register user");

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

    return new RegisteredUser({
      id: user,
      email: rows[0].email,
      firstName,
      lastName,
      image: rows[0].image,
      isRegistered: true,
      dateCreated: rows[0].dateCreated,
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
