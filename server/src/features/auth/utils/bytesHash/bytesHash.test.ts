import { Buffer } from "node:buffer";

import { test, expect } from "@jest/globals";
import bcrypt from "bcrypt";

import bytesHash from ".";
import { DEFAULT_BYTE_SIZE } from "../constants";

test("Auth | Should return random string and a hash", async () => {
  const { hash, password } = await bytesHash();

  const compare = await bcrypt.compare(password, hash);
  expect(compare).toBe(true);

  const buf = Buffer.from(password, "base64url");
  expect(buf.length).toBe(DEFAULT_BYTE_SIZE);
  expect(buf.toString("base64url")).toBe(password);
});
