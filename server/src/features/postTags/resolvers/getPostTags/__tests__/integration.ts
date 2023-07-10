import { it, describe, expect, beforeEach } from "@jest/globals";

import getPostTags from "..";
import { spyDb, info, mockContext } from "@tests";

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
    const tag1 = {
      id: "1",
      name: "tag1",
      dateCreated: 847,
      lastModified: null,
    };

    const tag2 = {
      id: "2",
      name: "tag2",
      dateCreated: 847,
      lastModified: 456,
    };

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValue({ rows: [tag1, tag2] });

    const result = await getPostTags({}, {}, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [tag1, tag2] });

    expect(result).toHaveProperty("tags", [tag1, tag2]);
    expect(result).toHaveProperty("status", "SUCCESS");
  });
});
