import type { Response } from "express";
import type { Pool } from "pg";

import { clearAuthCookie } from "@utils/auth/cookies";
import type { GQLRequest } from "@types";

const deleteSession = (db: Pool, req: GQLRequest, res: Response) => {
  if (req.cookies.auth) {
    clearAuthCookie(res);

    void db.query(
      `UPDATE sessions
      SET revoked_at = CURRENT_TIMESTAMP(3)
      WHERE refresh_token = $1`,
      [req.cookies.auth]
    );
  }
};

export default deleteSession;
