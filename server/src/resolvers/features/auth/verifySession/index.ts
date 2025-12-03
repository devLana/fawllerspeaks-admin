import { Buffer } from "node:buffer";

import { GraphQLError } from "graphql";
import { ValidationError } from "joi";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import { VerifiedSession } from "@typeResolvers/auth/VerifiedSession";
import { SessionIdValidationError } from "@typeResolvers/auth/SessionIdValidationError";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { sessionIdValidator } from "@validators/auth/sessionId";
import sessionMail from "@services/mail/session";
import { verify } from "@lib/tokenPromise";
import { env } from "@lib/env";
import { MailError } from "@lib/Errors";
import signTokens from "@utils/auth/signTokens";
import { clearCookies, setCookies } from "@utils/auth/cookies";

import type { DBResponse, VerifySession } from "types/auth/verifySession";

const verifySession: VerifySession = async (_, args, { db, req, res }) => {
  const MSG = "Unable to verify session";
  let validatedSession: string | null = null;
  let payload = "";

  const SELECT = `
    SELECT
      u.id "userId",
      u.user_id "userUUID",
      u.email,
      u.first_name "firstName",
      u.last_name "lastName",
      u.image,
      u.is_Registered "isRegistered",
      u.date_created "dateCreated"
    FROM sessions s INNER JOIN users u
    ON s.user_id = u.id
    WHERE s.session_id = $1
  `;

  try {
    validatedSession = await sessionIdValidator.validateAsync(args.sessionId);

    const { auth, sig, token } = req.cookies;

    if (!auth && !sig && !token) {
      return new ErrorResponse("AuthCookieError", MSG);
    }

    if (!auth || !sig || !token) {
      return new ErrorResponse("ForbiddenError", MSG);
    }

    const jwt = `${sig}.${auth}.${token}`;
    payload = auth;

    const { sub } = (await verify(jwt, env.REFRESH_TOKEN_SECRET)) as {
      sub: string;
    };

    const { rows } = await db.query<DBResponse>(SELECT, [validatedSession]);

    // Unable to find any valid session with the provided session id
    if (rows.length === 0) return new ErrorResponse("UnknownError", MSG);

    /*
      The provided session was not assigned to the current user(User may have been hacked):
      - clear that session from db
      - clear cookies
      - send mail
    */
    if (rows[0].userUUID !== sub) {
      await db.query(`DELETE FROM sessions WHERE session_id = $1`, [
        validatedSession,
      ]);

      clearCookies(res);
      await sessionMail(rows[0].email);
      return new ErrorResponse("NotAllowedError", MSG);
    }

    const [refreshToken, accessToken, cookies] = await signTokens(sub);

    setCookies(res, cookies);

    await db.query(
      `UPDATE sessions SET refresh_token = $1 WHERE session_id = $2 AND user_id = $3`,
      [refreshToken, validatedSession, rows[0].userId]
    );

    return new VerifiedSession(
      {
        email: rows[0].email,
        id: sub,
        firstName: rows[0].firstName,
        lastName: rows[0].lastName,
        image: rows[0].image,
        isRegistered: rows[0].isRegistered,
        dateCreated: rows[0].dateCreated,
      },
      accessToken
    );
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      try {
        const { rows } = await db.query<DBResponse>(SELECT, [validatedSession]);

        // Unable to find any valid session with the provided session id
        if (rows.length === 0) {
          return new ErrorResponse("UnknownError", MSG);
        }

        const decoded = Buffer.from(payload, "base64").toString();
        const decodedPayload = JSON.parse(decoded) as { sub: string };

        /*
          The provided session was not assigned to the current user(User may have been hacked):
          - clear that session from db
          - clear cookies
          - send mail
        */
        if (rows[0].userUUID !== decodedPayload.sub) {
          await db.query(`DELETE FROM sessions WHERE session_id = $1`, [
            validatedSession,
          ]);

          clearCookies(res);
          await sessionMail(rows[0].email);
          return new ErrorResponse("NotAllowedError", MSG);
        }

        const [refreshToken, accessToken, cookies] = await signTokens(
          rows[0].userUUID
        );

        setCookies(res, cookies);

        await db.query(
          `UPDATE sessions SET refresh_token = $1 WHERE session_id = $2 AND user_id = $3`,
          [refreshToken, validatedSession, rows[0].userId]
        );

        return new VerifiedSession(
          {
            email: rows[0].email,
            id: rows[0].userUUID,
            firstName: rows[0].firstName,
            lastName: rows[0].lastName,
            image: rows[0].image,
            isRegistered: rows[0].isRegistered,
            dateCreated: rows[0].dateCreated,
          },
          accessToken
        );
      } catch (error) {
        if (error instanceof MailError) {
          return new ErrorResponse("NotAllowedError", MSG);
        }

        throw new GraphQLError(
          "Unable to verify session. Please try again later"
        );
      }
    }

    if (err instanceof JsonWebTokenError) {
      return new ErrorResponse("ForbiddenError", MSG);
    }

    if (err instanceof ValidationError) {
      return new SessionIdValidationError(err.message);
    }

    if (err instanceof MailError) {
      return new ErrorResponse("NotAllowedError", MSG);
    }

    throw new GraphQLError("Unable to verify session. Please try again later");
  }
};

export default verifySession;
