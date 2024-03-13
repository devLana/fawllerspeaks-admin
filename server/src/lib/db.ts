import { Pool } from "pg";

import { nodeEnv } from "@utils/nodeEnv";

export const db = new Pool({
  connectionString:
    nodeEnv === "production"
      ? process.env.PG_CONNECTION_STRING
      : nodeEnv === "development"
      ? "postgresql://lana:lana@localhost:5432/dev_fawllerspeaks"
      : "postgresql://lana:lana@localhost:5432/test_fawllerspeaks",
});

db.on("error", (err, client) => {
  console.error("PG Client Error - ", err);
  console.error("PG client Upon Which Error Occurred- ", client);
});
