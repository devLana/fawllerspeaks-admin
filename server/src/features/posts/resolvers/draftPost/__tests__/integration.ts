import { describe, it, expect, beforeEach, jest } from "@jest/globals";

import draftPost from "..";
import { supabaseEvent } from "@lib/supabase/supabaseEvent";

import getPostTags from "@features/posts/utils/getPostTags";
import * as mocks from "../utils/draftPost.testUtils";

import { urls } from "@utils/ClientUrls";
import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";

type MockType = jest.MockedFunction<() => mocks.Tags | null>;

jest.mock("@features/posts/utils/getPostTags", () => {
  return jest.fn().mockName("getPostTags");
});

jest.mock("@lib/supabase/supabaseEvent");

describe("Test draft post resolver", () => {
  const mockEvent = jest.spyOn(supabaseEvent, "emit");
  const mocked = getPostTags as unknown as MockType;

  mockEvent.mockImplementation(() => true);
  mocked.mockReturnValue(mocks.mockPostTagsData);

  beforeEach(() => {
    mocked.mockClear();
    mockContext.user = mocks.userId;
  });

  describe("Verify user authentication", () => {
    it("Should return an error object if the user is not logged in", async () => {
      mockContext.user = null;
      const post = mocks.argsWithNoImage;

      const result = await draftPost({}, { post }, mockContext, info);

      expect(result).toHaveProperty("message", "Unable to save post to draft");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations())("%s", async (_, post, errors) => {
      const result = await draftPost({}, { post }, mockContext, info);

      expect(getPostTags).not.toHaveBeenCalled();
      expect(result).toHaveProperty("titleError", errors.titleError);
      expect(result).toHaveProperty("contentError", errors.contentError);
      expect(result).toHaveProperty("tagsError", errors.tagsError);
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

      expect(getPostTags).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: data });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(result).toHaveProperty("message", "Unable to save post to draft");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify the provided post title", () => {
    it("Should return an error object if the provided post title already exists", async () => {
      const post = { ...mocks.argsWithNoImage, tags: null };
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [{}] });

      const result = await draftPost({}, { post }, mockContext, info);

      expect(getPostTags).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [{}] });
      expect(result).toHaveProperty("status", "ERROR");

      expect(result).toHaveProperty(
        "message",
        "A post with that title has already been created"
      );
    });
  });

  describe("Verify post tag ids", () => {
    it("Should return an error object if at least one of the provided post tag ids is unknown", async () => {
      const post = { ...mocks.argsWithNoImage, tags: mocks.tags };
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValue({ rows: [] });
      mocked.mockImplementationOnce(() => null);

      const result = await draftPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(getPostTags).toHaveBeenCalledTimes(1);
      expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
      expect(getPostTags).toHaveReturnedWith(null);
      expect(result).toHaveProperty("message", "Unknown post tag id provided");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Draft a new post", () => {
    const author = { name: "Author Name", image: "/author/image/path" };
    const spyData = [{ isRegistered: true, ...author }];

    it("Should save a new post with an image banner and post tags as draft", async () => {
      const post = { ...mocks.argsWithImage, tags: mocks.tags };
      const spy = spyDb({ rows: spyData });
      spy.mockReturnValueOnce({ rows: [] });
      spy.mockReturnValueOnce({ rows: [mocks.dbData] });
      spy.mockReturnValueOnce({ rows: [] });

      const result = await draftPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveNthReturnedWith(1, { rows: spyData });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(spy).toHaveNthReturnedWith(3, { rows: [mocks.dbData] });
      expect(spy).toHaveNthReturnedWith(4, { rows: [] });
      expect(getPostTags).toHaveBeenCalledTimes(1);
      expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
      expect(getPostTags).toHaveReturnedWith(mocks.mockPostTagsData);
      expect(result).toHaveProperty("post.id", mocks.dbData.postId);
      expect(result).toHaveProperty("post.title", post.title);
      expect(result).toHaveProperty("post.description", undefined);
      expect(result).toHaveProperty("post.content", post.content);
      expect(result).toHaveProperty("post.author", author);
      expect(result).toHaveProperty("post.status", "Draft");
      expect(result).toHaveProperty("post.slug", "blog-post-title");
      expect(result).toHaveProperty("post.imageBanner", mocks.imageBanner);
      expect(result).toHaveProperty("post.dateCreated", mocks.dateCreated);
      expect(result).toHaveProperty("post.datePublished", null);
      expect(result).toHaveProperty("post.lastModified", null);
      expect(result).toHaveProperty("post.views", 0);
      expect(result).toHaveProperty("post.isInBin", false);
      expect(result).toHaveProperty("post.isDeleted", false);
      expect(result).toHaveProperty("post.tags", mocks.mockPostTagsData);
      expect(result).toHaveProperty("status", "SUCCESS");

      expect(result).toHaveProperty(
        "post.url",
        `${urls.siteUrl}/blog/blog-post-title`
      );
    });

    it("Should save a new post with an image banner and post tags as draft", async () => {
      const post = mocks.argsWithNoImage;
      const spy = spyDb({ rows: spyData });
      spy.mockReturnValueOnce({ rows: [] });
      spy.mockReturnValueOnce({ rows: [mocks.dbData] });

      const result = await draftPost({}, { post }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: spyData });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(spy).toHaveNthReturnedWith(3, { rows: [mocks.dbData] });
      expect(getPostTags).not.toHaveBeenCalled();
      expect(result).toHaveProperty("post.id", mocks.dbData.postId);
      expect(result).toHaveProperty("post.title", post.title);
      expect(result).toHaveProperty("post.description", undefined);
      expect(result).toHaveProperty("post.content", undefined);
      expect(result).toHaveProperty("post.author", author);
      expect(result).toHaveProperty("post.status", "Draft");
      expect(result).toHaveProperty("post.slug", "another-blog-post-title");
      expect(result).toHaveProperty("post.imageBanner", null);
      expect(result).toHaveProperty("post.dateCreated", mocks.dateCreated);
      expect(result).toHaveProperty("post.datePublished", null);
      expect(result).toHaveProperty("post.lastModified", null);
      expect(result).toHaveProperty("post.views", 0);
      expect(result).toHaveProperty("post.isInBin", false);
      expect(result).toHaveProperty("post.isDeleted", false);
      expect(result).toHaveProperty("post.tags", null);
      expect(result).toHaveProperty("status", "SUCCESS");

      expect(result).toHaveProperty(
        "post.url",
        `${urls.siteUrl}/blog/another-blog-post-title`
      );
    });
  });
});
