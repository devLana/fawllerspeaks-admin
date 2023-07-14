import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";
import bcrypt from "bcrypt";

import {
  DATE_CREATED_MULTIPLIER,
  NotAllowedError,
  generateErrorsObject,
} from "@utils";
import { signTokens, generateBytes, setCookies } from "@features/auth/utils";
import { UserData } from "../types";
import { LoginValidationError } from "./LoginValidationError";

import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc, Cookies, ValidationErrorObject } from "@types";

type Login = ResolverFunc<MutationResolvers["login"]>;

interface DBUser {
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  userEmail: string;
  userPassword: string;
  userId: string;
  isRegistered: boolean;
  dateCreated: number;
}

const login: Login = async (_, args, { db, req, res }) => {
  const schema = Joi.object<typeof args>({
    email: Joi.string().email().required().trim().messages({
      "string.empty": "Enter an e-mail address",
      "string.email": "Invalid e-mail address",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Enter password",
    }),
  });

  try {
    if (req.cookies) {
      const { auth, sig, token } = req.cookies as Cookies;

      if (auth && sig && token) {
        await db.query(`DELETE FROM sessions WHERE refresh_token = $1`, [
          `${sig}.${auth}.${token}`,
        ]);
      }
    }

    const { email, password } = await schema.validateAsync(args, {
      abortEarly: false,
    });

    const sessionPromise = generateBytes(28, "base64url");
    const findUser = db.query<DBUser>(
      `SELECT
        first_name "firstName",
        last_name "lastName",
        image,
        email "userEmail",
        password "userPassword",
        user_id "userId",
        is_registered "isRegistered",
        date_created "dateCreated"
      FROM users
      WHERE lower(email) = $1`,
      [email.toLowerCase()]
    );

    const [{ rows }, sessionId] = await Promise.all([findUser, sessionPromise]);

    if (rows.length === 0) {
      return new NotAllowedError("Invalid email or password");
    }

    const [
      {
        firstName,
        lastName,
        image,
        userEmail,
        userPassword,
        userId,
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
      `INSERT INTO sessions (refresh_token, "user", session_id) VALUES ($1, $2, $3)`,
      [refreshToken, userId, sessionId]
    );

    setCookies(res, cookies);

    const user = {
      email: userEmail,
      id: userId,
      firstName,
      lastName,
      image,
      isRegistered,
      dateCreated: dateCreated * DATE_CREATED_MULTIPLIER,
      accessToken,
      sessionId,
    };

    return new UserData(user);
  } catch (err) {
    if (err instanceof ValidationError) {
      const { emailError, passwordError } = generateErrorsObject(
        err.details
      ) as ValidationErrorObject<typeof args>;

      return new LoginValidationError(emailError, passwordError);
    }

    throw new GraphQLError("Unable to login. Please try again later");
  }
};

export default login;
