import crypto from "node:crypto";
import util from "node:util";

import type { Pool } from "pg";

import { sign } from "@lib/tokenPromise";

const testSession = async (db: Pool, userId: string, expiresIn = "15m") => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("No secret in environment");
  }

  try {
    const refresh = sign({ sub: userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn,
    });

    const randomBytes = util.promisify(crypto.randomBytes);
    const buf = randomBytes(28);

    const [refreshToken, sessionBuffer] = await Promise.all([refresh, buf]);

    const sessionId = sessionBuffer.toString("base64url");

    await db.query(
      `INSERT INTO sessions (refresh_token, "user", session_id) VALUES ($1, $2, $3)`,
      [refreshToken, userId, sessionId]
    );

    const [header, payload, signature] = refreshToken.split(".");
    const [auth, token, sig] = [payload, signature, header];

    return { cookies: `auth=${auth};token=${token};sig=${sig}`, sessionId };
  } catch (err) {
    console.log("Create Test User Session Error - ", err);
    throw new Error("Unable to create test user session");
  }
};

export default testSession;
