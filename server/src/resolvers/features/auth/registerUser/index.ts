import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import { ValidationError } from "joi";

import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { RegisterUserValidationError } from "@typeResolvers/auth/RegisterUserValidationError";
import { RegisteredUser } from "@typeResolvers/auth/RegisteredUser";
import { registerUserValidator as schema } from "@validators/auth/registerUser";
import generateErrorsObject from "@utils/generateErrorsObject";
import { clearAuthCookie } from "@utils/auth/cookies";
import type { RegisterUser as Fn, Select } from "types/auth/registerUser";

const registerUser: Fn = async (_, { userInput }, { db, user, res }) => {
  try {
    const MSG = "Unable to register user";

    if (!user) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const input = await schema.validateAsync(userInput, { abortEarly: false });

    const { rows } = await db.query<Select>(
      `SELECT
        email,
        image,
        is_registered,
        date_created
      FROM users
      WHERE user_id = $1`,
      [user]
    );

    if (rows.length === 0) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    if (rows[0].is_registered) {
      const msg = "User is already registered";
      return new ErrorResponse("RegistrationError", msg);
    }

    const hash = await bcrypt.hash(input.password, 10);

    await db.query(
      `UPDATE users
      SET
        first_name = $1,
        last_name = $2,
        password = $3,
        is_registered = TRUE
      WHERE user_id = $4`,
      [input.firstName, input.lastName, hash, user]
    );

    return new RegisteredUser({
      id: user,
      email: rows[0].email,
      firstName: input.firstName,
      lastName: input.lastName,
      image: rows[0].image,
      isRegistered: true,
      dateCreated: rows[0].date_created,
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
