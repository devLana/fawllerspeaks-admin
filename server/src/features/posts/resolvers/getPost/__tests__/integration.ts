import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, test, jest } from "@jest/globals";

import getPost from "..";
import getPostTags from "@features/posts/utils/getPostTags";

import { urls } from "@utils/ClientUrls";
import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";

type PostTags = { id: string; name: string }[];
type MockType = jest.MockedFunction<() => PostTags | null>;

const postId = randomUUID();
const dateCreated = "2021-05-17 13:22:43.717+01";
const returnDateCreated = "2021-05-17T12:22:43.717Z";
const data = {
  title: "post title",
  description: "post description",
  content: "post content",
  author: "Author Name",
  slug: "post slug",
  status: "Unpublished",
  imageBanner: null,
  dateCreated,
  datePublished: null,
  lastModified: null,
  views: 10,
  likes: 0,
  isInBin: false,
  isDeleted: false,
};
const mockPostTags = [
  { id: "1", name: "tag1" },
  { id: "2", name: "tag2" },
  { id: "3", name: "tag3" },
];

jest.mock("@features/posts/utils/getPostTags", () => {
  return jest.fn().mockName("getPostTags");
});

const mocked = getPostTags as unknown as MockType;
mocked.mockReturnValue(mockPostTags);

beforeEach(() => {
  mockContext.user = "mock_user_id";
});

describe("Test get post resolver", () => {
  test("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await getPost({}, { postId: "" }, mockContext, info);

    expect(getPostTags).not.toHaveBeenCalled();
    expect(result).toHaveProperty("message", "Unable to retrieve post");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each([
    ["empty post id", "", "Provide post id"],
    ["empty whitespace post id", "   ", "Provide post id"],
    ["invalid post id", "post id", "Invalid post id provided"],
  ])("Returns error for %s", async (_, id, expected) => {
    const result = await getPost({}, { postId: id }, mockContext, info);

    expect(getPostTags).not.toHaveBeenCalled();
    expect(result).toHaveProperty("postIdError", expected);
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each([
    ["unknown", { rows: [] }],
    ["unregistered", { rows: [{ isRegistered: false }] }],
  ])("Returns error for %s user", async (_, expected) => {
    const spy = spyDb(expected).mockReturnValueOnce({ rows: [] });

    const result = await getPost({}, { postId }, mockContext, info);

    expect(getPostTags).not.toHaveBeenCalled();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, expected);
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });

    expect(result).toHaveProperty("message", "Unable to retrieve post");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Should return error for unknown post id", async () => {
    const message = "Unable to retrieve a post with that id";
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [] });

    const result = await getPost({}, { postId }, mockContext, info);

    expect(getPostTags).not.toHaveBeenCalled();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });

    expect(result).toHaveProperty("message", message);
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Should find a post with the given post id", async () => {
    const tags = ["1", "2", "3"];
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [{ ...data, tags }] });

    const result = await getPost({}, { postId }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [{ ...data, tags }] });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTags);

    expect(result).toHaveProperty("post.id", postId);
    expect(result).toHaveProperty("post.title", data.title);
    expect(result).toHaveProperty("post.description", data.description);
    expect(result).toHaveProperty("post.content", data.content);
    expect(result).toHaveProperty("post.author", data.author);
    expect(result).toHaveProperty("post.status", data.status);
    expect(result).toHaveProperty("post.slug", data.slug);
    expect(result).toHaveProperty("post.url", `${urls.siteUrl}/blog/post-slug`);
    expect(result).toHaveProperty("post.imageBanner", data.imageBanner);
    expect(result).toHaveProperty("post.dateCreated", returnDateCreated);
    expect(result).toHaveProperty("post.datePublished", data.datePublished);
    expect(result).toHaveProperty("post.lastModified", data.lastModified);
    expect(result).toHaveProperty("post.views", data.views);
    expect(result).toHaveProperty("post.likes", data.likes);
    expect(result).toHaveProperty("post.isInBin", data.isInBin);
    expect(result).toHaveProperty("post.isDeleted", data.isDeleted);
    expect(result).toHaveProperty("post.tags", mockPostTags);
    expect(result).toHaveProperty("status", "SUCCESS");
  });
});
