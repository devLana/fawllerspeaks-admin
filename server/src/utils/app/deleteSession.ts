import type { Response } from "express";
import type { Pool } from "pg";

import { clearCookies } from "@features/auth/utils/cookies";
import type { GQLRequest } from "@types";

const deleteSession = async (db: Pool, req: GQLRequest, res: Response) => {
  const { auth, sig, token } = req.cookies;

  if (auth && sig && token) {
    const jwt = `${sig}.${auth}.${token}`;

    await db.query(`DELETE FROM sessions WHERE refresh_token = $1`, [jwt]);
    clearCookies(res);
  }
};

export default deleteSession;
