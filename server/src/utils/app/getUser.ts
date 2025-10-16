import { GraphQLError } from "graphql";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import { verify } from "@lib/tokenPromise";
import { env } from "../../lib/env";

const getUser = async (authHeader = "") => {
  if (!authHeader.startsWith("Bearer ")) return null;

  try {
    const accessToken = authHeader.slice(7);

    const { sub } = (await verify(accessToken, env.ACCESS_TOKEN_SECRET)) as {
      sub: string;
    };

    return sub;
  } catch (err) {
    if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
      return null;
    }

    throw new GraphQLError("Server Error");
  }
};

export default getUser;
