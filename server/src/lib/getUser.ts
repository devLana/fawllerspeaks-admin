import { GraphQLError } from "graphql";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import { verify } from "@lib/tokenPromise";
import { env } from "@lib/env";

export const getUser = async (authHeader = "") => {
  if (!authHeader.startsWith("Bearer ")) return null;

  try {
    const accessToken = authHeader.slice(7);
    const { sub } = await verify(accessToken, env.ACCESS_TOKEN_SECRET);
    return sub ?? null;
  } catch (err) {
    if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
      return null;
    }

    // log the err for debugging purposes

    throw new GraphQLError("Server Error");
  }
};
