import { Buffer } from "node:buffer";

import { describe, expect, test } from "@jest/globals";

import generateBytes from ".";

type TableItem = [BufferEncoding];

describe("Auth | generateBytes", () => {
  const table: [TableItem, TableItem] = [["base64url"], ["hex"]];

  test.each(table)("Should generate random %s string", async encoding => {
    const str = await generateBytes(10, encoding);
    const buf = Buffer.from(str, encoding);

    expect(buf.length).toBe(10);
    expect(buf.toString(encoding)).toBe(str);
  });
});
