import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import { ValidationError } from "joi";

import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { RegisterUserValidationError } from "@typeResolvers/auth/RegisterUserValidationError";
import { RegisteredUser } from "@typeResolvers/auth/RegisteredUser";
import { registerUserValidator as schema } from "@validators/auth/registerUser";
import deleteSession from "@utils/deleteSession";
import generateErrorsObject from "@utils/generateErrorsObject";
import type { RegisterUser, Select } from "types/auth/registerUser";

const registerUser: RegisterUser = async (_, { userInput }, ctx) => {
  try {
    const { db, user, req, res } = ctx;
    const MSG = "Unable to register user";

    if (!user) {
      void deleteSession(db, req, res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const input = await schema.validateAsync(userInput, { abortEarly: false });
    const { firstName, lastName, password } = input;
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

    if (rows.length === 0) {
      void deleteSession(db, req, res);
      return new ErrorResponse("UnknownError", MSG);
    }

    if (rows[0].isRegistered) {
      const msg = "User is already registered";
      return new ErrorResponse("RegistrationError", msg);
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
      const errors = generateErrorsObject(err.details);
      return new RegisterUserValidationError(errors);
    }

    // log any system error

    throw new GraphQLError("Unable to register. Please try again later");
  }
};

export default registerUser;
