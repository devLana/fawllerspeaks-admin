import { describe, it, expect, beforeEach, jest } from "@jest/globals";

import createPost from "..";
import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import * as mocks from "../utils/createPost.testUtils";

import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";
import deleteSession from "@utils/deleteSession";

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

jest.mock("@lib/supabase/supabaseEvent");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true);

beforeEach(() => {
  mockContext.user = "mocked_user_id";
});

describe("Test createPost resolver", () => {
  describe("Verify user authentication", () => {
    it("Should return an error object if the user is not logged in", async () => {
      mockContext.user = null;

      const post = mocks.argsWithNoImage;
      const result = await createPost({}, { post }, mockContext, info);

      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("message", "Unable to create post");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations())("%s", async (_, post, errors) => {
      const data = await createPost({}, { post }, mockContext, info);

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
      spyDb({ rows: data }).mockReturnValueOnce({ rows: [] });

      const post = { ...mocks.argsWithImage };
      const result = await createPost({}, { post }, mockContext, info);

      expect(result).toHaveProperty("message", "Unable to create post");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify post title and post url slug", () => {
    it.each(mocks.verifyTitleSlug)("%s", async (_, errorMsg, mock) => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mock] });

      const post = { ...mocks.argsWithNoImage, tagIds: null };
      const data = await createPost({}, { post }, mockContext, info);

      expect(data).toHaveProperty("status", "ERROR");
      expect(data).toHaveProperty("message", errorMsg);
    });
  });

  describe("Create post", () => {
    it("Should create and publish a new post with an image banner and post tags", async () => {
      spyDb({ rows: [mocks.user] })
        .mockReturnValueOnce({ rows: [] })
        .mockReturnValueOnce({ rows: [{ ...mocks.dbPost, tags: mocks.tags }] });

      const post = { ...mocks.argsWithImage, tagIds: mocks.tagIds };
      const result = await createPost({}, { post }, mockContext, info);

      expect(result).toHaveProperty("post.id", mocks.dbPost.id);
      expect(result).toHaveProperty("post.title", post.title);
      expect(result).toHaveProperty("post.excerpt", post.excerpt);
      expect(result).toHaveProperty("post.description", post.description);
      expect(result).toHaveProperty("post.author", mocks.author);
      expect(result).toHaveProperty("post.url", mocks.url1);
      expect(result).toHaveProperty("post.status", "Published");
      expect(result).toHaveProperty("post.imageBanner", mocks.imageBanner);
      expect(result).toHaveProperty("post.dateCreated", mocks.dateCreated);
      expect(result).toHaveProperty("post.datePublished", mocks.dateCreated);
      expect(result).toHaveProperty("post.lastModified", null);
      expect(result).toHaveProperty("post.views", 0);
      expect(result).toHaveProperty("post.isInBin", false);
      expect(result).toHaveProperty("post.isDeleted", false);
      expect(result).toHaveProperty("post.tags", mocks.tags);
      expect(result).toHaveProperty("status", "SUCCESS");

      expect(result).toHaveProperty(
        "post.content",
        mocks.postContentWithImage.html
      );
    });

    it("Should create and publish a new post without an image banner and post tags", async () => {
      spyDb({ rows: [mocks.user] })
        .mockReturnValueOnce({ rows: [] })
        .mockReturnValueOnce({ rows: [{ ...mocks.dbPost, tags: null }] });

      const post = mocks.argsWithNoImage;
      const result = await createPost({}, { post }, mockContext, info);

      expect(result).toHaveProperty("post.imageBanner", null);
      expect(result).toHaveProperty("post.tags", null);
      expect(result).toHaveProperty("post.url", mocks.url2);
      expect(result).toHaveProperty("status", "SUCCESS");
    });
  });
});
