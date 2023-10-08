import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { clearCookies } from "@features/auth/utils";
import { SessionIdValidationError } from "../types";
import {
  AuthenticationError,
  NotAllowedError,
  Response,
  UnknownError,
} from "@utils";

import { Status, type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";

type Logout = ResolverFunc<MutationResolvers["logout"]>;

const logout: Logout = async (_, { sessionId }, { db, user, req, res }) => {
  const schema = Joi.string().required().trim().messages({
    "string.empty": "Invalid session id",
  });

  try {
    if (!user) return new AuthenticationError("Unable to logout");

    const validatedSession = await schema.validateAsync(sessionId);

    const { auth, sig, token } = req.cookies;

    if (!auth && !sig && !token) {
      const { rows } = await db.query<{ user: string }>(
        `SELECT  "user" FROM sessions WHERE session_id = $1`,
        [validatedSession]
      );

      if (rows.length === 0) return new UnknownError("Unable to logout");

      if (rows[0].user !== user) {
        return new NotAllowedError("Unable to logout");
      }

      await db.query(`DELETE FROM sessions WHERE session_id = $1`, [
        validatedSession,
      ]);

      return new Response("User logged out", Status.Warn);
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
