import { randomUUID } from "node:crypto";

import { test, expect } from "@jest/globals";

import signAccessToken from ".";
import { verify } from "@lib/tokenPromise";
import { JWT_REGEX } from "../constants";

interface Verify {
  sub: string;
}

test("Auth | Should sign auth access token", async () => {
  const userId = randomUUID();
  const token = await signAccessToken(userId);

  expect(token).toMatch(JWT_REGEX);

  const accessSecret = process.env.ACCESS_TOKEN_SECRET ?? "";
  const accessToken = (await verify(token, accessSecret)) as Verify;

  expect(accessToken).toHaveProperty("iat");
  expect(accessToken).toHaveProperty("exp");
  expect(accessToken).toHaveProperty("sub", userId);
});
