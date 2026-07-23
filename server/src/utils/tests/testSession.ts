import type { Pool } from "pg";

import { hmacRefreshToken } from "@utils/auth/signTokens";
import { generateBytes } from "@utils/generateBytes";

interface Options {
  isExpired?: boolean;
  isRevoked?: boolean;
}

export const testSession = async (
  db: Pool,
  userId: number,
  options?: Options,
) => {
  try {
    const refresh = await generateBytes(48, "hex");
    const refreshHash = hmacRefreshToken(refresh);

    const expired = options?.isExpired
      ? "CURRENT_TIMESTAMP(3)"
      : "CURRENT_TIMESTAMP(3) + INTERVAL '6 months'";

    const revoked = options?.isRevoked ? "CURRENT_TIMESTAMP(3)" : "NULL";

    await db.query(
      `INSERT INTO sessions (refresh_token, user_id, expire_date, revoked_at)
      VALUES ($1, $2, ${expired}, ${revoked})`,
      [refreshHash, userId],
    );

    return `auth=${refresh}`;
  } catch (err) {
    console.error("Create Test User Session Error - ", err);
    throw new Error("Unable to create test user session", { cause: err });
  }
};
