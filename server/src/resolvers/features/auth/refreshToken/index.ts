import { Buffer } from "node:buffer";

import { GraphQLError } from "graphql";
import { ValidationError } from "joi";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import { AccessToken } from "@typeResolvers/auth/AccessToken";
import { SessionIdValidationError } from "@typeResolvers/auth/SessionIdValidationError";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import sessionMail from "@services/mail/session";
import { sessionIdValidator } from "@validators/auth/sessionId";
import { verify } from "@lib/tokenPromise";
import { MailError } from "@lib/Errors";
import { env } from "@lib/env";
import { setCookies, clearCookies } from "@utils/auth/cookies";
import signTokens from "@utils/auth/signTokens";

import type { DBResponse, Refresh } from "types/auth/refreshToken";

const refreshToken: Refresh = async (_, args, { db, req, res }) => {
  const SELECT = `
    SELECT
      s.refresh_token "refreshToken",
      u.id "userId",
      u.email "userEmail",
      u.user_id "userUUID"
    FROM sessions s INNER JOIN users u
    ON s.user_id = u.id
    WHERE s.session_id = $1
  `;

  let payload = "";
  let validatedSession: string | null = null;
  let jwt: string | null = null;

  try {
    validatedSession = await sessionIdValidator.validateAsync(args.sessionId);

    const { auth, sig, token } = req.cookies;

    if (!auth && !sig && !token) {
      return new ErrorResponse("AuthCookieError", "Unable to refresh token");
    }

    if (!auth || !sig || !token) {
      return new ErrorResponse("ForbiddenError", "Unable to refresh token");
    }

    jwt = `${sig}.${auth}.${token}`;
    payload = auth;

    const { sub } = (await verify(jwt, env.REFRESH_TOKEN_SECRET)) as {
      sub: string;
    };

    const { rows } = await db.query<DBResponse>(SELECT, [validatedSession]);

    // Unable to find a valid session with the provided session id
    if (rows.length === 0)
      return new ErrorResponse("UnknownError", "Unable to refresh token");

    // Provided session was not assigned to the current user
    if (rows[0].userUUID !== sub) {
      return new ErrorResponse("UserSessionError", "Unable to refresh token");
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
      await sessionMail(rows[0].userEmail);
      return new ErrorResponse("NotAllowedError", "Unable to refresh token");
    }

    const [newRefreshToken, accessToken, cookies] = await signTokens(sub);

    setCookies(res, cookies);

    await db.query(
      `UPDATE sessions SET refresh_token = $1 WHERE session_id = $2 AND user_id = $3`,
      [newRefreshToken, validatedSession, rows[0].userId]
    );

    return new AccessToken(accessToken);
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      try {
        const { rows } = await db.query<DBResponse>(SELECT, [validatedSession]);

        // Unable to find a valid session with the provided session id
        if (rows.length === 0) {
          return new ErrorResponse("UnknownError", "Unable to refresh token");
        }

        const decoded = Buffer.from(payload, "base64").toString();
        const decodedPayload = JSON.parse(decoded) as { sub: string };

        // Provided session was not assigned to the current user
        if (rows[0].userUUID !== decodedPayload.sub) {
          return new ErrorResponse(
            "UserSessionError",
            "Unable to refresh token"
          );
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
          await sessionMail(rows[0].userEmail);
          return new ErrorResponse(
            "NotAllowedError",
            "Unable to refresh token"
          );
        }

        const [newRefreshToken, accessToken, cookies] = await signTokens(
          rows[0].userUUID
        );

        setCookies(res, cookies);

        await db.query(
          `UPDATE sessions SET refresh_token = $1 WHERE session_id = $2 AND user_id = $3`,
          [newRefreshToken, validatedSession, rows[0].userId]
        );

        return new AccessToken(accessToken);
      } catch (error) {
        if (error instanceof MailError) {
          return new ErrorResponse(
            "NotAllowedError",
            "Unable to refresh token"
          );
        }

        throw new GraphQLError(
          "Unable to refresh token. Please try again later"
        );
      }
    }

    if (err instanceof JsonWebTokenError) {
      return new ErrorResponse("ForbiddenError", "Unable to refresh token");
    }

    if (err instanceof ValidationError) {
      return new SessionIdValidationError(err.message);
    }

    if (err instanceof MailError) {
      return new ErrorResponse("NotAllowedError", "Unable to refresh token");
    }

    throw new GraphQLError("Unable to refresh token. Please try again later");
  }
};

export default refreshToken;
