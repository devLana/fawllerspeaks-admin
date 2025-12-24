import { GraphQLError } from "graphql";

import { RefreshData } from "@typeResolvers/auth/RefreshData";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import sessionMail from "@services/mail/session";
import { MailError } from "@lib/Errors";
import { setAuthCookie, clearAuthCookie } from "@utils/auth/cookies";
import signTokens from "@utils/auth/signTokens";
import type { DBResponse, Refresh } from "types/auth/refreshToken";

const refreshToken: Refresh = async (_, __, { db, req, res, user }) => {
  const MSG = "Unable to refresh token";

  try {
    const { auth } = req.cookies;
    const ip = req.ip || null;
    const userAgent = req.headers["user-agent"] || null;

    if (!user || !auth) {
      clearAuthCookie(res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const { rows } = await db.query<DBResponse>(
      `SELECT
        s.id "sid",
        s.ip_address,
        s.user_agent,
        s.expire_date,
        s.revoked_at,
        u.email,
        u.user_id
      FROM sessions s
      INNER JOIN users u ON s.user_id = u.id
      WHERE s.refresh_token = $1`,
      [auth]
    );

    if (rows.length === 0) {
      clearAuthCookie(res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const [
      { sid, ip_address, user_agent, expire_date, revoked_at, email, user_id },
    ] = rows;

    if (userAgent !== user_agent || ip !== ip_address) {
      // log potential suspicious refresh token request along with the request's ip and userAgent
      // maybe also alert user via email
    }

    if (user !== user_id) {
      // log suspicious refresh token request along with the request's ip and userAgent
      // maybe also blacklist ip and userAgent

      await db.query(
        `UPDATE SESSIONS SET revoked_at = CURRENT_TIMESTAMP(3) WHERE id = $1 AND revoked_at IS NULL`,
        [sid]
      );

      await sessionMail(email);
      clearAuthCookie(res);
      return new ErrorResponse("NotAllowedError", MSG);
    }

    if (revoked_at) {
      clearAuthCookie(res);
      return new ErrorResponse("NotAllowedError", MSG);
    }

    if (Date.parse(expire_date) < Date.now()) {
      clearAuthCookie(res);
      return new ErrorResponse("NotAllowedError", MSG);
    }

    const tokens = await signTokens(user_id);
    const { refreshToken: token, accessToken, refreshTokenHash } = tokens;

    await db.query(
      `UPDATE sessions
      SET
        refresh_token = $1,
        expire_date = CURRENT_TIMESTAMP(3) + INTERVAL '6 months',
        last_refresh = CURRENT_TIMESTAMP(3)
      WHERE id = $2`,
      [refreshTokenHash, sid]
    );

    setAuthCookie(res, token);

    return new RefreshData(accessToken);
  } catch (err) {
    if (err instanceof MailError) {
      // log session mail error
      clearAuthCookie(res);
      return new ErrorResponse("NotAllowedError", MSG);
    }

    // log any system errors

    throw new GraphQLError("Unable to refresh token. Please try again later");
  }
};

export default refreshToken;
