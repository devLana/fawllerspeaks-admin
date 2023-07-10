import { randomUUID } from "node:crypto";

import { test, expect } from "@jest/globals";

import signTokens from ".";
import { verify } from "@lib/tokenPromise";
import { JWT_REGEX } from "../constants";

interface Verify {
  sub: string;
}

test("Auth | Should sign auth tokens", async () => {
  const userId = randomUUID();
  const tokens = await signTokens(userId);

  expect(Array.isArray(tokens)).toBe(true);
  expect(tokens.length).toBe(3);

  expect(tokens[0]).toMatch(JWT_REGEX);
  expect(tokens[1]).toMatch(JWT_REGEX);

  const [header, payload, signature] = tokens[0].split(".");

  expect(tokens[2]).toHaveProperty("auth", payload);
  expect(tokens[2]).toHaveProperty("token", signature);
  expect(tokens[2]).toHaveProperty("sig", header);

  const refreshSecret = process.env.REFRESH_TOKEN_SECRET ?? "";
  const accessSecret = process.env.ACCESS_TOKEN_SECRET ?? "";

  const refresh = verify(tokens[0], refreshSecret) as Promise<Verify>;
  const access = verify(tokens[1], accessSecret) as Promise<Verify>;

  const [refreshToken, accessToken] = await Promise.all([refresh, access]);

  expect(refreshToken).toHaveProperty("iat");
  expect(refreshToken).toHaveProperty("exp");
  expect(refreshToken).toHaveProperty("sub", userId);

  expect(accessToken).toHaveProperty("iat");
  expect(accessToken).toHaveProperty("exp");
  expect(accessToken).toHaveProperty("sub", userId);
});
