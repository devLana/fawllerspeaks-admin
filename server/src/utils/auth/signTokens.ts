import { createHmac } from "node:crypto";

import { sign } from "@lib/tokenPromise";
import { env } from "@lib/env";
import generateBytes from "@utils/generateBytes";

interface ResultTuple {
  refreshTokenHash: string;
  refreshToken: string;
  accessToken: string;
}

export const hmacRefreshToken = (refreshToken: string) => {
  const hmac = createHmac("sha256", env.REFRESH_TOKEN_SECRET);
  return hmac.update(refreshToken, "hex").digest("hex");
};

const signTokens = async (userId: string): Promise<ResultTuple> => {
  const token = generateBytes(48, "hex");

  const access = sign({ sub: userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h",
  });

  const [refreshToken, accessToken] = await Promise.all([token, access]);
  const refreshTokenHash = hmacRefreshToken(refreshToken);

  return { refreshTokenHash, refreshToken, accessToken };
};

export default signTokens;
