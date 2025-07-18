import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import resolverFn from "..";
import * as mocks from "../utils/undoUnpublishPost.testUtils";
import deleteSession from "@utils/deleteSession";

import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

describe("Test undoUnpublish post resolver", () => {
  beforeEach(() => {
    mockContext.user = mocks.userId;
  });

  describe("Verify user authentication", () => {
    it("Expect an error object if the user is logged out", async () => {
      mockContext.user = null;

      const data = await resolverFn({}, { postId: "" }, mockContext, info);

      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty("message", "Unable to undo unpublish post");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });
  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, postId, errorMsg) => {
      const data = await resolverFn({}, { postId }, mockContext, info);

      expect(data).toHaveProperty("postIdError", errorMsg);
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    it.each(mocks.verify)("%s", async (_, mock) => {
      const spy = spyDb({ rows: mock });
      const postId = mocks.UUID;

      const data = await resolverFn({}, { postId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: mock });
      expect(data).toHaveProperty("message", "Unable to undo unpublish post");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe.each(mocks.verifyPost)("%s", (_, [testLabel, mock, errorMsg]) => {
    it(testLabel, async () => {
      const postId = mocks.UUID;
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: mock });

      const data = await resolverFn({}, { postId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: mock });
      expect(data).toHaveProperty("message", errorMsg);
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Undo post status and update post status", () => {
    it("Expect to be able to undo an Unpublished post to Published", async () => {
      const postId = mocks.UUID;
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mocks.dbPost] });

      const data = await resolverFn({}, { postId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [mocks.dbPost] });
      expect(data).toHaveProperty("status", "SUCCESS");
      expect(data).toHaveProperty("post", mocks.post);
    });
  });
});
