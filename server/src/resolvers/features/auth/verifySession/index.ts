import { GraphQLError } from "graphql";

import { SessionData } from "@typeResolvers/auth/SessionData";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import signTokens from "@utils/auth/signTokens";
import { clearAuthCookie, setAuthCookie } from "@utils/auth/cookies";
import type { DBResponse, VerifySession } from "types/auth/verifySession";

const verifySession: VerifySession = async (_, __, { db, req, res }) => {
  try {
    const { auth } = req.cookies;
    const ip = req.ip || null;
    const userAgent = req.headers["user-agent"] || null;
    const MSG = "Unable to verify session";

    if (!auth) {
      clearAuthCookie(res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const { rows } = await db.query<DBResponse>(
      `SELECT
        u.user_id,
        u.email,
        u.first_name ,
        u.last_name,
        u.image,
        u.is_registered,
        u.date_created,
        s.id "sid",
        s.ip_address,
        s.user_agent,
        s.expire_date,
        s.revoked_at
      FROM sessions s
      INNER JOIN users u ON s.user_id = u.id
      WHERE s.refresh_token = $1`,
      [auth]
    );

    if (rows.length === 0) {
      clearAuthCookie(res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const [{ sid, ip_address, user_agent, expire_date, revoked_at, ...user }] =
      rows;

    if (userAgent !== user_agent || ip !== ip_address) {
      // log potential suspicious verify session request along with the request's ip and userAgent
      // maybe alert user via email
    }

    if (revoked_at) {
      clearAuthCookie(res);
      return new ErrorResponse("NotAllowedError", MSG);
    }

    if (Date.parse(expire_date) < Date.now()) {
      clearAuthCookie(res);
      return new ErrorResponse("NotAllowedError", MSG);
    }

    const tokens = await signTokens(user.user_id);
    const { refreshToken, accessToken, refreshTokenHash } = tokens;

    await db.query(
      `UPDATE sessions
      SET
        refresh_token = $1,
        expire_date = CURRENT_TIMESTAMP(3) + INTERVAL '6 months',
        last_refresh = CURRENT_TIMESTAMP(3)
      WHERE id = $2`,
      [refreshTokenHash, sid]
    );

    setAuthCookie(res, refreshToken);

    const userData = {
      id: user.user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      image: user.image,
      isRegistered: user.is_registered,
      dateCreated: user.date_created,
    };

    return new SessionData(userData, accessToken);
  } catch (err) {
    // log any system errors
    throw new GraphQLError("Unable to verify session. Please try again later");
  }
};

export default verifySession;
