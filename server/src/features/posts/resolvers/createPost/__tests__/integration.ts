/* eslint-disable @typescript-eslint/consistent-type-imports */
import { randomUUID } from "node:crypto";

import { describe, test, expect, beforeEach, jest } from "@jest/globals";

import createPost from "..";
import { getPostTags } from "@features/posts/utils";
import { validationTestsTable, dbPost, returnDateCreated } from "../testsData";

import { urls } from "@utils";
import { info, mockContext, spyDb } from "@tests";

type MockType<U extends string[]> = jest.MockedFunction<() => U | null>;
type Module = typeof import("@features/posts/utils");

const tagId = randomUUID();
const post = {
  title: "post title",
  description: "post description",
  content: "post content",
  tags: [tagId, randomUUID(), randomUUID()],
  slug: "post/slug",
};

jest.mock("@features/posts/utils", () => {
  const actualModule = jest.requireActual<Module>("@features/posts/utils");
  return { __esModule: true, ...actualModule, getPostTags: jest.fn() };
});

beforeEach(() => {
  mockContext.user = "mocked_user_id";
});

describe("Test createPost resolver", () => {
  test("Returns error on logged out user", async () => {
    mockContext.user = null;

    const result = await createPost({}, { post }, mockContext, info);

    expect(result).toHaveProperty("message", "Unable to create post");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each(validationTestsTable())(
    "Returns error for %s",
    async (_, mockPost, errors) => {
      const result = await createPost(
        {},
        { post: mockPost },
        mockContext,
        info
      );

      expect(getPostTags).not.toHaveBeenCalled();

      expect(result).toHaveProperty("titleError", errors.titleError);
      expect(result).toHaveProperty(
        "descriptionError",
        errors.descriptionError
      );
      expect(result).toHaveProperty("contentError", errors.contentError);
      expect(result).toHaveProperty("tagsError", errors.tagsError);
      expect(result).toHaveProperty("slugError", errors.slugError);
      expect(result).toHaveProperty("status", "ERROR");
    }
  );

  test.each([
    ["one or more unknown post tag ids", ["tag"] as ["tag"]],
    ["unknown post tag id(s)", null],
  ])("Returns error for %s", async (_, expected) => {
    const mocked = getPostTags as unknown as MockType<["tag"]>;
    mocked.mockImplementationOnce(() => expected);

    const data = await createPost({}, { post }, mockContext, info);

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(expected);

    expect(data).toHaveProperty("message", "Unknown post tag id provided");
    expect(data).toHaveProperty("status", "ERROR");
  });

  test.each([
    ["unknown", []],
    ["unregistered", [{ isRegistered: false }]],
  ])("Returns error for %s user", async (_, data) => {
    const mocked = getPostTags as unknown as MockType<["tag", "tag", "tag"]>;
    mocked.mockImplementationOnce(() => ["tag", "tag", "tag"]);

    const spy = spyDb({ rows: data });
    spy.mockReturnValueOnce({ rows: [] });

    const result = await createPost({}, { post }, mockContext, info);

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(["tag", "tag", "tag"]);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: data });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });

    expect(result).toHaveProperty("message", "Unable to create post");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Should return error if post title already exists", async () => {
    const mocked = getPostTags as unknown as MockType<["tag", "tag", "tag"]>;
    mocked.mockImplementationOnce(() => ["tag", "tag", "tag"]);

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [{}] });

    const data = await createPost({}, { post }, mockContext, info);

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(["tag", "tag", "tag"]);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [{}] });

    expect(data).toHaveProperty(
      "message",
      "A post with that title has already been created"
    );
    expect(data).toHaveProperty("status", "ERROR");
  });

  test("Creates a new post", async () => {
    const name = "Author Name";

    const mocked = getPostTags as unknown as MockType<["tag", "tag", "tag"]>;
    mocked.mockImplementationOnce(() => ["tag", "tag", "tag"]);

    const spy = spyDb({ rows: [{ isRegistered: true, name }] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: [dbPost] });

    const result = await createPost({}, { post }, mockContext, info);

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(["tag", "tag", "tag"]);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, {
      rows: [{ isRegistered: true, name }],
    });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [dbPost] });

    expect(result).toHaveProperty("post.id", "generated_post_id");
    expect(result).toHaveProperty("post.title", post.title);
    expect(result).toHaveProperty("post.description", post.description);
    expect(result).toHaveProperty("post.content", post.content);
    expect(result).toHaveProperty("post.author", name);
    expect(result).toHaveProperty("post.status", "Unpublished");
    expect(result).toHaveProperty("post.slug", post.slug);
    expect(result).toHaveProperty("post.url", `${urls.siteUrl}/blog/post-slug`);
    expect(result).toHaveProperty("post.imageBanner", null);
    expect(result).toHaveProperty("post.dateCreated", returnDateCreated);
    expect(result).toHaveProperty("post.datePublished", null);
    expect(result).toHaveProperty("post.lastModified", null);
    expect(result).toHaveProperty("post.views", 0);
    expect(result).toHaveProperty("post.likes", 0);
    expect(result).toHaveProperty("post.isInBin", false);
    expect(result).toHaveProperty("post.isDeleted", false);
    expect(result).toHaveProperty("post.tags", ["tag", "tag", "tag"]);
    expect(result).toHaveProperty("status", "SUCCESS");
  });
});
