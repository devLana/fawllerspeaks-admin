import { randomUUID } from "node:crypto";
import { Worker } from "node:worker_threads";

// import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";
import { describe, it, expect, jest, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

// import deletePostTagsWorker from "../deletePostTagsWorker";

import { db } from "@services/db";
import { startServer } from "@server";

import {
  post,
  DELETE_POST_TAGS,
  testUsers,
  loginTestUser,
  createTestPostTags,
} from "@tests";

import type { APIContext, TestData } from "@types";
import { type PostTag, Status } from "@resolverTypes";

type DeleteTags = TestData<{ deletePostTags: Record<string, unknown> }>;

// jest.mock("../deletePostTagsWorker");
jest.mock("node:worker_threads");

describe("Delete post tags - E2E", () => {
  const uuid = randomUUID();

  let server: ApolloServer<APIContext>, url: string;
  let registeredUserAccessToken: string, unRegisteredUserAccessToken: string;
  let postTags: PostTag[];

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(registeredUser.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);
    const createPostTags = createTestPostTags(db);

    [registeredUserAccessToken, unRegisteredUserAccessToken, postTags] =
      await Promise.all([registered, unRegistered, createPostTags]);
  });

  afterAll(async () => {
    const clearPostTags = db.query(`DELETE FROM post_tags`);
    const clearUsers = db.query(`DELETE FROM users`);
    const stop = server.stop();
    await Promise.all([clearPostTags, clearUsers, stop]);
    await db.end();
  });

  it("Should return error on logged out user", async () => {
    const payload = { query: DELETE_POST_TAGS, variables: { tagIds: [] } };

    const { data } = await post<DeleteTags>(url, payload);

    expect(Worker).not.toHaveBeenCalled();
    // expect(deletePostTagsWorker).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.deletePostTags).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to delete post tag",
      status: Status.Error,
    });
  });

  it.each([
    ["null input", null],
    ["undefined input", undefined],
    ["boolean input", true],
    ["array with invalid inputs", [false, 90, {}, []]],
  ])("Should throw graphql validation error for %s", async (_, tagIds) => {
    const payload = { query: DELETE_POST_TAGS, variables: { tagIds } };

    const { data } = await post<DeleteTags>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(Worker).not.toHaveBeenCalled();
    // expect(deletePostTagsWorker).not.toHaveBeenCalled();

    expect(data.errors).toBeDefined();
    expect(data.data).toBeUndefined();
  });

  it.each([
    [
      "array input that exceeds maximum limit of 10",
      [
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
      ],
      "Input tags can only contain at most 10 tags",
    ],
    ["empty input array", [], "No post tags were provided"],
    [
      "array of empty string and empty whitespace strings",
      ["", "   "],
      "Input tags cannot contain empty values",
    ],
    [
      "array of duplicate input strings",
      [randomUUID(), uuid, uuid],
      "Input tags can only contain unique tag ids",
    ],
    [
      "array input with invalid uuid post tags",
      ["id1", "id2"],
      "Invalid post tag id",
    ],
  ])("Returns error for %s", async (_, tagIds, errorMsg) => {
    const payload = { query: DELETE_POST_TAGS, variables: { tagIds } };

    const { data } = await post<DeleteTags>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(Worker).not.toHaveBeenCalled();
    // expect(deletePostTagsWorker).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.deletePostTags).toStrictEqual({
      __typename: "DeletePostTagsValidationError",
      tagIdsError: errorMsg,
      status: Status.Error,
    });
  });

  it("Should return error on unregistered user account", async () => {
    const payload = {
      query: DELETE_POST_TAGS,
      variables: { tagIds: [uuid, randomUUID()] },
    };

    const { data } = await post<DeleteTags>(url, payload, {
      authorization: `Bearer ${unRegisteredUserAccessToken}`,
    });

    expect(Worker).not.toHaveBeenCalled();
    // expect(deletePostTagsWorker).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.deletePostTags).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to delete post tags",
      status: Status.Error,
    });
  });

  it("Deletes all post tags provided in the input array", async () => {
    const [tag1, tag2] = postTags;

    const payload = {
      query: DELETE_POST_TAGS,
      variables: { tagIds: [tag1.id, tag2.id] },
    };

    const { data } = await post<DeleteTags>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.deletePostTags).toStrictEqual({
      __typename: "PostTags",
      tags: expect.arrayContaining([
        { __typename: "PostTag", ...tag1 },
        { __typename: "PostTag", ...tag2 },
      ]),
      status: Status.Success,
    });

    expect(Worker).toHaveBeenCalledTimes(1);
    // expect(deletePostTagsWorker).toHaveBeenCalledTimes(1);
  });

  it("Should return warning if at least one post tag could not be deleted", async () => {
    const [tag1, tag2, tag3, tag4] = postTags;

    const payload = {
      query: DELETE_POST_TAGS,
      variables: { tagIds: [tag1.id, tag2.id, tag3.id, tag4.id] },
    };

    const { data } = await post<DeleteTags>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.deletePostTags).toStrictEqual({
      __typename: "PostTagsWarning",
      tags: expect.arrayContaining([
        { __typename: "PostTag", ...tag3 },
        { __typename: "PostTag", ...tag4 },
      ]),
      message: `${tag3.name} and 1 other post tag deleted. 2 post tags could not be deleted`,
      status: Status.Warn,
    });

    expect(Worker).toHaveBeenCalledTimes(1);
    // expect(deletePostTagsWorker).toHaveBeenCalledTimes(1);
  });

  it("Should return error if no post tag could be deleted", async () => {
    const [tag1, tag2, tag3, tag4] = postTags;

    const payload = {
      query: DELETE_POST_TAGS,
      variables: { tagIds: [tag1.id, tag2.id, tag3.id, tag4.id] },
    };

    const { data } = await post<DeleteTags>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(Worker).not.toHaveBeenCalled();
    // expect(deletePostTagsWorker).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.deletePostTags).toStrictEqual({
      __typename: "UnknownError",
      message: "The provided post tags could not be deleted",
      status: Status.Error,
    });
  });
});
