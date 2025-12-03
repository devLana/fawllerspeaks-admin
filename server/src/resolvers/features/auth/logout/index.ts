import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { SessionIdValidationError } from "@typeResolvers/auth/SessionIdValidationError";
import { ErrorResponse, Response } from "@typeResolvers/commonResolvers";
import { sessionIdValidator } from "@validators/auth/sessionId";
import { clearCookies } from "@utils/auth/cookies";
import deleteSession from "@utils/deleteSession";

import type { Logout } from "types/auth/logout";

const logout: Logout = async (_, { sessionId }, { db, user, req, res }) => {
  try {
    const MSG = "Unable to logout";

    if (!user) {
      void deleteSession(db, req, res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const validatedSession = await sessionIdValidator.validateAsync(sessionId);

    const { auth, sig, token } = req.cookies;

    if (!auth && !sig && !token) {
      const { rows } = await db.query<{ user: string }>(
        `SELECT u.user_id "user"
        FROM sessions s INNER JOIN users u
        ON s.user_id = u.id
        WHERE s.session_id = $1`,
        [validatedSession]
      );

      if (rows.length === 0) return new ErrorResponse("UnknownError", MSG);

      if (rows[0].user !== user) {
        return new ErrorResponse("NotAllowedError", MSG);
      }

      await db.query(`DELETE FROM sessions WHERE session_id = $1`, [
        validatedSession,
      ]);

      return new Response("User logged out", "WARN");
    }

    if (!auth || !sig || !token) {
      return new ErrorResponse("NotAllowedError", MSG);
    }

    const jwToken = `${sig}.${auth}.${token}`;

    const { rows: session } = await db.query<{ user: string }>(
      `SELECT u.id "user"
      FROM sessions s INNER JOIN users u
      ON s.user_id = u.id
      WHERE u.user_id = $1 AND s.session_id = $2 AND s.refresh_token = $3`,
      [user, validatedSession, jwToken]
    );

    if (session.length === 0) return new ErrorResponse("UnknownError", MSG);

    await db.query(
      `DELETE FROM sessions WHERE user_id = $1 AND session_id = $2 AND refresh_token = $3`,
      [session[0].user, validatedSession, jwToken]
    );

    clearCookies(res);

    return new Response("User logged out");
  } catch (err) {
    if (err instanceof ValidationError) {
      return new SessionIdValidationError(err.message);
    }

    throw new GraphQLError("Unable to logout. Please try again later");
  }
};

export default logout;
