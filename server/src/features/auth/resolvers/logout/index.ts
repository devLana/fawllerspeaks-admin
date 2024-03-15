import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { clearCookies } from "@features/auth/utils/cookies";
import { sessionIdValidator } from "@features/auth/utils/sessionId.validator";
import { SessionIdValidationError } from "../types/SessionIdValidationError";
import {
  AuthenticationError,
  NotAllowedError,
  Response,
  UnknownError,
} from "@utils/ObjectTypes";
import deleteSession from "@utils/deleteSession";

import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type Logout = ResolverFunc<MutationResolvers["logout"]>;

const logout: Logout = async (_, { sessionId }, { db, user, req, res }) => {
  try {
    if (!user) {
      await deleteSession(db, req, res);
      return new AuthenticationError("Unable to logout");
    }

    const validatedSession = await sessionIdValidator.validateAsync(sessionId);

    const { auth, sig, token } = req.cookies;

    if (!auth && !sig && !token) {
      const { rows } = await db.query<{ user: string }>(
        `SELECT "user" FROM sessions WHERE session_id = $1`,
        [validatedSession]
      );

      if (rows.length === 0) return new UnknownError("Unable to logout");

      if (rows[0].user !== user) {
        return new NotAllowedError("Unable to logout");
      }

      await db.query(`DELETE FROM sessions WHERE session_id = $1`, [
        validatedSession,
      ]);

      return new Response("User logged out", "WARN");
    }

    if (!auth || !sig || !token) return new NotAllowedError("Unable to logout");

    const jwToken = `${sig}.${auth}.${token}`;

    const { rows: session } = await db.query(
      `SELECT id FROM sessions
      WHERE "user" = $1 AND session_id = $2 AND refresh_token = $3`,
      [user, validatedSession, jwToken]
    );

    if (session.length === 0) return new UnknownError("Unable to logout");

    await db.query(
      `DELETE FROM sessions WHERE "user" = $1 AND session_id = $2 AND refresh_token = $3`,
      [user, validatedSession, jwToken]
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
