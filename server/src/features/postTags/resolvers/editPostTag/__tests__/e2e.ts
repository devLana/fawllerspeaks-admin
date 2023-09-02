import { randomUUID } from "node:crypto";

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import {
  post,
  EDIT_POST_TAG,
  testUsers,
  loginTestUser,
  createTestPostTags,
} from "@tests";

import type { APIContext, TestData } from "@types";
import { type PostTag, Status } from "@resolverTypes";
import { DATE_REGEX } from "@utils";

type EditTag = TestData<{ editPostTag: Record<string, unknown> }>;

describe("Edit post tags - E2E", () => {
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
    const payload = {
      query: EDIT_POST_TAG,
      variables: { tagId: "", name: "" },
    };

    const { data } = await post<EditTag>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.editPostTag).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to edit post tag",
      status: Status.Error,
    });
  });

  it.each([
    ["null", { tagId: null, name: null }],
    ["undefined", { tagId: undefined, name: undefined }],
    ["boolean", { tagId: false, name: true }],
    ["number", { tagId: 200, name: 123 }],
  ])(
    "Should throw graphql validation error for %s inputs",
    async (_, variables) => {
      const payload = { query: EDIT_POST_TAG, variables };

      const { data } = await post<EditTag>(url, payload, {
        authorization: `Bearer ${unRegisteredUserAccessToken}`,
      });

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    }
  );

  it.each([
    [
      "empty tag id and name input",
      { tagId: "", name: "" },
      ["Provide post tag id", "Provide post tag name"],
    ],
    [
      "empty whitespace tag id and name input",
      { tagId: " ", name: "    " },
      ["Provide post tag id", "Provide post tag name"],
    ],
    [
      "invalid post tag id",
      { tagId: "tagId", name: "name" },
      ["Invalid post tag id", null],
    ],
  ])("Returns error for %s", async (_, variables, errors) => {
    const payload = { query: EDIT_POST_TAG, variables };

    const { data } = await post<EditTag>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.editPostTag).toStrictEqual({
      __typename: "EditPostTagValidationError",
      tagIdError: errors[0],
      nameError: errors[1],
      status: Status.Error,
    });
  });

  it("Returns error on unregistered user", async () => {
    const payload = {
      query: EDIT_POST_TAG,
      variables: { tagId: postTags[0].id, name: postTags[0].name },
    };

    const { data } = await post<EditTag>(url, payload, {
      authorization: `Bearer ${unRegisteredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.editPostTag).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to edit post tag",
      status: Status.Error,
    });
  });

  it("Should return an error if post tag id is unknown", async () => {
    const variables = { tagId: randomUUID(), name: "newTag" };
    const payload = { query: EDIT_POST_TAG, variables };

    const { data } = await post<EditTag>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPostTag).toStrictEqual({
      __typename: "UnknownError",
      message: "Unable to edit unknown post tag",
      status: Status.Error,
    });
  });

  it("Returns post tag if the new tag name equals old tag name", async () => {
    const variables = { tagId: postTags[0].id, name: postTags[0].name };
    const payload = { query: EDIT_POST_TAG, variables };

    const { data } = await post<EditTag>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPostTag).toStrictEqual({
      __typename: "EditedPostTag",
      tag: { __typename: "PostTag", ...postTags[0] },
      status: Status.Success,
    });
  });

  it("Updates post tag(case-insensitive)", async () => {
    const variables = {
      tagId: postTags[1].id,
      name: postTags[1].name.toUpperCase(),
    };

    const payload = { query: EDIT_POST_TAG, variables };

    const { data } = await post<EditTag>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.editPostTag).toStrictEqual({
      __typename: "EditedPostTag",
      tag: {
        __typename: "PostTag",
        id: postTags[1].id,
        name: variables.name,
        lastModified: expect.stringMatching(DATE_REGEX),
        dateCreated: postTags[1].dateCreated,
      },
      status: Status.Success,
    });
  });

  it("Returns error if post tag name already exists", async () => {
    const variables = { tagId: postTags[2].id, name: postTags[3].name };
    const payload = { query: EDIT_POST_TAG, variables };

    const { data } = await post<EditTag>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.editPostTag).toStrictEqual({
      __typename: "DuplicatePostTagError",
      message: `A post tag with the name "${variables.name}" already exists`,
      status: Status.Error,
    });
  });

  it("Returns error if a similar post tag name already exists", async () => {
    const variables = {
      tagId: postTags[3].id,
      name: postTags[4].name.toUpperCase(),
    };
    const payload = { query: EDIT_POST_TAG, variables };

    const { data } = await post<EditTag>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.editPostTag).toStrictEqual({
      __typename: "DuplicatePostTagError",
      message: `A similar post tag, "${postTags[4].name}", already exists`,
      status: Status.Error,
    });
  });

  it("Edits the current post tag to a new name", async () => {
    const variables = { tagId: postTags[0].id, name: "name not in db" };
    const payload = { query: EDIT_POST_TAG, variables };

    const { data } = await post<EditTag>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.editPostTag).toStrictEqual({
      __typename: "EditedPostTag",
      tag: {
        __typename: "PostTag",
        id: postTags[0].id,
        name: variables.name,
        lastModified: expect.stringMatching(DATE_REGEX),
        dateCreated: postTags[0].dateCreated,
      },
      status: Status.Success,
    });
  });
});
