import { nodeEnv } from "@utils";

export const jwtExpires = {
  refreshToken: nodeEnv === "production" ? "1h" : "5h",
  accessToken: nodeEnv === "production" ? "30m" : "4h",
};
