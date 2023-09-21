/* eslint-disable @typescript-eslint/consistent-type-imports */
import { beforeEach, describe, expect, test, jest } from "@jest/globals";

import publishPost from "..";
import { getPostTags } from "@features/posts/utils";

import { urls } from "@utils";
import { info, mockContext, spyDb } from "@tests";
import {
  type PostTags,
  mockPostTags,
  userId,
  testsTable1,
  UUID,
  testsTable2,
  testsTable3,
  post,
  data,
  tags,
  returnDateCreated,
  returnDatePublished,
} from "../publishPost.testUtils";

type MockType = jest.MockedFunction<() => PostTags | null>;
type Module = typeof import("@features/posts/utils");

jest.mock("@features/posts/utils", () => {
  const actualModule = jest.requireActual<Module>("@features/posts/utils");
  return { __esModule: true, ...actualModule, getPostTags: jest.fn() };
});

const mocked = getPostTags as unknown as MockType;
mocked.mockReturnValue(mockPostTags);

beforeEach(() => {
  mockContext.user = userId;
});

describe("Test publish post resolver", () => {
  test("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await publishPost({}, { postId: "" }, mockContext, info);

    expect(getPostTags).not.toHaveBeenCalled();
    expect(result).toHaveProperty("message", "Unable to publish post");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each(testsTable1)(
    "Returns error for %s post id",
    async (_, postId, expected) => {
      const result = await publishPost({}, { postId }, mockContext, info);

      expect(getPostTags).not.toHaveBeenCalled();
      expect(result).toHaveProperty("postIdError", expected);
      expect(result).toHaveProperty("status", "ERROR");
    }
  );

  test.each(testsTable2)("Returns error for %s", async (_, expected) => {
    const spy = spyDb(expected).mockReturnValueOnce({ rows: [] });

    const result = await publishPost({}, { postId: UUID }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, expected);
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });

    expect(getPostTags).not.toHaveBeenCalled();

    expect(result).toHaveProperty("message", "Unable to publish post");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each(testsTable3)(
    "Should return error if %s",
    async (_, mockData, errorMsg) => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mockData] });

      const result = await publishPost({}, { postId: UUID }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [mockData] });

      expect(getPostTags).not.toHaveBeenCalled();

      expect(result).toHaveProperty("message", errorMsg);
      expect(result).toHaveProperty("status", "ERROR");
    }
  );

  test("Should publish an unpublished post", async () => {
    const spyData = [{ ...data, slug: "SL_UG", tags }];
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [post] });
    spy.mockReturnValueOnce({ rows: spyData });

    const result = await publishPost({}, { postId: UUID }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [post] });
    expect(spy).toHaveNthReturnedWith(3, { rows: spyData });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTags);

    expect(result).toHaveProperty("post.id", UUID);
    expect(result).toHaveProperty("post.title", "title");
    expect(result).toHaveProperty("post.description", "description");
    expect(result).toHaveProperty("post.content", "content");
    expect(result).toHaveProperty("post.author", post.authorName);
    expect(result).toHaveProperty("post.status", "Published");
    expect(result).toHaveProperty("post.url", `${urls.siteUrl}/blog/sl-ug`);
    expect(result).toHaveProperty("post.slug", "SL_UG");
    expect(result).toHaveProperty("post.imageBanner", null);
    expect(result).toHaveProperty("post.dateCreated", returnDateCreated);
    expect(result).toHaveProperty("post.datePublished", returnDatePublished);
    expect(result).toHaveProperty("post.lastModified", null);
    expect(result).toHaveProperty("post.views", 10);
    expect(result).toHaveProperty("post.likes", 11);
    expect(result).toHaveProperty("post.isInBin", false);
    expect(result).toHaveProperty("post.isDeleted", false);
    expect(result).toHaveProperty("post.tags", mockPostTags);
    expect(result).toHaveProperty("status", "SUCCESS");
  });
});
