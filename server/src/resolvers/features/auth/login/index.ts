import { GraphQLError } from "graphql";
import { ValidationError } from "joi";
import bcrypt from "bcrypt";

import { LoginValidationError } from "@typeResolvers/auth/LoginValidationError";
import { LoggedInUser } from "@typeResolvers/auth/LoggedInUser";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { loginValidator as schema } from "@validators/auth/login";
import generateErrorsObject from "@utils/generateErrorsObject";
// import deleteSession from "@utils/deleteSession";
import generateBytes from "@utils/generateBytes";
import { setCookies } from "@utils/auth/cookies";
import signTokens from "@utils/auth/signTokens";
import type { Login, DBUser } from "types/auth/login";

const login: Login = async (_, args, { db, res }) => {
  try {
    // void deleteSession(db, req, res);

    const input = await schema.validateAsync(args, { abortEarly: false });
    const { email, password } = input;

    const MSG = "Invalid email or password";
    const session = generateBytes(28, "base64url");

    const findUser = db.query<DBUser>(
      `SELECT
        id,
        user_id "userId",
        first_name "firstName",
        last_name "lastName",
        image,
        email "userEmail",
        password "userPassword",
        is_registered "isRegistered",
        date_created "dateCreated"
      FROM users
      WHERE lower(email) = $1`,
      [email.toLowerCase()]
    );

    const [{ rows }, newSessionId] = await Promise.all([findUser, session]);

    if (rows.length === 0) return new ErrorResponse("NotAllowedError", MSG);

    const [
      {
        id,
        userId,
        firstName,
        lastName,
        image,
        userEmail,
        userPassword,
        isRegistered,
        dateCreated,
      },
    ] = rows;

    const matchPasswords = bcrypt.compare(password, userPassword);
    const tokens = signTokens(userId);

    const [match, [refreshToken, accessToken, cookies]] = await Promise.all([
      matchPasswords,
      tokens,
    ]);

    if (!match) return new ErrorResponse("NotAllowedError", MSG);

    await db.query(
      `INSERT INTO sessions (refresh_token, user_id, session_id) VALUES ($1, $2, $3)`,
      [refreshToken, id, newSessionId]
    );

    setCookies(res, cookies);

    const user = {
      email: userEmail,
      id: userId,
      firstName,
      lastName,
      image,
      isRegistered,
      dateCreated,
    };

    return new LoggedInUser(user, accessToken, newSessionId);
  } catch (err) {
    if (err instanceof ValidationError) {
      const { emailError, passwordError } = generateErrorsObject(err.details);
      return new LoginValidationError(emailError, passwordError);
    }

    throw new GraphQLError("Unable to login. Please try again later");
  }
};

export default login;
