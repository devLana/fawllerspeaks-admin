import { describe, expect, it, jest, beforeEach } from "@jest/globals";

import createPostTags from "..";
import spyDb from "@tests/spyDb";
import { mockContext, info } from "@tests/resolverArguments";
import {
  tags,
  tag1,
  tag2,
  tag3,
  tag4,
  validations,
  verify,
  testWarn,
  testDuplicate,
} from "../utils/createPostTags.testUtils";
import deleteSession from "@utils/deleteSession";

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

beforeEach(() => {
  mockContext.user = "logged_In_User_Id";
});

describe("Test createPostTags resolver", () => {
  describe("Verify user authentication", () => {
    it("Should return an error response if the user is not logged in", async () => {
      mockContext.user = null;

      const result = await createPostTags({}, { tags }, mockContext, info);

      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("message", "Unable to create post tags");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    it.each(validations)("%s", async (_, data, errorMsg) => {
      const result = await createPostTags(
        {},
        { tags: data },
        mockContext,
        info
      );

      expect(result).toHaveProperty("tagsError", errorMsg);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    it.each(verify)("%s", async (_, mock, data, msg) => {
      const spy = spyDb({ rows: mock }).mockReturnValue({ rows: [] });

      const result = await createPostTags(
        {},
        { tags: data },
        mockContext,
        info
      );

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: mock });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(result).toHaveProperty("message", `Unable to create post ${msg}`);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Create post tags", () => {
    it("Should create new post tags from the provided input array", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [] });
      spy.mockReturnValueOnce({ rows: [tag1, tag2, tag3, tag4] });

      const result = await createPostTags({}, { tags }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(spy).toHaveNthReturnedWith(3, { rows: [tag1, tag2, tag3, tag4] });
      expect(result).toHaveProperty("tags", [tag1, tag2, tag3, tag4]);
      expect(result).toHaveProperty("status", "SUCCESS");
    });

    it.each(testWarn)("%s", async (_, mocks, data, errorMsg) => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: mocks[0] });
      spy.mockReturnValueOnce({ rows: mocks[1] });

      const result = await createPostTags({}, { tags }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: mocks[0] });
      expect(spy).toHaveNthReturnedWith(3, { rows: mocks[1] });
      expect(result).toHaveProperty("tags", data);
      expect(result).toHaveProperty("status", "WARN");
      expect(result).toHaveProperty("message", errorMsg);
    });

    it.each(testDuplicate)("%s", async (_, data, mock, errorMsg) => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: mock });

      const result = await createPostTags(
        {},
        { tags: data },
        mockContext,
        info
      );

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: mock });
      expect(result).not.toHaveProperty("tags");
      expect(result).toHaveProperty("message", errorMsg);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });
});
