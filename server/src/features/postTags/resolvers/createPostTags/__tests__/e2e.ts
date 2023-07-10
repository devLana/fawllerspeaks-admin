import type { ApolloServer } from "@apollo/server";

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

import { db } from "@services/db";
import { startServer } from "@server";

import { UUID_REGEX } from "@utils";
import { CREATE_POST_TAGS, testUsers, loginTestUser, post } from "@tests";

import type { APIContext, TestData } from "@types";
import { type PostTagsWarning, type PostTags, Status } from "@resolverTypes";

type CreateTags = TestData<{ createPostTags: Record<string, unknown> }>;
type CreateTagsSuccess = TestData<{ createPostTags: PostTags }>;
type CreateTagsWarning = TestData<{ createPostTags: PostTagsWarning }>;

describe("Create post tags - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredUserAccessToken: string, unRegisteredUserAccessToken: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(registeredUser.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);

    [registeredUserAccessToken, unRegisteredUserAccessToken] =
      await Promise.all([registered, unRegistered]);
  });

  afterAll(async () => {
    const clearPostTags = db.query(`DELETE FROM post_tags`);
    const clearUsers = db.query(`DELETE FROM users`);
    const stop = server.stop();
    await Promise.all([clearPostTags, clearUsers, stop]);
    await db.end();
  });

  it("Should return error on logged out user", async () => {
    const payload = { query: CREATE_POST_TAGS, variables: { tags: ["tag1"] } };

    const { data } = await post<CreateTags>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.createPostTags).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to create post tag",
      status: Status.Error,
    });
  });

  it.each([
    ["null input", null],
    ["undefined input", undefined],
    ["boolean input", true],
    ["number input", 100],
    ["array with invalid inputs", [false, 90, {}, []]],
  ])("Should throw graphql validation error for %s", async (_, tags) => {
    const payload = { query: CREATE_POST_TAGS, variables: { tags } };

    const { data } = await post<CreateTags>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeDefined();
    expect(data.data).toBeUndefined();
  });

  it.each([
    [
      "array input that exceeds maximum limit of 10",
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"],
      "Input tags can only contain at most 10 tags",
    ],
    ["empty input array", [], "No post tags were provided"],
    [
      "array of empty strings and empty whitespace strings",
      ["", "   "],
      "Input tags cannot contain empty values",
    ],
    [
      "array of duplicate input strings",
      ["tag a", "tagA", "b"],
      "Input tags can only contain unique tags",
    ],
  ])("Returns error for %s", async (_, tags, errorMsg) => {
    const payload = { query: CREATE_POST_TAGS, variables: { tags } };

    const { data } = await post<CreateTags>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.createPostTags).toStrictEqual({
      __typename: "CreatePostTagsValidationError",
      tagsError: errorMsg,
      status: Status.Error,
    });
  });

  it("Should return error on unregistered user account", async () => {
    const payload = {
      query: CREATE_POST_TAGS,
      variables: { tags: ["tag1", "tag2"] },
    };

    const { data } = await post<CreateTags>(url, payload, {
      authorization: `Bearer ${unRegisteredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.createPostTags).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to create post tags",
      status: Status.Error,
    });
  });

  it("Creates post tags from input array", async () => {
    const payload = {
      query: CREATE_POST_TAGS,
      variables: { tags: ["tag1", "tag2", "tag3"] },
    };

    const { data } = await post<CreateTagsSuccess>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.createPostTags).toStrictEqual({
      __typename: "PostTags",
      tags: expect.arrayContaining([
        {
          __typename: "PostTag",
          id: expect.stringMatching(UUID_REGEX),
          name: "tag1",
          dateCreated: expect.any(Number),
          lastModified: null,
        },
        {
          __typename: "PostTag",
          id: expect.stringMatching(UUID_REGEX),
          name: "tag2",
          dateCreated: expect.any(Number),
          lastModified: null,
        },
        {
          __typename: "PostTag",
          id: expect.stringMatching(UUID_REGEX),
          name: "tag3",
          dateCreated: expect.any(Number),
          lastModified: null,
        },
      ]),
      status: Status.Success,
    });
  });

  it("Should return warning if at least one input post tag already exists", async () => {
    const payload = {
      query: CREATE_POST_TAGS,
      variables: { tags: ["tag1", "tag2", "tag4", "tag5"] },
    };

    const { data } = await post<CreateTagsWarning>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.createPostTags).toStrictEqual({
      __typename: "PostTagsWarning",
      tags: [
        {
          __typename: "PostTag",
          id: expect.stringMatching(UUID_REGEX),
          name: "tag4",
          dateCreated: expect.any(Number),
          lastModified: null,
        },
        {
          __typename: "PostTag",
          id: expect.stringMatching(UUID_REGEX),
          name: "tag5",
          dateCreated: expect.any(Number),
          lastModified: null,
        },
      ],
      message:
        "2 post tags created. 'tag1' and 1 other post tag have already been created",
      status: Status.Warn,
    });
  });

  it("Should return error if all input post tags already exists", async () => {
    const payload = {
      query: CREATE_POST_TAGS,
      variables: { tags: ["tag1", "tag2", "tag3", "tag4", "tag5"] },
    };

    const { data } = await post<CreateTags>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.createPostTags).toStrictEqual({
      __typename: "DuplicatePostTagError",
      message: "The provided post tags have already been created",
      status: Status.Error,
    });
  });
});
