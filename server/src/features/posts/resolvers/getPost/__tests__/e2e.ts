import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, test, expect } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import {
  postAuthor,
  post,
  GET_POST,
  postsUsers,
  loginTestUser,
  createTestPostTags,
  createTestPosts,
  publishedTestPosts,
} from "@tests";

import { type PostTag, type Post, Status } from "@resolverTypes";
import type { APIContext, TestData } from "@types";

type GetPost = TestData<{ getPost: Record<string, unknown> }>;

describe("Get post - E2E", () => {
  const UUID = randomUUID();
  let server: ApolloServer<APIContext>, url: string;
  let registeredUserAccessToken: string, unRegisteredUserAccessToken: string;
  let posts: Post[], postTags: PostTag[];

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const {
      postAuthor: user,
      registeredUser,
      unregisteredUser,
    } = await postsUsers(db);

    const registered = loginTestUser(registeredUser.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);
    const createPostTags = createTestPostTags(db);

    [registeredUserAccessToken, unRegisteredUserAccessToken, postTags] =
      await Promise.all([registered, unRegistered, createPostTags]);

    posts = await createTestPosts({
      db,
      postTags,
      author: {
        userId: user.userId,
        firstName: postAuthor.firstName,
        lastName: postAuthor.lastName,
      },
      posts: publishedTestPosts,
    });
  });

  afterAll(async () => {
    const clearPosts = db.query(`DELETE FROM posts`);
    const clearPostTags = db.query(`DELETE FROM post_tags`);
    const stop = server.stop();
    await Promise.all([clearPosts, clearPostTags, stop]);
    await db.query(`DELETE FROM users`);
    await db.end();
  });

  test("Returns error on logged out user", async () => {
    const payload = { query: GET_POST, variables: { postId: "" } };

    const { data } = await post<GetPost>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.getPost).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to retrieve post",
      status: Status.Error,
    });
  });

  test.each([
    ["boolean", false],
    ["array", []],
    ["object", {}],
    ["null", null],
    ["undefined", undefined],
  ])("Throws graphql error on %s post id input", async (_, postId) => {
    const payload = { query: GET_POST, variables: { postId } };

    const { data } = await post<GetPost>(url, payload, {
      authorization: `Bearer ${unRegisteredUserAccessToken}`,
    });

    expect(data.errors).toBeDefined();
    expect(data.data).toBeUndefined();
  });

  test.each([
    ["empty", "", "Provide post id"],
    ["empty whitespace", "  ", "Provide post id"],
    ["invalid", 132, "Invalid post id provided"],
    ["invalid uuid", "invalid_uuid", "Invalid post id provided"],
  ])("Returns error on %s post id", async (_, postId, expected) => {
    const options = { authorization: `Bearer ${unRegisteredUserAccessToken}` };
    const payload = { query: GET_POST, variables: { postId } };

    const { data } = await post<GetPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.getPost).toStrictEqual({
      __typename: "PostIdValidationError",
      postIdError: expected,
      status: Status.Error,
    });
  });

  test("Returns error for unregistered user", async () => {
    const options = { authorization: `Bearer ${unRegisteredUserAccessToken}` };
    const payload = { query: GET_POST, variables: { postId: UUID } };

    const { data } = await post<GetPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.getPost).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to retrieve post",
      status: Status.Error,
    });
  });

  test("Returns error if post was not found", async () => {
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };
    const payload = { query: GET_POST, variables: { postId: UUID } };

    const { data } = await post<GetPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.getPost).toStrictEqual({
      __typename: "UnknownError",
      message: "Unable to retrieve a post with that id",
      status: Status.Error,
    });
  });

  test("Should find a post with the given post id", async () => {
    const [, testPost] = posts;
    const payload = { query: GET_POST, variables: { postId: testPost.id } };
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const { data } = await post<GetPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.getPost).toStrictEqual({
      __typename: "SinglePost",
      post: testPost,
      status: Status.Success,
    });
  });
});
