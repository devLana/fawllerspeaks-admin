import { sign } from "@lib/tokenPromise";

const loginTestUser = async (userId: string) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("No secret in environment");
  }

  try {
    const accessToken = await sign(
      { sub: userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    return accessToken;
  } catch (err) {
    console.log("Login Test User Error - ", err);
    throw new Error("Unable to log in test user");
  }
};

export default loginTestUser;
