import { it, describe, expect, beforeEach } from "@jest/globals";

import getPostTags from "..";
import { spyDb, info, mockContext } from "@tests";

const dateCreated = "2022-11-07 13:22:43.717+01";
const returnDateCreated = "2022-11-07T12:22:43.717Z";
const lastModified = "2022-12-15 02:00:15.126+01";
const returnLastModified = "2022-12-15T01:00:15.126Z";

beforeEach(() => {
  mockContext.user = "logged_in_user_id";
});

describe("Test get post tags resolver", () => {
  it("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await getPostTags({}, {}, mockContext, info);

    expect(result).toHaveProperty("message", "Unable to get post tags");
    expect(result).toHaveProperty("status", "ERROR");
  });

  it.each([
    ["unknown", []],
    ["unregistered", [{ isRegistered: false }]],
  ])("Should return error for %s user", async (_, data) => {
    const spy = spyDb({ rows: data });

    const result = await getPostTags({}, {}, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith({ rows: data });

    expect(result).toHaveProperty("message", "Unable to get post tags");
    expect(result).toHaveProperty("status", "ERROR");
  });

  it("Returns all post tags", async () => {
    const dbTags = [
      { id: "1", name: "tag1", dateCreated, lastModified: null },
      { id: "2", name: "tag2", dateCreated, lastModified },
    ];

    const returnTags = [
      {
        id: "1",
        name: "tag1",
        dateCreated: returnDateCreated,
        lastModified: null,
      },
      {
        id: "2",
        name: "tag2",
        dateCreated: returnDateCreated,
        lastModified: returnLastModified,
      },
    ];

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValue({ rows: dbTags });

    const result = await getPostTags({}, {}, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: dbTags });

    expect(result).toHaveProperty("tags", returnTags);
    expect(result).toHaveProperty("status", "SUCCESS");
  });
});
