import { Pool } from "pg";

import { nodeEnv } from "@utils/nodeEnv";

export const db = new Pool({
  connectionString:
    nodeEnv === "development"
      ? "postgresql://lana:lana@localhost:5432/dev_fawllerspeaks"
      : nodeEnv === "test"
      ? "postgresql://lana:lana@localhost:5432/test_fawllerspeaks"
      : process.env.PG_CONNECTION_STRING,
});

db.on("error", (err, client) => {
  console.error("PG Client Error - ", err);
  console.error("PG client Instance That Threw The Error - ", client);
});
