import { createServer } from "node:http";
import process from "node:process";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import typeDefs from "@schema/typeDefs";
import { resolvers } from "@schema/resolvers";

import { createTempDirectory } from "@middleware/createTempDirectory";
import { authenticateUser } from "@middleware/authenticateUser";
import { errorMiddleware } from "@middleware/errorMiddleware";
import { uploadImageParser } from "@middleware/uploadImageParser";
import { postContentImageParser } from "@middleware/postContentImageParser";
import { parseCookies } from "@middleware/parseCookies";

import { healthCheck } from "@controllers/healthCheck";
import { uploadImage } from "@controllers/uploadImage";
import { uploadPostContentImage } from "@controllers/uploadPostContentImage";
import { graphqlApi } from "@controllers/graphqlApi";
import { catchAll } from "@controllers/catchAll";

import { startServerHandler } from "@utils/startServerHandler";
import { corsOptions } from "@utils/corsOptions";
import getServerUrl from "@utils/getServerUrl";
import { env } from "@lib/env";

import type { APIContext } from "@types";

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
      contentSecurityPolicy: env.NAME === "production" || env.NAME === "demo",
      crossOriginEmbedderPolicy:
        env.NAME === "production" || env.NAME === "demo",
    })
  );

  app.use(/^\/$/, [express.json(), parseCookies], graphqlApi(server));

  app.post(
    "/upload-image",
    [authenticateUser, createTempDirectory, uploadImageParser],
    uploadImage
  );

  app.post(
    "/upload-post-content-image",
    [authenticateUser, createTempDirectory, postContentImageParser],
    uploadPostContentImage
  );

  app.get("/health-check", healthCheck);
  app.use("*", catchAll);
  app.use(errorMiddleware);

  httpServer.on("request", app);
  httpServer.listen({ port });

  const url = getServerUrl(httpServer, "/");
  return { url, server };
};

if (env.NAME !== "test") {
  const port = process.env.PORT ? +process.env.PORT : 7692;

  startServer(port)
    .then(startServerHandler)
    .catch(err => console.error("Error: Unable to start server", err));
}
