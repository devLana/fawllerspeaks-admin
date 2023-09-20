import { randomUUID, createDecipheriv } from "node:crypto";

import { test, expect } from "@jest/globals";

import signTokens from ".";
import { verify } from "@lib/tokenPromise";
import { JWT_REGEX } from "../constants";

interface Verify {
  sub: string;
}

const algorithm = process.env.CIPHER_ALGORITHM ?? "";
const key = Buffer.from(process.env.CIPHER_KEY ?? "", "hex");
const iv = Buffer.from(process.env.CIPHER_IV ?? "", "hex");

const decrypt = (token: string) => {
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(token, "hex", "utf-8");

  decrypted += decipher.final("utf-8");
  return decrypted;
};

test("Auth | Should sign auth tokens", async () => {
  const userId = randomUUID();
  const tokens = await signTokens(userId);

  expect(Array.isArray(tokens)).toBe(true);
  expect(tokens.length).toBe(3);

  expect(tokens[0]).toMatch(JWT_REGEX);
  expect(tokens[1]).toMatch(JWT_REGEX);

  const [header, payload, signature] = tokens[0].split(".");

  expect(decrypt(tokens[2].auth)).toBe(payload);
  expect(decrypt(tokens[2].token)).toBe(signature);
  expect(decrypt(tokens[2].sig)).toBe(header);

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
