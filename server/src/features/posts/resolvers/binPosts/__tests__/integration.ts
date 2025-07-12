import { describe, expect, it, beforeEach, jest } from "@jest/globals";

import binPosts from "..";
import * as mocks from "../utils/binPosts.testUtils";

import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";
import deleteSession from "@utils/deleteSession";

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

describe("Test bin posts resolvers", () => {
  beforeEach(() => {
    mockContext.user = "logged_In_User_Id";
  });

  describe("Verify user authentication", () => {
    it("Expect an error object if the user is not logged in", async () => {
      mockContext.user = null;

      const data = await binPosts({}, { postIds: [] }, mockContext, info);

      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty("message", "Unable to move post to bin");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, postIds, errorMsg) => {
      const data = await binPosts({}, { postIds }, mockContext, info);

      expect(data).toHaveProperty("postIdsError", errorMsg);
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify logged in user", () => {
    it.each(mocks.verifyUser)("%s", async (_, mock) => {
      const { postIds } = mocks;
      const spy = spyDb({ rows: mock });

      const data = await binPosts({}, { postIds }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: mock });
      expect(data).toHaveProperty("message", "Unable to move posts to bin");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify post ids", () => {
    it("Expect an error object if no post could be moved to bin", async () => {
      const { postIds } = mocks;
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [] });

      const data = await binPosts({}, { postIds }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(data).toHaveProperty("status", "ERROR");

      expect(data).toHaveProperty(
        "message",
        "None of the selected posts could be moved to bin"
      );
    });
  });

  describe("Move posts to bin", () => {
    it("Expect all selected posts to be moved to bin", async () => {
      const { postIds } = mocks;
      const binnedPosts = [mocks.post1, mocks.post2, mocks.post3, mocks.post4];
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: binnedPosts });

      const data = await binPosts({}, { postIds }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: binnedPosts });
      expect(data).not.toHaveProperty("message");
      expect(data).toHaveProperty("posts", binnedPosts);
      expect(data).toHaveProperty("status", "SUCCESS");
    });

    it("Expect some of the provided posts to be moved to bin with a warning message", async () => {
      const { postIds } = mocks;
      const binnedPosts = [mocks.post1, mocks.post4];
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: binnedPosts });

      const data = await binPosts({}, { postIds }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: binnedPosts });
      expect(data).toHaveProperty("message", "2 out of 4 posts moved to bin");
      expect(data).toHaveProperty("posts", binnedPosts);
      expect(data).toHaveProperty("status", "WARN");
    });
  });
});
