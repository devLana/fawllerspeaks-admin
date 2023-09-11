import process from "node:process";

import type { ApolloServer } from "@apollo/server";

import { db } from "@lib/db";
import type { APIContext } from "@types";

interface Prop {
  url: string;
  server: ApolloServer<APIContext>;
}
export const startServerHandler = ({ url, server }: Prop) => {
  process.on("uncaughtException", (err, origin) => {
    console.error("Uncaught Exception Error - ", err);
    console.error("Uncaught Exception Origin - ", origin);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection Reason - ", reason);
    console.error("Unhandled Rejection Promise - ", promise);
    process.exit(1);
  });

  process.on("exit", () => {
    server
      .stop()
      .then(() => console.log("Apollo GraphQL Server Successfully Stopped"))
      .catch(() => console.error("Unable To Stop Apollo GraphQL Server"));

    db.end(() => {
      console.log("PG Database Pool Drained");
    });
  });

  console.log(`🚀 Server ready${url ? ` at ${url}` : ""}`);
};
