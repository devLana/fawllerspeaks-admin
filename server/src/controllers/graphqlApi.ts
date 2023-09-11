import { expressMiddleware } from "@apollo/server/express4";
import type { ApolloServer } from "@apollo/server";

import { db } from "@lib/db";
import { getUser } from "@utils";
import type { APIContext } from "@types";

export const graphqlApi = (server: ApolloServer<APIContext>) => {
  return expressMiddleware(server, {
    context: async ({ req, res }) => {
      const user = await getUser(req.headers.authorization);
      return { db, user, req, res };
    },
  });
};
