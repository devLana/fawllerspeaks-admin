import { createServer } from "node:http";
import process from "node:process";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";

import { typeDefs, resolvers } from "@schema";
import {
  authenticateUser,
  errorMiddleware,
  multipartParser,
} from "@middleware";
import { uploadImage, catchAll, healthCheck, graphqlApi } from "@controllers";
import { nodeEnv, getServerUrl, corsOptions, startServerHandler } from "@utils";

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

  app.use(cors(corsOptions));
  app.use(
    helmet({
      crossOriginEmbedderPolicy: nodeEnv === "production",
      contentSecurityPolicy: nodeEnv === "production",
    })
  );

  app.use(/^\/$/, [cookieParser(), express.json()], graphqlApi(server));
  app.post("/upload-image", [authenticateUser, multipartParser], uploadImage);
  app.get("/health-check", healthCheck);
  app.use("*", catchAll);
  app.use(errorMiddleware);

  httpServer.on("request", app);
  httpServer.listen({ port });

  const url = getServerUrl(httpServer, "/");
  return { url, server };
};

if (nodeEnv !== "test") {
  const port = process.env.PORT ? +process.env.PORT : 7692;

  startServer(port)
    .then(startServerHandler)
    .catch(err => console.error("Error: Unable to start server", err));
}
