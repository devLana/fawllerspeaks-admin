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
      const result = await createPost({}, { post }, mockContext, info);

      expect(result).toHaveProperty("titleError", errors.titleError);
      expect(result).toHaveProperty("excerptError", errors.excerptError);
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
      const post = { ...mocks.argsWithImage };
      const spy = spyDb({ rows: data });
      spy.mockReturnValueOnce({ rows: [] });

      const result = await createPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: data });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(result).toHaveProperty("message", "Unable to create post");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify post title and post url slug", () => {
    it.each(mocks.verifyTitleSlug)("%s", async (_, errorMsg, mock) => {
      const post = { ...mocks.argsWithNoImage, tagIds: null };
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mock] });

      const data = await createPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [mock] });
      expect(data).toHaveProperty("status", "ERROR");
      expect(data).toHaveProperty("message", errorMsg);
    });
  });

  describe.skip("Verify post tag ids", () => {
    it("Should return an error object if at least one of the provided post tag ids is unknown", async () => {
      const post = { ...mocks.argsWithNoImage, tagIds: mocks.tagIds };
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [] });

      const data = await createPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(data).toHaveProperty("message", "Unknown post tag id provided");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Create post", () => {
    const author = "Author Name /author/image/path";
    const mockRows = [{ isRegistered: true, author }];

    it("Should create and publish a new post with an image banner and post tags", async () => {
      const post = { ...mocks.argsWithImage, tagIds: mocks.tagIds };
      const tags = ["tag", "tag", "tag"];
      const mockDBPost = [{ ...mocks.dbPost, tags }];
      const spy = spyDb({ rows: mockRows });
      spy.mockReturnValueOnce({ rows: [] });
      spy.mockReturnValueOnce({ rows: mockDBPost });

      const result = await createPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: mockRows });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(spy).toHaveNthReturnedWith(3, { rows: mockDBPost });
      expect(result).toHaveProperty("post.id", mocks.dbPost.id);
      expect(result).toHaveProperty("post.title", post.title);
      expect(result).toHaveProperty("post.excerpt", post.excerpt);
      expect(result).toHaveProperty("post.description", post.description);
      expect(result).toHaveProperty("post.author", author);
      expect(result).toHaveProperty("post.url", "blog-post-title");
      expect(result).toHaveProperty("post.status", "Published");
      expect(result).toHaveProperty("post.imageBanner", mocks.imageBanner);
      expect(result).toHaveProperty("post.dateCreated", mocks.dateCreated);
      expect(result).toHaveProperty("post.datePublished", mocks.dateCreated);
      expect(result).toHaveProperty("post.lastModified", null);
      expect(result).toHaveProperty("post.views", 0);
      expect(result).toHaveProperty("post.isInBin", false);
      expect(result).toHaveProperty("post.isDeleted", false);
      expect(result).toHaveProperty("post.tags", tags);
      expect(result).toHaveProperty("status", "SUCCESS");

      expect(result).toHaveProperty(
        "post.content",
        mocks.postContentWithImage.html
      );
    });

    it("Should create and publish a new post without an image banner and post tags", async () => {
      const mockDBPost = [{ ...mocks.dbPost, tags: null }];
      const post = mocks.argsWithNoImage;
      const spy = spyDb({ rows: mockRows });
      spy.mockReturnValueOnce({ rows: [] });
      spy.mockReturnValueOnce({ rows: mockDBPost });

      const result = await createPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: mockRows });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(spy).toHaveNthReturnedWith(3, { rows: mockDBPost });
      expect(result).toHaveProperty("post.imageBanner", null);
      expect(result).toHaveProperty("post.tags", null);
      expect(result).toHaveProperty("post.url", "another-blog-post-title");
      expect(result).toHaveProperty("status", "SUCCESS");
    });
  });
});
