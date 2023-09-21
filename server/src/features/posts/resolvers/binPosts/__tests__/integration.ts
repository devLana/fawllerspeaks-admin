import { Worker } from "node:worker_threads";

import { describe, expect, test, beforeEach, jest } from "@jest/globals";

// import binPostsWorker from "../binPostsWorker";
import binPosts from "..";
import {
  name,
  postIds,
  dbPostTags,
  dbPost1,
  dbPost2,
  dbPost3,
  dbPost4,
  returnPost1,
  returnPost2,
  returnPost3,
  returnPost4,
  validationsTable,
} from "../binPosts.testUtils";
import { mockContext, info, spyDb } from "@tests";

jest.mock("node:worker_threads");
// jest.mock("../binPostsWorker");

beforeEach(() => {
  mockContext.user = "logged_In_User_Id";
});

describe("Test bin posts resolvers", () => {
  test("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await binPosts({}, { postIds: [] }, mockContext, info);

    expect(Worker).not.toHaveBeenCalled();
    // expect(binPostsWorker).not.toHaveBeenCalled();

    expect(result).toHaveProperty("message", "Unable to move post to bin");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each(validationsTable)(
    "Returns error for %s",
    async (_, testPosts, errorMsg) => {
      const data = await binPosts(
        {},
        { postIds: testPosts },
        mockContext,
        info
      );

      expect(Worker).not.toHaveBeenCalled();
      // expect(binPostsWorker).not.toHaveBeenCalled();

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

    const data = await binPosts({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: userData });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(Worker).not.toHaveBeenCalled();
    // expect(binPostsWorker).not.toHaveBeenCalled();

    expect(data).toHaveProperty("message", "Unable to move posts to bin");
    expect(data).toHaveProperty("status", "ERROR");
  });

  test("Returns error if user tries to move another author's posts to bin", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [{}] });
    spy.mockReturnValueOnce({ rows: [] });

    const data = await binPosts({}, { postIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [{}] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(Worker).not.toHaveBeenCalled();
    // expect(binPostsWorker).not.toHaveBeenCalled();

    expect(data).toHaveProperty(
      "message",
      "Cannot move another author's posts to bin"
    );
    expect(data).toHaveProperty("status", "ERROR");
  });

  test("Should move all provided posts in the input array to bin", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true, name }] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: dbPostTags });
    spy.mockReturnValueOnce({ rows: [dbPost1, dbPost2, dbPost3, dbPost4] });

    const result = await binPosts({}, { postIds }, mockContext, info);

    expect(Worker).toHaveBeenCalledTimes(1);
    // expect(binPostsWorker).toHaveBeenCalled();

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

    expect(result).toHaveProperty("posts", [
      returnPost1,
      returnPost2,
      returnPost3,
      returnPost4,
    ]);

    expect(result).toHaveProperty("status", "SUCCESS");
  });

  test("Returns warning if at least one post could not be moved to bin", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true, name }] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: dbPostTags });
    spy.mockReturnValueOnce({ rows: [dbPost2, dbPost4] });

    const result = await binPosts({}, { postIds }, mockContext, info);

    expect(Worker).toHaveBeenCalledTimes(1);
    // expect(binPostsWorker).toHaveBeenCalled();

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, {
      rows: [{ isRegistered: true, name }],
    });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: dbPostTags });
    expect(spy).toHaveNthReturnedWith(4, { rows: [dbPost2, dbPost4] });

    expect(result).toHaveProperty("status", "WARN");
    expect(result).toHaveProperty(
      "message",
      "2 posts moved to bin. 2 other posts could not be moved to bin"
    );

    expect(result).toHaveProperty("posts", [returnPost2, returnPost4]);
  });

  test("Should return error if no post could be moved to bin", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: dbPostTags });
    spy.mockReturnValueOnce({ rows: [] });

    const result = await binPosts({}, { postIds }, mockContext, info);

    expect(Worker).not.toHaveBeenCalled();
    // expect(binPostsWorker).not.toHaveBeenCalled();

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: dbPostTags });
    expect(spy).toHaveNthReturnedWith(4, { rows: [] });

    expect(result).not.toHaveProperty("posts");

    expect(result).toHaveProperty(
      "message",
      "The selected posts could not be moved to bin"
    );
    expect(result).toHaveProperty("status", "ERROR");
  });
});
