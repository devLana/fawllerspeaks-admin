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
      const data = await draftPost({}, { post }, mockContext, info);

      expect(data).toHaveProperty("titleError", errors.titleError);
      expect(data).toHaveProperty("descriptionError", errors.descriptionError);
      expect(data).toHaveProperty("excerptError", errors.excerptError);
      expect(data).toHaveProperty("contentError", errors.contentError);
      expect(data).toHaveProperty("tagIdsError", errors.tagIdsError);
      expect(data).toHaveProperty("imageBannerError", errors.imageBannerError);
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    it.each(mocks.verifyUser)("%s", async (_, data) => {
      spyDb({ rows: data }).mockReturnValue({ rows: [] });

      const post = mocks.argsWithImage;
      const result = await draftPost({}, { post }, mockContext, info);

      expect(result).toHaveProperty("message", "Unable to save post to draft");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify post title and post url slug", () => {
    it.each(mocks.verifyTitleSlug)("%s", async (_, errorMsg, mock) => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mock] });

      const post = { ...mocks.argsWithNoImage, tagIds: null };
      const result = await draftPost({}, { post }, mockContext, info);

      expect(result).toHaveProperty("status", "ERROR");
      expect(result).toHaveProperty("message", errorMsg);
    });
  });

  describe("Draft a new post", () => {
    it("Should save a new post with an image banner and post tags as draft", async () => {
      spyDb({ rows: [mocks.user] })
        .mockReturnValueOnce({ rows: [] })
        .mockReturnValueOnce({ rows: [{ ...mocks.dbData, tags: mocks.tags }] });

      const post = { ...mocks.argsWithImage, tagIds: mocks.tagIds };
      const result = await draftPost({}, { post }, mockContext, info);

      expect(result).toHaveProperty("post.id", mocks.dbData.id);
      expect(result).toHaveProperty("post.title", post.title);
      expect(result).toHaveProperty("post.description", undefined);
      expect(result).toHaveProperty("post.excerpt", undefined);
      expect(result).toHaveProperty("post.content", undefined);
      expect(result).toHaveProperty("post.url", mocks.url1);
      expect(result).toHaveProperty("post.author", mocks.author);
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
      spyDb({ rows: [mocks.user] })
        .mockReturnValueOnce({ rows: [] })
        .mockReturnValueOnce({ rows: [{ ...mocks.dbData, tags: null }] });

      const post = mocks.argsWithNoImage;
      const result = await draftPost({}, { post }, mockContext, info);

      expect(result).toHaveProperty("post.id", mocks.dbData.id);
      expect(result).toHaveProperty("post.title", post.title);
      expect(result).toHaveProperty("post.description", undefined);
      expect(result).toHaveProperty("post.excerpt", undefined);
      expect(result).toHaveProperty("post.content", mocks.html);
      expect(result).toHaveProperty("post.author", mocks.author);
      expect(result).toHaveProperty("post.status", "Draft");
      expect(result).toHaveProperty("post.imageBanner", null);
      expect(result).toHaveProperty("post.dateCreated", mocks.dateCreated);
      expect(result).toHaveProperty("post.datePublished", null);
      expect(result).toHaveProperty("post.lastModified", null);
      expect(result).toHaveProperty("post.url", mocks.url2);
      expect(result).toHaveProperty("post.views", 0);
      expect(result).toHaveProperty("post.isInBin", false);
      expect(result).toHaveProperty("post.isDeleted", false);
      expect(result).toHaveProperty("post.tags", null);
      expect(result).toHaveProperty("status", "SUCCESS");
    });
  });
});
