import { describe, test, expect, beforeEach, jest } from "@jest/globals";

import editPost from "..";

import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import deleteSession from "@utils/deleteSession";
import * as mocks from "../utils/editPost.testUtils";
import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

jest.mock("@lib/supabase/supabaseEvent");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true).mockName("supabaseEvent.emit");

describe("Test editPost resolver", () => {
  beforeEach(() => {
    mockContext.user = "mocked_user_id";
  });

  describe("Verify user authentication", () => {
    test("Returns error on logged out user", async () => {
      mockContext.user = null;

      const data = await editPost({}, { post: mocks.post }, mockContext, info);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty("message", "Unable to edit post");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    test.each(mocks.validations())("%s", async (_, mockPost, errors) => {
      const data = await editPost({}, { post: mockPost }, mockContext, info);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data).toHaveProperty("idError", errors.idError);
      expect(data).toHaveProperty("titleError", errors.titleError);
      expect(data).toHaveProperty("descriptionError", errors.descriptionError);
      expect(data).toHaveProperty("excerptError", errors.excerptError);
      expect(data).toHaveProperty("contentError", errors.contentError);
      expect(data).toHaveProperty("tagIdsError", errors.tagIdsError);
      expect(data).toHaveProperty("imageBannerError", errors.imageBannerError);
      expect(data).toHaveProperty("editStatusError", errors.editStatusError);
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    test.each(mocks.verifyUser)("%s", async (_, mock) => {
      spyDb({ rows: mock });

      const post = { ...mocks.post, imageBanner: mocks.imageBanner };
      const data = await editPost({}, { post }, mockContext, info);

      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty("message", "Unable to edit post");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify post id", () => {
    test("Post id does not exist, Expect an error response", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [] }).mockReturnValueOnce({ rows: [] });

      const post = { ...mocks.post, imageBanner: mocks.imageBanner };
      const data = await editPost({}, { post }, mockContext, info);

      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty("status", "ERROR");
      expect(data).toHaveProperty("message", "Unable to edit post");
    });
  });

  describe("Validate input for non Draft posts", () => {
    test.each(mocks.metadata)("%s", async (_, post, postStatus, errors) => {
      const spy = spyDb({ rows: [mocks.user] });
      spy.mockReturnValueOnce({ rows: [{ postStatus }] });
      spy.mockReturnValueOnce({ rows: [] });

      const data = await editPost({}, { post }, mockContext, info);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data).toHaveProperty("excerptError", errors.excerptError);
      expect(data).toHaveProperty("contentError", errors.contentError);
      expect(data).toHaveProperty("descriptionError", errors.descriptionError);
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify post title and post url slug", () => {
    test.each(mocks.verifyTitleSlug)("%s", async (_, msg, mock) => {
      const spy = spyDb({ rows: [mocks.user] });
      spy.mockReturnValueOnce({ rows: [{ postStatus: "Draft" }] });
      spy.mockReturnValueOnce({ rows: [mock] });

      const data = await editPost({}, { post: mocks.post }, mockContext, info);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: [mocks.user] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [{ postStatus: "Draft" }] });
      expect(spy).toHaveNthReturnedWith(3, { rows: [mock] });
      expect(data).toHaveProperty("message", msg);
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Edit post", () => {
    test("Should edit a blog post with post tags and an image banner", async () => {
      const spy = spyDb({ rows: [mocks.user] });
      spy.mockReturnValueOnce({ rows: [mocks.mockPost] });
      spy.mockReturnValueOnce({ rows: [] });
      spy.mockReturnValueOnce({ rows: [mocks.mock1] });

      const data = await editPost({}, { post: mocks.post1 }, mockContext, info);

      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(data).toHaveProperty("post.id", mocks.post1.id);
      expect(data).toHaveProperty("post.title", mocks.post1.title);
      expect(data).toHaveProperty("post.description", mocks.post1.description);
      expect(data).toHaveProperty("post.excerpt", mocks.post1.excerpt);
      expect(data).toHaveProperty("post.content", mocks.html);
      expect(data).toHaveProperty("post.url", mocks.url);
      expect(data).toHaveProperty("post.author", mocks.author);
      expect(data).toHaveProperty("post.status", "Published");
      expect(data).toHaveProperty("post.imageBanner", mocks.post1.imageBanner);
      expect(data).toHaveProperty("post.dateCreated", mocks.mock1.dateCreated);
      expect(data).toHaveProperty("post.views", mocks.mock1.views);
      expect(data).toHaveProperty("post.isInBin", false);
      expect(data).toHaveProperty("post.isDeleted", false);
      expect(data).toHaveProperty("post.tags", mocks.mock1.tags);
      expect(data).toHaveProperty("status", "SUCCESS");

      expect(data).toHaveProperty(
        "post.datePublished",
        mocks.mock1.datePublished
      );

      expect(data).toHaveProperty(
        "post.lastModified",
        mocks.mock1.lastModified
      );
    });

    test("Should edit a blog post with no post tags and no image banner", async () => {
      const spy = spyDb({ rows: [mocks.user] });
      spy.mockReturnValueOnce({ rows: [{ postStatus: "Published" }] });
      spy.mockReturnValueOnce({ rows: [] });
      spy.mockReturnValueOnce({ rows: [mocks.mock2] });

      const data = await editPost({}, { post: mocks.post2 }, mockContext, info);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data).toHaveProperty("post.id", mocks.post.id);
      expect(data).toHaveProperty("post.title", mocks.post.title);
      expect(data).toHaveProperty("post.description", mocks.post.description);
      expect(data).toHaveProperty("post.excerpt", mocks.post.excerpt);
      expect(data).toHaveProperty("post.content", mocks.html);
      expect(data).toHaveProperty("post.url", mocks.url);
      expect(data).toHaveProperty("post.author", mocks.author);
      expect(data).toHaveProperty("post.status", "Published");
      expect(data).toHaveProperty("post.imageBanner", mocks.post.imageBanner);
      expect(data).toHaveProperty("post.dateCreated", mocks.mock2.dateCreated);
      expect(data).toHaveProperty("post.views", mocks.mock2.views);
      expect(data).toHaveProperty("post.isInBin", false);
      expect(data).toHaveProperty("post.isDeleted", false);
      expect(data).toHaveProperty("post.tags", mocks.mock2.tags);
      expect(data).toHaveProperty("status", "SUCCESS");

      expect(data).toHaveProperty(
        "post.datePublished",
        mocks.mock2.datePublished
      );

      expect(data).toHaveProperty(
        "post.lastModified",
        mocks.mock2.lastModified
      );
    });
  });
});
