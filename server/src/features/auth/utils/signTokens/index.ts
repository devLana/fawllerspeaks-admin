import { jwtExpires } from "../jwtExpires";
import signAccessToken from "../signAccessToken";
import { sign } from "@lib/tokenPromise";
import type { Cookies } from "@types";

type ResultTuple = [string, string, Cookies];

const signTokens = async (userId: string): Promise<ResultTuple> => {
  if (!process.env.REFRESH_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Server Error");
  }

  const refresh = sign({ sub: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: jwtExpires.refreshToken,
  });

  const access = signAccessToken(userId);

  const [refreshToken, accessToken] = await Promise.all([refresh, access]);

  const [header, payload, signature] = refreshToken.split(".");
  const [auth, token, sig] = [payload, signature, header];

  return [refreshToken, accessToken, { auth, token, sig }];
};

export default signTokens;
