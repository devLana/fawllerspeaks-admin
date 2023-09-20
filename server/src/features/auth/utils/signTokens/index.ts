import { createCipheriv } from "node:crypto";
import { Buffer } from "node:buffer";

import { GraphQLError } from "graphql";

import { jwtExpires } from "../jwtExpires";
import { sign } from "@lib/tokenPromise";
import type { Cookies } from "@types";

type ResultTuple = [string, string, Required<Cookies>];

const signTokens = async (userId: string): Promise<ResultTuple> => {
  if (
    !process.env.REFRESH_TOKEN_SECRET ||
    !process.env.ACCESS_TOKEN_SECRET ||
    !process.env.CIPHER_ALGORITHM ||
    !process.env.CIPHER_KEY ||
    !process.env.CIPHER_IV
  ) {
    throw new GraphQLError("Server Error");
  }

  const refresh = sign({ sub: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: jwtExpires.refreshToken,
  });

  const access = sign({ sub: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: jwtExpires.accessToken,
  });

  const [refreshToken, accessToken] = await Promise.all([refresh, access]);

  const algorithm = process.env.CIPHER_ALGORITHM;
  const key = Buffer.from(process.env.CIPHER_KEY, "hex");
  const iv = Buffer.from(process.env.CIPHER_IV, "hex");

  const [header, payload, signature] = refreshToken.split(".").map(jwtPart => {
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(jwtPart, "utf8", "hex");

    encrypted += cipher.final("hex");
    return encrypted;
  });

  const [auth, token, sig] = [payload, signature, header];

  return [refreshToken, accessToken, { auth, token, sig }];
};

export default signTokens;
