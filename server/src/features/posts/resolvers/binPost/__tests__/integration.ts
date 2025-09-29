import { describe, expect, it, beforeEach, jest } from "@jest/globals";

import binPost from "..";
import * as mocks from "../utils/binPost.testUtils";

import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";
import deleteSession from "@utils/deleteSession";

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

describe("Test bin post resolver", () => {
  beforeEach(() => {
    mockContext.user = "logged_In_User_Id";
  });

  describe("Verify user authentication", () => {
    it("Expect an error object if the user is not logged in", async () => {
      mockContext.user = null;

      const data = await binPost({}, { postId: "" }, mockContext, info);

      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty("message", "Unable to move post to bin");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, postId, errorMsg) => {
      const data = await binPost({}, { postId }, mockContext, info);

      expect(data).toHaveProperty("postIdError", errorMsg);
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify logged in user", () => {
    it.each(mocks.verifyUser)("%s", async (_, mock) => {
      const { postId } = mocks;
      const spy = spyDb({ rows: mock }).mockReturnValueOnce({ rows: [{}] });

      const data = await binPost({}, { postId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: mock });
      expect(spy).toHaveNthReturnedWith(2, { rows: [{}] });
      expect(data).toHaveProperty("message", "Unable to move post to bin");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify post id", () => {
    it.each(mocks.verifyPost)("%s", async (_, mock, message) => {
      const { postId } = mocks;
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: mock });

      const data = await binPost({}, { postId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: mock });
      expect(data).toHaveProperty("status", "ERROR");
      expect(data).toHaveProperty("message", message);
    });
  });

  describe("Move post to bin", () => {
    it("Expect the post to be moved to bin", async () => {
      const { postId } = mocks;
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [{ is_in_bin: false }] });
      spy.mockReturnValueOnce({ rows: [mocks.post1] });

      const data = await binPost({}, { postId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [{ is_in_bin: false }] });
      expect(spy).toHaveNthReturnedWith(3, { rows: [mocks.post1] });
      expect(data).toHaveProperty("post", mocks.post1);
      expect(data).toHaveProperty("status", "SUCCESS");
    });
  });
});
