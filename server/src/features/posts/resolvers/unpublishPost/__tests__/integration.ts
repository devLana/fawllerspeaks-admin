import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import unpublishPost from "..";
import * as mocks from "../utils/unpublishPost.testUtils";
import deleteSession from "@utils/deleteSession";

import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

describe("Test unpublish post resolver", () => {
  beforeEach(() => {
    mockContext.user = mocks.userId;
  });

  describe("Verify user authentication", () => {
    it("Expect an error object if the user is logged out", async () => {
      mockContext.user = null;

      const data = await unpublishPost({}, { postId: "" }, mockContext, info);

      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty("message", "Unable to unpublish post");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, postId, errorMsg) => {
      const data = await unpublishPost({}, { postId }, mockContext, info);

      expect(data).toHaveProperty("postIdError", errorMsg);
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    it.each(mocks.verify)("%s", async (_, mock) => {
      const spy = spyDb({ rows: mock });
      const postId = mocks.UUID;

      const data = await unpublishPost({}, { postId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: mock });
      expect(data).toHaveProperty("message", "Unable to unpublish post");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe.each(mocks.verifyPost)("%s", (_, [testLabel, mock, errorMsg]) => {
    it(testLabel, async () => {
      const postId = mocks.UUID;
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: mock });

      const data = await unpublishPost({}, { postId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: mock });
      expect(data).toHaveProperty("message", errorMsg);
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Update post status and Unpublish a post", () => {
    it("Expect an Unpublished post to remain unpublished", async () => {
      const postId = mocks.UUID;
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mocks.dbPost] });

      const data = await unpublishPost({}, { postId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [mocks.dbPost] });
      expect(data).toHaveProperty("status", "SUCCESS");
      expect(data).toHaveProperty("post", mocks.post);
    });
  });
});
