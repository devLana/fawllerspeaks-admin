import crypto from "node:crypto";
import util from "node:util";

import type { Pool } from "pg";

import { sign } from "@lib/tokenPromise";

const testSession = async (db: Pool, userId: string, expiresIn = "15m") => {
  if (
    !process.env.REFRESH_TOKEN_SECRET ||
    !process.env.CIPHER_ALGORITHM ||
    !process.env.CIPHER_KEY ||
    !process.env.CIPHER_IV
  ) {
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

    const algorithm = process.env.CIPHER_ALGORITHM;
    const key = Buffer.from(process.env.CIPHER_KEY, "hex");
    const iv = Buffer.from(process.env.CIPHER_IV, "hex");

    const [header, payload, signature] = refreshToken.split(".").map(part => {
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(part, "utf8", "hex");

      encrypted += cipher.final("hex");
      return encrypted;
    });

    const [auth, token, sig] = [payload, signature, header];

    return { cookies: `auth=${auth};token=${token};sig=${sig}`, sessionId };
  } catch (err) {
    console.error("Create Test User Session Error - ", err);
    throw new Error("Unable to create test user session");
  }
};

export default testSession;
