import { createCipheriv } from "node:crypto";
import { Buffer } from "node:buffer";

import { sign } from "@lib/tokenPromise";
import { env } from "@lib/env";
import type { Cookies } from "@types";

type ResultTuple = [string, string, Required<Cookies>];

const signTokens = async (userId: string): Promise<ResultTuple> => {
  const refresh = sign({ sub: userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "2.5h",
  });

  const access = sign({ sub: userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h",
  });

  const [refreshToken, accessToken] = await Promise.all([refresh, access]);

  const algorithm = env.CIPHER_ALGORITHM;
  const key = new Uint8Array(Buffer.from(env.CIPHER_KEY, "hex"));
  const iv = new Uint8Array(Buffer.from(env.CIPHER_IV, "hex"));

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
