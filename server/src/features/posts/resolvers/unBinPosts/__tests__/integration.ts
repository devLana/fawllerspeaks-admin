import { describe, expect, test, beforeEach } from "@jest/globals";

import unBinPosts from "..";
import {
  dbPost1,
  dbPost2,
  dbPost3,
  dbPost4,
  mockPostTags,
  name,
  postIds,
  returnPost1,
  returnPost2,
  returnPost3,
  returnPost4,
  testTable1,
} from "../testsData";
import { mockContext, info, spyDb } from "@tests";

beforeEach(() => {
  mockContext.user = "logged_In_User_Id";
});

describe("Test Un-bin posts resolvers", () => {
  test("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await unBinPosts({}, { postIds: [] }, mockContext, info);

    expect(result).toHaveProperty("message", "Unable to remove post from bin");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each(testTable1)("Returns error for %s", async (_, mocks, errorMsg) => {
    const data = await unBinPosts({}, { postIds: mocks }, mockContext, info);

    expect(data).toHaveProperty("postIdsError", errorMsg);
    expect(data).toHaveProperty("status", "ERROR");
  });

  test.each([
    ["unknown user", []],
    ["unregistered user", [{ isRegistered: false }]],
  ])("Should return error on %s", async (_, userData) => {
    const spy = spyDb({ rows: userData });
    spy.mockReturnValue({ rows: [] });

    const data = await unBinPosts({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: userData });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(data).toHaveProperty("message", "Unable to remove posts from bin");
    expect(data).toHaveProperty("status", "ERROR");
  });

  test("Returns error if user tries to remove another author's posts from bin", async () => {
    const message = "Cannot remove another author's posts from bin";
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [{}] });
    spy.mockReturnValueOnce({ rows: [] });

    const data = await unBinPosts({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [{}] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(data).toHaveProperty("message", message);
    expect(data).toHaveProperty("status", "ERROR");
  });

  test("Removes all posts provided in the input array from bin", async () => {
    const spyData1 = [{ isRegistered: true, name }];
    const spyData2 = [dbPost1, dbPost2, dbPost3, dbPost4];
    const posts = [returnPost1, returnPost2, returnPost3, returnPost4];
    const spy = spyDb({ rows: spyData1 });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: mockPostTags });
    spy.mockReturnValueOnce({ rows: spyData2 });

    const result = await unBinPosts({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, { rows: spyData1 });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: mockPostTags });
    expect(spy).toHaveNthReturnedWith(4, { rows: spyData2 });

    expect(result).not.toHaveProperty("message");
    expect(result).toHaveProperty("posts", posts);
    expect(result).toHaveProperty("status", "SUCCESS");
  });

  test("Returns warning if at least one post could not be removed from bin", async () => {
    const msg = "2 posts removed. 2 other posts could not be removed from bin";
    const spyData = [{ isRegistered: true, name }];
    const spy = spyDb({ rows: spyData });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: mockPostTags });
    spy.mockReturnValueOnce({ rows: [dbPost2, dbPost4] });

    const result = await unBinPosts({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, { rows: spyData });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: mockPostTags });
    expect(spy).toHaveNthReturnedWith(4, { rows: [dbPost2, dbPost4] });

    expect(result).toHaveProperty("posts", [returnPost2, returnPost4]);
    expect(result).toHaveProperty("message", msg);
    expect(result).toHaveProperty("status", "WARN");
  });

  test("Should return error if no post could be removed from bin", async () => {
    const message = "The provided posts could not be removed from bin";
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: mockPostTags });
    spy.mockReturnValueOnce({ rows: [] });

    const result = await unBinPosts({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: mockPostTags });
    expect(spy).toHaveNthReturnedWith(4, { rows: [] });

    expect(result).not.toHaveProperty("posts");
    expect(result).toHaveProperty("message", message);
    expect(result).toHaveProperty("status", "ERROR");
  });
});
