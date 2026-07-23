import { GraphQLError } from "graphql";

import { Response } from "@typeResolvers/commonResolvers";
import { clearAuthCookie } from "@utils/auth/cookies";
import type { Logout } from "@appTypes/auth/logout";

const logout: Logout = async (_, __, { db, user, req, res }) => {
  try {
    // const ip = req.ip || null;
    // const userAgent = req.headers["user-agent"] || null;
    const { auth } = req.cookies;

    if (!user || !auth) {
      // log suspicious log out activity along with the request's ip and userAgent
      clearAuthCookie(res);
      return new Response("User logged out");
    }

    const { rows } = await db.query<{ user_id: string }>(
      `WITH revoke_session AS (
        UPDATE sessions
        SET revoked_at = CURRENT_TIMESTAMP(3)
        WHERE refresh_token = $1 AND revoked_at IS NULL
        RETURNING user_id
      )
      SELECT u.user_id
      FROM revoke_session AS rs
      INNER JOIN users u ON rs.user_id = u.id`,
      [auth]
    );

    if (rows.length === 0) {
      // log suspicious log out activity from user along with the request's ip and userAgent
    } else if (rows[0].user_id !== user) {
      // log suspicious log out activity from user along with the request's ip and userAgent
      // maybe also notify user_id of suspicious activity on their auth session
    }

    clearAuthCookie(res);
    return new Response("User logged out");
  } catch {
    // log any system errors

    throw new GraphQLError("Unable to logout. Please try again later");
  }
};

export default logout;
