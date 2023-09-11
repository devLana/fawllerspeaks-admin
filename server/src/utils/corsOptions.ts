import type { CorsOptions } from "cors";

import { nodeEnv } from "./nodeEnv";

export const corsOptions: CorsOptions = {
  origin:
    nodeEnv === "production"
      ? [
          "https://https://app.fawllerspeaks.com",
          "https://studio.apollographql.com",
        ]
      : [
          "http://localhost:4000",
          "http://localhost:4040",
          "https://sandbox.embed.apollographql.com",
        ],
  methods: "GET,POST",
  credentials: true,
};
