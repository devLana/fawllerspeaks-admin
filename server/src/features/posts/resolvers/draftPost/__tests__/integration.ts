/* eslint-disable @typescript-eslint/consistent-type-imports */
import { randomUUID } from "node:crypto";

import { describe, test, expect, beforeEach, jest } from "@jest/globals";

import draftPost from "..";
import { urls } from "@utils";
import { getPostTags } from "@features/posts/utils";

import { info, mockContext, spyDb } from "@tests";
import {
  type Tags,
  userId,
  post,
  testPost,
  draftResult,
  mockPostTagsData,
  validationTestsTable,
  UUID,
  dbData,
} from "../draftPost.testUtils";

type Module = typeof import("@features/posts/utils");
type MockType = jest.MockedFunction<() => Tags | null>;

jest.mock("@features/posts/utils", () => {
  const actualModule = jest.requireActual<Module>("@features/posts/utils");
  return { __esModule: true, ...actualModule, getPostTags: jest.fn() };
});

describe("Test draft post resolver", () => {
  const mocked = getPostTags as unknown as MockType;
  mocked.mockReturnValue(mockPostTagsData);

  beforeEach(() => {
    mocked.mockClear();
    mockContext.user = userId;
  });

  test("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await draftPost({}, { post }, mockContext, info);

    expect(getPostTags).not.toHaveBeenCalled();

    expect(result).toHaveProperty("message", "Unable to save post to draft");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each(validationTestsTable())(
    "Returns error for %s",
    async (_, mockPost, errors) => {
      const { descriptionError } = errors;
      const result = await draftPost({}, { post: mockPost }, mockContext, info);

      expect(getPostTags).not.toHaveBeenCalled();

      expect(result).toHaveProperty("postIdError", errors.postIdError);
      expect(result).toHaveProperty("titleError", errors.titleError);
      expect(result).toHaveProperty("descriptionError", descriptionError);
      expect(result).toHaveProperty("contentError", errors.contentError);
      expect(result).toHaveProperty("tagsError", errors.tagsError);
      expect(result).toHaveProperty("slugError", errors.slugError);
      expect(result).toHaveProperty("status", "ERROR");
    }
  );

  test.each([
    ["unknown", []],
    ["unregistered", [{ isRegistered: false }]],
  ])("Returns error for %s user", async (_, data) => {
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

  test.each([
    ["all provided post tag ids are", null],
    [
      "at least one post tag id is",
      [{ id: post.tags[0] }, { id: post.tags[1] }],
    ],
  ])("Should return error if %s unknown", async (_, data) => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValue({ rows: [] });

    mocked.mockImplementationOnce(() => data);

    const result = await draftPost({}, { post }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(data);

    expect(result).toHaveProperty("message", "Unknown post tag id provided");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Should return error if unknown post id is provided", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: [] });

    const result = await draftPost({}, { post: testPost }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTagsData);

    expect(result).toHaveProperty("message", "Unknown post id provided");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Returns error if user tries to update another author's draft", async () => {
    const author = randomUUID();
    const spyData = [{ status: "Draft", author }];
    const message = "Cannot update another author's draft post";

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: spyData });

    const result = await draftPost({}, { post: testPost }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: spyData });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTagsData);

    expect(result).toHaveProperty("message", message);
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Should return error if post id is provided for non 'draft' post", async () => {
    const spyData = [{ status: "Unpublished", author: userId }];

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: spyData });

    const result = await draftPost({}, { post: testPost }, mockContext, info);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: spyData });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTagsData);

    expect(result).toHaveProperty("message", "Can only update a draft post");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Returns error if post id is provided and post title already exists", async () => {
    const message = "A post with that title has already been created";
    const spyData = [{ status: "Draft", author: userId }];

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [{ postId: "postId" }] });
    spy.mockReturnValueOnce({ rows: spyData });

    const result = await draftPost({}, { post: testPost }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [{ postId: "postId" }] });
    expect(spy).toHaveNthReturnedWith(3, { rows: spyData });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTagsData);

    expect(result).toHaveProperty("message", message);
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Should update drafted post", async () => {
    const name = "Ade Lana";
    const spyData1 = [{ isRegistered: true, name }];
    const spyData2 = [{ status: "Draft", author: userId }];

    const spy = spyDb({ rows: spyData1 });
    spy.mockReturnValueOnce({ rows: [{ postId: UUID }] });
    spy.mockReturnValueOnce({ rows: spyData2 });
    spy.mockReturnValueOnce({ rows: [dbData] });

    const result = await draftPost({}, { post: testPost }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, { rows: spyData1 });
    expect(spy).toHaveNthReturnedWith(2, { rows: [{ postId: UUID }] });
    expect(spy).toHaveNthReturnedWith(3, { rows: spyData2 });
    expect(spy).toHaveNthReturnedWith(4, { rows: [dbData] });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTagsData);

    expect(result).toHaveProperty("post", { ...draftResult, author: name });
    expect(result).toHaveProperty("status", "SUCCESS");
  });

  test("Updates draft post with previously saved details", async () => {
    const name = "Ade Lana";
    const spyData = [{ isRegistered: true, name }];
    const tags = [randomUUID()];
    const testPost1 = { postId: UUID, title: "Post Title" };
    const postUrl = `${urls.siteUrl}/blog/post-title`;

    const postDetails = {
      author: userId,
      description: null,
      content: "content",
      status: "Draft",
      tags,
      slug: null,
    };

    const spy = spyDb({ rows: spyData });
    spy.mockReturnValueOnce({ rows: [{ postId: UUID }] });
    spy.mockReturnValueOnce({ rows: [postDetails] });
    spy.mockReturnValueOnce({ rows: [dbData] });

    mocked.mockImplementationOnce(() => [{ id: tags[0] }]);

    const result = await draftPost({}, { post: testPost1 }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, { rows: spyData });
    expect(spy).toHaveNthReturnedWith(2, { rows: [{ postId: UUID }] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [postDetails] });
    expect(spy).toHaveNthReturnedWith(4, { rows: [dbData] });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, tags);
    expect(getPostTags).toHaveReturnedWith([{ id: tags[0] }]);

    expect(result).toHaveProperty("post.description", null);
    expect(result).toHaveProperty("post.content", "content");
    expect(result).toHaveProperty("post.tags", [{ id: tags[0] }]);
    expect(result).toHaveProperty("post.url", postUrl);
    expect(result).toHaveProperty("post.slug", null);
    expect(result).toHaveProperty("status", "SUCCESS");
  });

  test("Should return error for new draft if post title already exists", async () => {
    const message = "A post with that title has already been created";

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [{}] });

    const result = await draftPost({}, { post }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [{}] });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTagsData);

    expect(result).toHaveProperty("message", message);
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Should save post as new draft", async () => {
    const name = "John Doe";
    const spyData = [{ isRegistered: true, name }];

    const spy = spyDb({ rows: spyData });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: [dbData] });

    const result = await draftPost({}, { post }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: spyData });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [dbData] });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTagsData);

    expect(result).toHaveProperty("post", { ...draftResult, author: name });
    expect(result).toHaveProperty("status", "SUCCESS");
  });
});
