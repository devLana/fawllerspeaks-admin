import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import { SessionIdValidationError, UserData } from "../types";
import {
  clearCookies,
  sessionMail,
  signAccessToken,
} from "@features/auth/utils";

import { verify } from "@lib/tokenPromise";
import {
  DATE_CREATED_MULTIPLIER,
  MailError,
  NotAllowedError,
  UnknownError,
  UserSessionError,
} from "@utils";

import { type QueryResolvers } from "@resolverTypes";
import type { ResolverFunc, Cookies } from "@types";

type VerifySession = ResolverFunc<QueryResolvers["verifySession"]>;

interface DBResponse {
  sessionId: string;
  refreshToken: string;
  email: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  isRegistered: boolean;
  dateCreated: number;
}

type TDBResponse = Omit<DBResponse, "sessionId">;

const verifySession: VerifySession = async (_, args, { db, req, res }) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new GraphQLError("Server Error. Please try again later");
  }

  const schema = Joi.string().required().trim().messages({
    "string.empty": "Invalid session id",
  });

  let jwt: string | null = null;
  let validatedSession: string | null = null;

  try {
    validatedSession = await schema.validateAsync(args.sessionId);

    const { auth, sig, token } = req.cookies as Cookies;

    if (!auth || !sig || !token) {
      clearCookies(res);
      return new NotAllowedError("Unable to verify session");
    }

    jwt = `${sig}.${auth}.${token}`;

    const { sub } = (await verify(jwt, process.env.REFRESH_TOKEN_SECRET)) as {
      sub: string;
    };

    const { rows } = await db.query<TDBResponse>(
      `SELECT
        "user" "userId",
        refresh_token "refreshToken",
        email,
        first_name "firstName",
        last_name "lastName",
        image,
        is_Registered "isRegistered",
        date_created "dateCreated"
      FROM sessions LEFT JOIN users ON "user" = user_id
      WHERE session_id = $1`,
      [validatedSession]
    );

    // Unable to find any valid session with the provided session id
    if (rows.length === 0) return new UnknownError("Unable to verify session");

    // Provided session was not assigned to the current logged in user
    if (rows[0].userId !== sub) {
      return new UserSessionError("Unable to verify session");
    }

    /*
      The refreshToken for the provided session isn't the same as the refreshToken assigned to the current logged in user(User may have been hacked):
      - clear that session from db
      - clear cookies
      - send mail
    */
    if (rows[0].refreshToken !== jwt) {
      await db.query(`DELETE FROM sessions WHERE session_id = $1`, [
        validatedSession,
      ]);

      clearCookies(res);
      await sessionMail(rows[0].email);
      return new NotAllowedError("Unable to verify session");
    }

    const accessToken = await signAccessToken(sub);

    const user = {
      email: rows[0].email,
      id: sub,
      firstName: rows[0].firstName,
      lastName: rows[0].lastName,
      image: rows[0].image,
      isRegistered: rows[0].isRegistered,
      dateCreated: rows[0].dateCreated * DATE_CREATED_MULTIPLIER,
      accessToken,
      sessionId: validatedSession,
    };

    return new UserData(user);
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      try {
        const { rows } = await db.query<DBResponse>(
          `SELECT
            session_id "sessionId",
            "user" "userId",
            refresh_token "refreshToken",
            email,
            first_name "firstName",
            last_name "lastName",
            image,
            is_Registered "isRegistered",
            date_created "dateCreated"
          FROM sessions LEFT JOIN users ON "user" = user_id
          WHERE session_id = $1`,
          [validatedSession]
        );

        // Unable to find any valid session with the provided session id
        if (rows.length === 0) {
          return new UnknownError("Unable to verify session");
        }

        /*
          The refreshToken for the provided session isn't the same as the refreshToken assigned to the current logged in user(User may have been hacked):
          - clear that session from db
          - clear cookies
          - send mail
        */
        if (rows[0].refreshToken !== jwt) {
          await db.query(`DELETE FROM sessions WHERE session_id = $1`, [
            validatedSession,
          ]);

          clearCookies(res);
          await sessionMail(rows[0].email);
          return new NotAllowedError("Unable to verify session");
        }

        const accessToken = await signAccessToken(rows[0].userId);

        const user = {
          email: rows[0].email,
          id: rows[0].userId,
          firstName: rows[0].firstName,
          lastName: rows[0].lastName,
          image: rows[0].image,
          isRegistered: rows[0].isRegistered,
          dateCreated: rows[0].dateCreated * DATE_CREATED_MULTIPLIER,
          accessToken,
          sessionId: rows[0].sessionId,
        };

        return new UserData(user);
      } catch (error) {
        if (error instanceof MailError) {
          return new NotAllowedError("Unable to verify session");
        }

        throw new GraphQLError(
          "Unable to verify session. Please try again later"
        );
      }
    }

    if (err instanceof JsonWebTokenError) {
      clearCookies(res);
      return new NotAllowedError("Unable to verify session");
    }

    if (err instanceof ValidationError) {
      return new SessionIdValidationError(err.message);
    }

    if (err instanceof MailError) {
      return new NotAllowedError("Unable to verify session");
    }

    throw new GraphQLError("Unable to verify session. Please try again later");
  }
};

export default verifySession;
