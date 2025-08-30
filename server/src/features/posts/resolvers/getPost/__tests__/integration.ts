import { beforeEach, describe, expect, test, jest } from "@jest/globals";

import getPost from "..";
import * as mocks from "../utils/getPost.testUtils";
import deleteSession from "@utils/deleteSession";
import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

beforeEach(() => {
  mockContext.user = "mock_user_id";
});

describe("Test get post resolver", () => {
  describe("Verify user authentication", () => {
    test("Should return an error object when the user is not logged in", async () => {
      mockContext.user = null;

      const result = await getPost({}, { slug: "" }, mockContext, info);

      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("message", "Unable to retrieve post");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    test.each(mocks.validations)("%s", async (_, slug) => {
      const result = await getPost({}, { slug }, mockContext, info);

      expect(result).toHaveProperty("slugError", "Provide post slug");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify User", () => {
    test("Should return an error object if the user could not be verified", async () => {
      const spy = spyDb({ rows: [] });

      const result = await getPost({}, { slug: "slug" }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: [] });
      expect(result).toHaveProperty("message", "Unable to retrieve post");
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Should return an error object if the user is unregistered", async () => {
      const spy = spyDb({ rows: [{ isRegistered: false }] });

      const result = await getPost({}, { slug: "slug" }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: false }] });
      expect(result).toHaveProperty("message", "Unable to retrieve post");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Retrieve post", () => {
    test("Expect an error response object if a post could not be found with the provided post slug", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [] });

      const result = await getPost({}, { slug: "slug" }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(result).toHaveProperty("message", "Unable to retrieve post");
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Expect a post response object if a post could be found with the provided post slug", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mocks.data] });

      const result = await getPost({}, { slug: "slug" }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [mocks.data] });
      expect(result).toHaveProperty("post", mocks.data);
      expect(result).toHaveProperty("status", "SUCCESS");
    });
  });
});
