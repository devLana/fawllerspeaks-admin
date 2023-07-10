import { beforeEach, describe, expect, test } from "@jest/globals";

import getPosts from "..";
import { dbPosts, posts, tags } from "../testData";
import { info, mockContext, spyDb } from "@tests";

beforeEach(() => {
  mockContext.user = "user_id";
});

describe("Test get posts resolver", () => {
  test("Returns error on logged out user", async () => {
    mockContext.user = null;

    const result = await getPosts({}, {}, mockContext, info);

    expect(result).toHaveProperty("message", "Unable to retrieve posts");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each([
    ["unknown", []],
    ["unregistered", [{ isRegistered: false }]],
  ])("Returns error on %s user", async (_, data) => {
    const spy = spyDb({ rows: data }).mockReturnValue({ rows: [] });

    const result = await getPosts({}, {}, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: data });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(result).toHaveProperty("message", "Unable to retrieve posts");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Should return all posts", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: tags });
    spy.mockReturnValueOnce({ rows: dbPosts });

    const result = await getPosts({}, {}, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: tags });
    expect(spy).toHaveNthReturnedWith(3, { rows: dbPosts });

    expect(result).toHaveProperty("posts", posts);
    expect(result).toHaveProperty("status", "SUCCESS");
  });
});
