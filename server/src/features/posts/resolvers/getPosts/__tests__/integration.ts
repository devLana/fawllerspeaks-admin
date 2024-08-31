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
    it("When the user is not logged in, Expect an  error object", async () => {
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

      expect(result).toHaveProperty("cursorError", errors.cursorError);
      expect(result).toHaveProperty("typeError", errors.typeError);
      expect(result).toHaveProperty("sortError", errors.sortError);
      expect(result).toHaveProperty("statusError", errors.statusError);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    it("Should return an error object if the user could not be verified", async () => {
      const spy = spyDb({ rows: [] });
      const inputs: Args = { filters: mocks.intFilters };

      const result = await getPosts({}, inputs, mockContext, info);

      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: [] });
      expect(result).toHaveProperty("message", "Unable to retrieve posts");
      expect(result).toHaveProperty("status", "ERROR");
    });

    it("Should return an error object if the user is unregistered", async () => {
      const spy = spyDb({ rows: [{ isRegistered: false }] });
      const inputs: Args = { filters: mocks.intFilters };

      const result = await getPosts({}, inputs, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: false }] });
      expect(result).toHaveProperty("message", "Unable to retrieve posts");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify pagination cursor", () => {
    it("An invalid pagination cursor string was provided, Expect an error object", async () => {
      const inputs: Args = { filters: mocks.intFilters, page: mocks.page };
      const spy = spyDb({ rows: [{ isRegistered: true }] });

      const data = await getPosts({}, inputs, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(data).toHaveProperty("message", "Unable to retrieve posts");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Query for posts", () => {
    it("No posts found, Should return an empty posts array", async () => {
      const inputs: Args = { filters: mocks.intFilters };
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [] });

      const result = await getPosts({}, inputs, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(result).toHaveProperty("posts", []);
      expect(result).toHaveProperty("pageData", {});
      expect(result).toHaveProperty("status", "SUCCESS");
    });

    it("Post(s) found, Should return a posts array and a pagination page data object", async () => {
      const inputs: Args = { filters: mocks.intFilters };
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: mocks.dbPosts });
      spy.mockReturnValueOnce({ rows: [{}] });
      spy.mockReturnValueOnce({ rows: [{}] });

      const result = await getPosts({}, inputs, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: mocks.dbPosts });
      expect(spy).toHaveNthReturnedWith(3, { rows: [{}] });
      expect(spy).toHaveNthReturnedWith(4, { rows: [{}] });
      expect(result).toHaveProperty("posts", mocks.dbPosts);
      expect(result).toHaveProperty("status", "SUCCESS");

      expect(result).toHaveProperty(
        "pageData.after",
        "MjAyMS0wNS0xN1QxMjoyMjo0My43MTdaX3Bvc3QtaWQtMg"
      );

      expect(result).toHaveProperty(
        "pageData.before",
        "MjAyMS0wNS0xN1QxMjoyMjo0My43MTdaX3Bvc3QtaWQtMQ"
      );
    });
  });
});
