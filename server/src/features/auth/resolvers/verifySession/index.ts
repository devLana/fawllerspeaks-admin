import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import { VerifiedSession } from "./types";
import { SessionIdValidationError } from "../types";
import {
  clearCookies,
  sessionMail,
  setCookies,
  signTokens,
} from "@features/auth/utils";

import { verify } from "@lib/tokenPromise";
import {
  ForbiddenError,
  MailError,
  NotAllowedError,
  UnknownError,
  UserSessionError,
  dateToISOString,
} from "@utils";

import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc, Cookies } from "@types";

type VerifySession = ResolverFunc<MutationResolvers["verifySession"]>;

interface DBResponse {
  userId: string;
  refreshToken: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  isRegistered: boolean;
  dateCreated: string;
}

const verifySession: VerifySession = async (_, args, { db, req, res }) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new GraphQLError("Server Error. Please try again later");
  }

  const schema = Joi.string().required().trim().messages({
    "string.empty": "Invalid session id",
  });

  const SELECT = `
    SELECT
      "user" "userId",
      refresh_token "refreshToken",
      email,
      first_name "firstName",
      last_name "lastName",
      image,
      is_Registered "isRegistered",
      date_created "dateCreated"
    FROM sessions LEFT JOIN users ON "user" = user_id
    WHERE session_id = $1
  `;

  let jwt: string | null = null;
  let validatedSession: string | null = null;

  try {
    validatedSession = await schema.validateAsync(args.sessionId);

    const { auth, sig, token } = req.cookies as Cookies;

    if (!auth || !sig || !token) {
      return new ForbiddenError("Unable to verify session");
    }

    jwt = `${sig}.${auth}.${token}`;

    const { sub } = (await verify(jwt, process.env.REFRESH_TOKEN_SECRET)) as {
      sub: string;
    };

    const { rows } = await db.query<DBResponse>(SELECT, [validatedSession]);

    // Unable to find any valid session with the provided session id
    if (rows.length === 0) return new UnknownError("Unable to verify session");

    // Provided session was not assigned to the current user
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

    const [refreshToken, accessToken, cookies] = await signTokens(sub);

    setCookies(res, cookies);

    await db.query(
      `UPDATE sessions SET refresh_token = $1 WHERE session_id = $2 AND "user" = $3`,
      [refreshToken, validatedSession, sub]
    );

    const user = {
      email: rows[0].email,
      id: sub,
      firstName: rows[0].firstName,
      lastName: rows[0].lastName,
      image: rows[0].image,
      isRegistered: rows[0].isRegistered,
      dateCreated: dateToISOString(rows[0].dateCreated),
    };

    return new VerifiedSession(user, accessToken);
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      try {
        const { rows } = await db.query<DBResponse>(SELECT, [validatedSession]);

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

        const [refreshToken, accessToken, cookies] = await signTokens(
          rows[0].userId
        );

        setCookies(res, cookies);

        await db.query(
          `UPDATE sessions SET refresh_token = $1 WHERE session_id = $2 AND "user" = $3`,
          [refreshToken, validatedSession, rows[0].userId]
        );

        const user = {
          email: rows[0].email,
          id: rows[0].userId,
          firstName: rows[0].firstName,
          lastName: rows[0].lastName,
          image: rows[0].image,
          isRegistered: rows[0].isRegistered,
          dateCreated: dateToISOString(rows[0].dateCreated),
        };

        return new VerifiedSession(user, accessToken);
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
      return new ForbiddenError("Unable to verify session");
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
