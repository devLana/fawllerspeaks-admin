import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import {
  signTokens,
  clearCookies,
  sessionMail,
  setCookies,
} from "@features/auth/utils";

import { verify } from "@lib/tokenPromise";
import { AccessToken } from "./types";
import { SessionIdValidationError } from "../types";

import {
  ForbiddenError,
  MailError,
  NotAllowedError,
  UnknownError,
  UserSessionError,
} from "@utils";

import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc, Cookies } from "@types";

type Refresh = ResolverFunc<MutationResolvers["refreshToken"]>;

interface DBResponse {
  refreshToken: string;
  email: string;
  user: string;
}

const refreshToken: Refresh = async (_, args, { db, req, res }) => {
  if (!process.env.REFRESH_TOKEN_SECRET) throw new GraphQLError("Server Error");

  const schema = Joi.string().required().trim().messages({
    "string.empty": "Invalid session id",
  });

  const SELECT = `
    SELECT refresh_token "refreshToken", "user", email
    FROM sessions LEFT JOIN users ON "user" = user_id
    WHERE session_id = $1
  `;

  let jwt: string | null = null;
  let validatedSession: string | null = null;

  try {
    validatedSession = await schema.validateAsync(args.sessionId);

    const { auth, sig, token } = req.cookies as Cookies;

    if (!auth || !sig || !token) {
      return new ForbiddenError("Unable to refresh token");
    }

    jwt = `${sig}.${auth}.${token}`;

    const { sub } = (await verify(jwt, process.env.REFRESH_TOKEN_SECRET)) as {
      sub: string;
    };

    const { rows } = await db.query<DBResponse>(SELECT, [validatedSession]);

    // Unable to find a valid session with the provided session id
    if (rows.length === 0) return new UnknownError("Unable to refresh token");

    // Provided session was not assigned to the current user
    if (rows[0].user !== sub) {
      return new UserSessionError("Unable to refresh token");
    }

    /*
      The refreshToken for the provided session isn't the same as the refreshToken assigned to the current user(User may have been hacked):
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
      return new NotAllowedError("Unable to refresh token");
    }

    const [newRefreshToken, accessToken, cookies] = await signTokens(sub);

    setCookies(res, cookies);

    await db.query(
      `UPDATE sessions SET refresh_token = $1 WHERE session_id = $2 AND "user" = $3`,
      [newRefreshToken, validatedSession, sub]
    );

    return new AccessToken(accessToken);
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      try {
        const { rows } = await db.query<DBResponse>(SELECT, [validatedSession]);

        // Unable to find a valid session with the provided session id
        if (rows.length === 0) {
          return new UnknownError("Unable to refresh token");
        }

        /*
          The refreshToken for the provided session isn't the same as the refreshToken assigned to the current user(User may have been hacked):
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
          return new NotAllowedError("Unable to refresh token");
        }

        const [newRefreshToken, accessToken, cookies] = await signTokens(
          rows[0].user
        );

        setCookies(res, cookies);

        await db.query(
          `UPDATE sessions SET refresh_token = $1 WHERE session_id = $2 AND "user" = $3`,
          [newRefreshToken, validatedSession, rows[0].user]
        );

        return new AccessToken(accessToken);
      } catch (error) {
        if (error instanceof MailError) {
          return new NotAllowedError("Unable to refresh token");
        }

        throw new GraphQLError(
          "Unable to refresh token. Please try again later"
        );
      }
    }

    if (err instanceof JsonWebTokenError) {
      return new ForbiddenError("Unable to refresh token");
    }

    if (err instanceof ValidationError) {
      return new SessionIdValidationError(err.message);
    }

    if (err instanceof MailError) {
      return new NotAllowedError("Unable to refresh token");
    }

    throw new GraphQLError("Unable to refresh token. Please try again later");
  }
};

export default refreshToken;
