import { describe, test, expect, beforeEach, jest } from "@jest/globals";

import editPost from "..";
import getPostTags from "@features/posts/utils/getPostTags";

import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";
import {
  type MockPostTags,
  userId,
  post,
  mockPostTags1,
  validationsTable,
  name,
  postInfo,
  UUID,
  dbPost,
  postFields,
  mockPostTags2,
  returnPost1,
  returnPost2,
} from "../editPost.testUtils";

type MockType = jest.MockedFunction<() => MockPostTags | null>;

jest.mock("@features/posts/utils/getPostTags", () => {
  return jest.fn().mockName("getPostTags");
});

describe("Test editPost resolver", () => {
  const mocked = getPostTags as unknown as MockType;
  mocked.mockReturnValue(mockPostTags1);

  beforeEach(() => {
    mocked.mockClear();
    mockContext.user = userId;
  });

  test("Returns error on logged out user", async () => {
    mockContext.user = null;

    const result = await editPost({}, { post }, mockContext, info);

    expect(getPostTags).not.toHaveBeenCalled();
    expect(result).toHaveProperty("message", "Unable to edit post");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each(validationsTable())(
    "Returns error for %s",
    async (_, mockPost, expected) => {
      const { descriptionError } = expected;

      const result = await editPost({}, { post: mockPost }, mockContext, info);

      expect(getPostTags).not.toHaveBeenCalled();
      expect(result).toHaveProperty("postIdError", expected.postIdError);
      expect(result).toHaveProperty("titleError", expected.titleError);
      expect(result).toHaveProperty("descriptionError", descriptionError);
      expect(result).toHaveProperty("contentError", expected.contentError);
      expect(result).toHaveProperty("tagsError", expected.tagsError);
      expect(result).toHaveProperty("slugError", expected.slugError);
      expect(result).toHaveProperty("status", "ERROR");
    }
  );

  test.each([
    ["one or more unknown post tag ids", [{ id: "1", name: "tag1" }]],
    ["unknown post tag id(s)", null],
  ])("Returns error for %s if tags input is provided", async (_, expected) => {
    mocked.mockReturnValueOnce(expected);

    const data = await editPost({}, { post }, mockContext, info);

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(expected);

    expect(data).toHaveProperty("message", "Unknown post tag id provided");
    expect(data).toHaveProperty("status", "ERROR");
  });

  test.each([
    ["unknown user", [], "Unable to edit post"],
    ["unregistered user", [{ isRegistered: false }], "Unable to edit post"],
    [
      "unknown post id",
      [{ isRegistered: true }],
      "We could not find the post you are trying to edit",
    ],
  ])("Returns error for %s", async (_, dbResult, message) => {
    const spy = spyDb({ rows: dbResult });
    spy.mockReturnValue({ rows: [] });

    const data = await editPost({}, { post }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: dbResult });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTags1);

    expect(data).toHaveProperty("message", message);
    expect(data).toHaveProperty("status", "ERROR");
  });

  test.each([
    [
      "logged in user is not the post author",
      { authorId: "not_author_id" },
      "Unable to edit another author's post",
    ],
    [
      "post is not 'Published' and 'Unpublished'",
      { authorId: userId, postStatus: "Draft" },
      "Can only edit published or unpublished posts",
    ],
  ])("Returns error if %s", async (_, dbResult, errorMsg) => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [dbResult] });
    spy.mockReturnValueOnce({ rows: [] });

    const data = await editPost({}, { post }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [dbResult] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTags1);

    expect(data).toHaveProperty("message", errorMsg);
    expect(data).toHaveProperty("status", "ERROR");
  });

  test("Returns error if post title is used on another post in db", async () => {
    const postStatus = "Published";
    const spyData1 = [{ authorId: userId, postStatus, authorName: name }];
    const spyData2 = [{ postId: "id_of_another_post" }];
    const message = "A post has already been created with that title";

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: spyData1 });
    spy.mockReturnValueOnce({ rows: spyData2 });

    const data = await editPost({}, { post }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: spyData1 });
    expect(spy).toHaveNthReturnedWith(3, { rows: spyData2 });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
    expect(getPostTags).toHaveReturnedWith(mockPostTags1);

    expect(data).toHaveProperty("message", message);
    expect(data).toHaveProperty("status", "ERROR");
  });

  test("Should edit post with saved tags & slug in db", async () => {
    const { foundTags } = postInfo;

    mocked.mockReturnValueOnce(mockPostTags2);

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [postInfo] });
    spy.mockReturnValueOnce({ rows: [{ postId: UUID }] });
    spy.mockReturnValueOnce({ rows: [dbPost] });

    const result = await editPost({}, { post: postFields }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [postInfo] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [{ postId: UUID }] });
    expect(spy).toHaveNthReturnedWith(4, { rows: [dbPost] });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, foundTags);
    expect(getPostTags).toHaveReturnedWith(mockPostTags2);

    expect(result).toHaveProperty("post", returnPost1);
    expect(result).toHaveProperty("status", "SUCCESS");
  });

  test.each([
    ["published", "new", "Published", []],
    ["published", "same", "Published", [{ postId: UUID }]],
    ["unpublished", "new", "Unpublished", []],
    ["unpublished", "same", "Unpublished", [{ postId: UUID }]],
  ])(
    "Should edit %s post with %s title",
    async (_, __, postStatus, titleData) => {
      const data = { ...returnPost2, status: postStatus };
      const spyData = [{ authorName: name, authorId: userId, postStatus }];

      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: spyData });
      spy.mockReturnValueOnce({ rows: titleData });
      spy.mockReturnValueOnce({ rows: [dbPost] });

      const result = await editPost({}, { post }, mockContext, info);

      expect(getPostTags).toHaveBeenCalledTimes(1);
      expect(getPostTags).toHaveBeenCalledWith(mockContext.db, post.tags);
      expect(getPostTags).toHaveReturnedWith(mockPostTags1);

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: spyData });
      expect(spy).toHaveNthReturnedWith(3, { rows: titleData });
      expect(spy).toHaveNthReturnedWith(4, { rows: [dbPost] });

      expect(result).toHaveProperty("post", data);
      expect(result).toHaveProperty("status", "SUCCESS");
    }
  );
});
