import { describe, it, expect, beforeEach, jest } from "@jest/globals";

import draftPost from "..";
import { supabaseEvent } from "@lib/supabase/supabaseEvent";

import * as mocks from "../utils/draftPost.testUtils";

import deleteSession from "@utils/deleteSession";
import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

jest.mock("@lib/supabase/supabaseEvent");

describe("Test draft post resolver", () => {
  const mockEvent = jest.spyOn(supabaseEvent, "emit");
  mockEvent.mockImplementation(() => true);

  beforeEach(() => {
    mockContext.user = mocks.USER_ID;
  });

  describe("Verify user authentication", () => {
    it("Should return an error object if the user is not logged in", async () => {
      mockContext.user = null;
      const post = mocks.argsWithNoImage;

      const result = await draftPost({}, { post }, mockContext, info);

      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("message", "Unable to save post to draft");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations())("%s", async (_, post, errors) => {
      const result = await draftPost({}, { post }, mockContext, info);

      expect(result).toHaveProperty("titleError", errors.titleError);
      expect(result).toHaveProperty("contentError", errors.contentError);
      expect(result).toHaveProperty("tagIdsError", errors.tagIdsError);
      expect(result).toHaveProperty("status", "ERROR");

      expect(result).toHaveProperty(
        "descriptionError",
        errors.descriptionError
      );

      expect(result).toHaveProperty(
        "imageBannerError",
        errors.imageBannerError
      );
    });
  });

  describe("Verify user", () => {
    it.each(mocks.verifyUser)("%s", async (_, data) => {
      const post = mocks.argsWithImage;
      const spy = spyDb({ rows: data });
      spy.mockReturnValue({ rows: [] });

      const result = await draftPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: data });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(result).toHaveProperty("message", "Unable to save post to draft");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify post title and post url slug", () => {
    it.each(mocks.verifyTitleSlug)("%s", async (_, errorMsg, mock) => {
      const post = { ...mocks.argsWithNoImage, tagIds: null };
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mock] });

      const result = await draftPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [mock] });
      expect(result).toHaveProperty("status", "ERROR");
      expect(result).toHaveProperty("message", errorMsg);
    });
  });

  describe("Draft a new post", () => {
    const author = "Author Name /author/image/path";
    const spyData = [{ isRegistered: true, author }];

    it("Should save a new post with an image banner and post tags as draft", async () => {
      const post = { ...mocks.argsWithImage, tagIds: mocks.tagIds };
      const mockData = [{ ...mocks.dbData, tags: mocks.tags }];
      const spy = spyDb({ rows: spyData });
      spy.mockReturnValueOnce({ rows: [] });
      spy.mockReturnValueOnce({ rows: mockData });

      const result = await draftPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: spyData });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(spy).toHaveNthReturnedWith(3, { rows: mockData });
      expect(result).toHaveProperty("post.id", mocks.dbData.id);
      expect(result).toHaveProperty("post.title", post.title);
      expect(result).toHaveProperty("post.description", undefined);
      expect(result).toHaveProperty("post.excerpt", undefined);
      expect(result).toHaveProperty("post.content", undefined);
      expect(result).toHaveProperty("post.url", "blog-post-title");
      expect(result).toHaveProperty("post.author", author);
      expect(result).toHaveProperty("post.status", "Draft");
      expect(result).toHaveProperty("post.imageBanner", mocks.imageBanner);
      expect(result).toHaveProperty("post.dateCreated", mocks.dateCreated);
      expect(result).toHaveProperty("post.datePublished", null);
      expect(result).toHaveProperty("post.lastModified", null);
      expect(result).toHaveProperty("post.views", 0);
      expect(result).toHaveProperty("post.isInBin", false);
      expect(result).toHaveProperty("post.isDeleted", false);
      expect(result).toHaveProperty("post.tags", mocks.tags);
      expect(result).toHaveProperty("status", "SUCCESS");
    });

    it("Should save a new post with an image banner and post tags as draft", async () => {
      const post = mocks.argsWithNoImage;
      const mockDBPost = [{ ...mocks.dbData, tags: null }];
      const spy = spyDb({ rows: spyData });
      spy.mockReturnValueOnce({ rows: [] });
      spy.mockReturnValueOnce({ rows: mockDBPost });

      const result = await draftPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: spyData });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(spy).toHaveNthReturnedWith(3, { rows: mockDBPost });
      expect(result).toHaveProperty("post.id", mocks.dbData.id);
      expect(result).toHaveProperty("post.title", post.title);
      expect(result).toHaveProperty("post.description", undefined);
      expect(result).toHaveProperty("post.excerpt", undefined);
      expect(result).toHaveProperty("post.content", mocks.html);
      expect(result).toHaveProperty("post.author", author);
      expect(result).toHaveProperty("post.status", "Draft");
      expect(result).toHaveProperty("post.imageBanner", null);
      expect(result).toHaveProperty("post.dateCreated", mocks.dateCreated);
      expect(result).toHaveProperty("post.datePublished", null);
      expect(result).toHaveProperty("post.lastModified", null);
      expect(result).toHaveProperty("post.url", "another-blog-post-title");
      expect(result).toHaveProperty("post.views", 0);
      expect(result).toHaveProperty("post.isInBin", false);
      expect(result).toHaveProperty("post.isDeleted", false);
      expect(result).toHaveProperty("post.tags", null);
      expect(result).toHaveProperty("status", "SUCCESS");
    });
  });
});
