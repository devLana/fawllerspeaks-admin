import { describe, expect, test, beforeEach } from "@jest/globals";

import deletePostsFromBin from "..";
import {
  dbPost1,
  dbPost2,
  dbPost3,
  dbPost4,
  name,
  postIds,
  dbPostTags,
  returnPost1,
  returnPost2,
  returnPost3,
  returnPost4,
  validationsTable,
} from "../deletePostsFromBin.testUtils";
import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";

beforeEach(() => {
  mockContext.user = "logged_In_User_Id";
});

describe("Test delete posts from bin resolver", () => {
  test("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await deletePostsFromBin(
      {},
      { postIds: [] },
      mockContext,
      info
    );

    expect(result).toHaveProperty("message", "Unable to delete post from bin");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each(validationsTable)(
    "Returns error for %s",
    async (_, testIds, errorMsg) => {
      const data = await deletePostsFromBin(
        {},
        { postIds: testIds },
        mockContext,
        info
      );

      expect(data).toHaveProperty("postIdsError", errorMsg);
      expect(data).toHaveProperty("status", "ERROR");
    }
  );

  test.each([
    ["unknown user", []],
    ["unregistered user", [{ isRegistered: false }]],
  ])("Should return error on %s", async (_, userData) => {
    const spy = spyDb({ rows: userData });
    spy.mockReturnValue({ rows: [] });

    const data = await deletePostsFromBin({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: userData });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(data).toHaveProperty("message", "Unable to delete posts from bin");
    expect(data).toHaveProperty("status", "ERROR");
  });

  test("Returns error if user tries to delete another author's posts from bin", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [{}] });
    spy.mockReturnValueOnce({ rows: [] });

    const data = await deletePostsFromBin({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [{}] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(data).toHaveProperty(
      "message",
      "Cannot delete another author's posts from bin"
    );
    expect(data).toHaveProperty("status", "ERROR");
  });

  test("Should delete all provided posts in the input array from bin", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true, name }] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: dbPostTags });
    spy.mockReturnValueOnce({ rows: [dbPost1, dbPost2, dbPost3, dbPost4] });

    const result = await deletePostsFromBin({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, {
      rows: [{ isRegistered: true, name }],
    });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: dbPostTags });
    expect(spy).toHaveNthReturnedWith(4, {
      rows: [dbPost1, dbPost2, dbPost3, dbPost4],
    });

    expect(result).not.toHaveProperty("message");

    expect(result).toHaveProperty("status", "SUCCESS");
    expect(result).toHaveProperty("posts", [
      returnPost1,
      returnPost2,
      returnPost3,
      returnPost4,
    ]);
  });

  test("Returns warning if at least one post could not be deleted from bin", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true, name }] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: dbPostTags });
    spy.mockReturnValueOnce({ rows: [dbPost2, dbPost4] });

    const result = await deletePostsFromBin({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, {
      rows: [{ isRegistered: true, name }],
    });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: dbPostTags });
    expect(spy).toHaveNthReturnedWith(4, { rows: [dbPost2, dbPost4] });

    expect(result).toHaveProperty("posts", [returnPost2, returnPost4]);
    expect(result).toHaveProperty(
      "message",
      "2 posts deleted from bin. 2 other posts could not be deleted from bin"
    );
    expect(result).toHaveProperty("status", "WARN");
  });

  test("Should return error if no post could be deleted from bin", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: dbPostTags });
    spy.mockReturnValueOnce({ rows: [] });

    const result = await deletePostsFromBin({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: dbPostTags });
    expect(spy).toHaveNthReturnedWith(4, { rows: [] });

    expect(result).not.toHaveProperty("message", "posts");
    expect(result).not.toHaveProperty("message", "binnedPosts");
    expect(result).not.toHaveProperty("message", "warning");

    expect(result).toHaveProperty(
      "message",
      "The provided posts could not be deleted from bin"
    );
    expect(result).toHaveProperty("status", "ERROR");
  });
});
