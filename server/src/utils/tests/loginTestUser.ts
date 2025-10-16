import { sign } from "@lib/tokenPromise";
import { env } from "@lib/env";

const loginTestUser = async (userUUID: string, expiresIn = "10m") => {
  try {
    const accessToken = await sign({ sub: userUUID }, env.ACCESS_TOKEN_SECRET, {
      expiresIn,
    });

    return accessToken;
  } catch (err) {
    console.error("Login Test User Error - ", err);
    throw new Error("Unable to log in test user");
  }
};

export default loginTestUser;
