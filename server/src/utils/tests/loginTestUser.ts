import { sign } from "@lib/tokenPromise";

const loginTestUser = async (userUUID: string, expiresIn = "10m") => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("No secret in environment");
  }

  try {
    const accessToken = await sign(
      { sub: userUUID },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn }
    );

    return accessToken;
  } catch (err) {
    console.error("Login Test User Error - ", err);
    throw new Error("Unable to log in test user");
  }
};

export default loginTestUser;
