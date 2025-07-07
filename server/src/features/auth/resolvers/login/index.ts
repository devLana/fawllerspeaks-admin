import { GraphQLError } from "graphql";
import { ValidationError } from "joi";
import bcrypt from "bcrypt";

import { LoginValidationError } from "./types/LoginValidationError";
import { LoggedInUser } from "./types/LoggedInUser";
import { NotAllowedError } from "@utils/ObjectTypes";

import { loginValidator } from "./utils/login.validator";
import generateErrorsObject from "@utils/generateErrorsObject";
import generateBytes from "@features/auth/utils/generateBytes";
import { setCookies } from "@features/auth/utils/cookies";
import signTokens from "@features/auth/utils/signTokens";

import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import deleteSession from "@utils/deleteSession";

type Login = ResolverFunc<MutationResolvers["login"]>;

interface DBUser {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  userEmail: string;
  userPassword: string;
  isRegistered: boolean;
  dateCreated: string;
}

const login: Login = async (_, args, { db, res, req }) => {
  try {
    await deleteSession(db, req, res);

    const { email, password } = await loginValidator.validateAsync(args, {
      abortEarly: false,
    });

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

    if (rows.length === 0) {
      return new NotAllowedError("Invalid email or password");
    }

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

    if (!match) return new NotAllowedError("Invalid email or password");

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
