import { Pool } from "pg";

import { env } from "@lib/env";

export const db = new Pool({
  connectionString:
    env.NAME === "development"
      ? "postgresql://lana:lana@localhost:5432/dev_fawllerspeaks"
      : env.NAME === "test"
      ? "postgresql://lana:lana@localhost:5432/test_fawllerspeaks"
      : env.PG_CONNECTION_STRING,
});

db.on("error", (err, client) => {
  console.error("PG Client Error - ", err);
  console.error("PG client Instance That Threw The Error - ", client);
});
