import { createServer } from "node:http";
import process from "node:process";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import express, {
  type Response,
  type Request,
  type NextFunction,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";

import { typeDefs, resolvers } from "@schema";
import { db } from "@lib/db";
import { nodeEnv, getServerUrl, getUser, type CustomError } from "@utils";

import type { APIContext } from "@types";

dotenv.config();

export const startServer = async (port: number) => {
  const httpServer = createServer();

  const server = new ApolloServer<APIContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  const app = express();

  app.use(cookieParser());
  app.use(express.json());

  app.use(
    cors({
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
      methods: "POST",
      credentials: true,
    })
  );

  app.use(
    helmet({
      crossOriginEmbedderPolicy: nodeEnv === "production",
      contentSecurityPolicy: nodeEnv === "production",
    })
  );

  app.use(
    /^\/$/,
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const user = await getUser(req.headers.authorization);
        return { db, user, req, res };
      },
    })
  );

  app.get("/health-check", (_req, res) => {
    res.status(200).send("Ok");
  });

  app.use("*", (_, res: Response) => {
    res.setHeader("content-type", "text/plain");
    res.status(403).send("Forbidden Request");
  });

  app.use(
    (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Something went wrong. Try again later";

      res.status(statusCode).json({ message, status: "ERROR" });
    }
  );

  httpServer.on("request", app);
  httpServer.listen({ port });

  const url = getServerUrl(httpServer, "/");
  return { url, server };
};

if (nodeEnv !== "test") {
  const port = process.env.PORT ? +process.env.PORT : 7692;

  startServer(port)
    .then(({ url, server }) => {
      process.on("uncaughtException", (err, origin) => {
        console.log("Uncaught Exception Error - ", err);
        console.log("Uncaught Exception Origin - ", origin);
        process.exit(1);
      });

      process.on("unhandledRejection", (reason, promise) => {
        console.log("Unhandled Rejection Reason - ", reason);
        console.log("Unhandled Rejection Promise - ", promise);
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
    })
    .catch(err => console.log("Error: Unable to start server", err));
}
