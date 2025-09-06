import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import getPosts from "..";
import * as mocks from "../utils/getPosts.testUtils";
import deleteSession from "@utils/deleteSession";
import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";

import type { QueryGetPostsArgs as Args } from "@resolverTypes";

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

beforeEach(() => {
  mockContext.user = "user_id";
});

describe("Test get posts resolver", () => {
  describe("Verify user authentication", () => {
    it("Expect an  error object when the user is not logged in", async () => {
      mockContext.user = null;

      const result = await getPosts({}, {}, mockContext, info);

      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("message", "Unable to retrieve posts");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.intValidations)("%s", async (_, input, errors) => {
      const result = await getPosts({}, input, mockContext, info);

      expect(result).toHaveProperty("afterError", errors.afterError);
      expect(result).toHaveProperty("sizeError", errors.sizeError);
      expect(result).toHaveProperty("sortError", errors.sortError);
      expect(result).toHaveProperty("statusError", errors.statusError);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    it.each(mocks.verifyUser)("%s", async (_, rows) => {
      const spy = spyDb({ rows });

      const result = await getPosts({}, mocks.intFilters, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows });
      expect(result).toHaveProperty("message", "Unable to retrieve posts");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify after cursor", () => {
    it("Expect an error object if the sort column is 'date_created' and a malformed after cursor string is provided", async () => {
      const inputs: Args = { ...mocks.intFilters, ...mocks.page };
      const spy = spyDb({ rows: [{ isRegistered: true }] });

      const data = await getPosts({}, inputs, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(data).toHaveProperty("message", "Unable to retrieve posts");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Query for posts", () => {
    it("Expect all valid posts to be retrieved from the database", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: mocks.dbPosts });

      const result = await getPosts({}, {}, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: mocks.dbPosts });
      expect(result).toHaveProperty("posts", mocks.dbPosts);
      expect(result).toHaveProperty("status", "SUCCESS");
      expect(result).toHaveProperty("pageData", {});
    });
  });
});
