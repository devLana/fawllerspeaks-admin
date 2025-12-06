import type { Pool } from "pg";

import {
  registeredReset,
  unregisteredReset,
  newRegisteredReset,
  otherRegisteredReset,
  otherNewRegisteredReset,
} from "./mocks";

const createPasswordReset = async (
  db: Pool,
  registeredId: number,
  unregisteredId: number,
  newRegisteredId: number
) => {
  try {
    await db.query(
      `INSERT INTO
        password_reset (user_id, token, expire_date, used)
      VALUES
        ($1, $2, $3, $4),
        ($5, $6, $7, $8),
        ($9, $10, $11, $12),
        ($13, $14, $15, $16)`,
      [
        unregisteredId,
        unregisteredReset.hash,
        new Date(Date.now() + 300_000).toISOString(),
        false,
        newRegisteredId,
        newRegisteredReset.hash,
        new Date(Date.now() - 500_000).toISOString(),
        true,
        newRegisteredId,
        otherNewRegisteredReset.hash,
        new Date(Date.now() - 500_000).toISOString(),
        false,
        registeredId,
        registeredReset.hash,
        new Date(Date.now() + 300_000).toISOString(),
        false,
      ]
    );
  } catch (err) {
    console.error("Create Test Password Reset Tokens Error - ", err);
    throw new Error("Unable to create test password reset tokens");
  }
};

export default createPasswordReset;
