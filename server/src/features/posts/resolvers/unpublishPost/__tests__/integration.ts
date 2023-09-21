/* eslint-disable @typescript-eslint/consistent-type-imports */
import { beforeEach, describe, expect, test, jest } from "@jest/globals";

import unpublishPost from "..";
import {
  type MockPostTags,
  UUID,
  data,
  mockPostTags,
  post,
  returnData,
  mockTags,
  testsTable1,
  testsTable2,
  testsTable3,
  userId,
} from "../unpublishPost.testUtils";
import { getPostTags } from "@features/posts/utils";

import { info, mockContext, spyDb } from "@tests";

type Module = typeof import("@features/posts/utils");
type MockType = jest.MockedFunction<() => MockPostTags | null>;

jest.mock("@features/posts/utils", () => {
  const actualModule = jest.requireActual<Module>("@features/posts/utils");
  return { __esModule: true, ...actualModule, getPostTags: jest.fn() };
});

beforeEach(() => {
  mockContext.user = userId;
});

describe("Test unpublish post resolver", () => {
  test("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await unpublishPost({}, { postId: "" }, mockContext, info);

    expect(getPostTags).not.toHaveBeenCalled();
    expect(result).toHaveProperty("message", "Unable to unpublish post");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each(testsTable1)(
    "Returns error for %s post id",
    async (_, postId, expected) => {
      const result = await unpublishPost({}, { postId }, mockContext, info);

      expect(getPostTags).not.toHaveBeenCalled();
      expect(result).toHaveProperty("postIdError", expected);
      expect(result).toHaveProperty("status", "ERROR");
    }
  );

  test.each(testsTable2)("Returns error for %s", async (_, expected) => {
    const spy = spyDb(expected).mockReturnValueOnce({ rows: [] });

    const result = await unpublishPost({}, { postId: UUID }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, expected);
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });

    expect(getPostTags).not.toHaveBeenCalled();

    expect(result).toHaveProperty("message", "Unable to unpublish post");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each(testsTable3)("Returns an error if %s", async (_, mockData, msg) => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [mockData] });

    const result = await unpublishPost({}, { postId: UUID }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [mockData] });

    expect(getPostTags).not.toHaveBeenCalled();

    expect(result).toHaveProperty("message", msg);
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Should unpublish a published post", async () => {
    const mocked = getPostTags as unknown as MockType;
    mocked.mockReturnValue(mockPostTags);
    const spyData = [{ ...data, slug: "SL.UG", tags: mockTags }];
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [post] });
    spy.mockReturnValueOnce({ rows: spyData });

    const result = await unpublishPost({}, { postId: UUID }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [post] });
    expect(spy).toHaveNthReturnedWith(3, { rows: spyData });

    expect(getPostTags).toHaveBeenCalledTimes(1);
    expect(getPostTags).toHaveBeenCalledWith(mockContext.db, mockTags);
    expect(getPostTags).toHaveReturnedWith(mockPostTags);

    expect(result).toHaveProperty("post", returnData);
    expect(result).toHaveProperty("status", "SUCCESS");
  });
});
