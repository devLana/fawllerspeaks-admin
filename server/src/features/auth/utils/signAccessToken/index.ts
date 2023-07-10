import { jwtExpires } from "../jwtExpires";
import { sign } from "@lib/tokenPromise";

const signAccessToken = async (userId: string) => {
  if (!process.env.ACCESS_TOKEN_SECRET) throw new Error("Server Error");

  const token = await sign({ sub: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: jwtExpires.accessToken,
  });

  return token;
};

export default signAccessToken;
