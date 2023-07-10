import { Buffer } from "node:buffer";

import { describe, expect, test } from "@jest/globals";

import generateBytes from ".";
import { DEFAULT_BYTE_SIZE } from "../constants";

type TableItem = [BufferEncoding];

describe("Auth | generateBytes", () => {
  const table: [TableItem, TableItem] = [["base64url"], ["hex"]];

  test.each(table)("Should generate random %s string", async encoding => {
    const str = await generateBytes(DEFAULT_BYTE_SIZE, encoding);
    const buf = Buffer.from(str, encoding);

    expect(buf.length).toBe(DEFAULT_BYTE_SIZE);
    expect(buf.toString(encoding)).toBe(str);
  });
});
