import type { CorsOptions } from "cors";
import { env } from "../../lib/env";

let origin: CorsOptions["origin"];

switch (env.NAME) {
  case "production":
    origin = [
      "https://admin.fawllerspeaks.com",
      "https://studio.apollographql.com",
    ];
    break;

  case "demo":
    origin = ["https://admin-demo.fawllerspeaks.com"];
    break;

  case "development":
    origin = [
      "http://localhost:4000" /* blog website dev server */,
      "http://localhost:4040" /* admin website dev server */,
      "http://localhost:3000" /* blog or admin website dev server */,
      "https://sandbox.embed.apollographql.com",
    ];
    break;

  case "test":
  default:
    origin = [];
}

export const corsOptions: CorsOptions = {
  origin,
  methods: "GET,POST",
  credentials: true,
};
