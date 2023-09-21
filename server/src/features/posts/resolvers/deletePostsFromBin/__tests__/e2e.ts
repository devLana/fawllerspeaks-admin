import { randomUUID } from "node:crypto";

import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { db } from "@lib/db";
import { startServer } from "@server";

import { validationsTable } from "../deletePostsFromBin.testUtils";
import {
  post,
  DELETE_POSTS_FROM_BIN,
  postAuthor,
  loginTestUser,
  createTestPostTags,
  createDeleteTestPosts,
  postsUsers,
} from "@tests";

import type { APIContext, TestData } from "@types";
import { type PostTag, type Post, Status } from "@resolverTypes";

type DeletePosts = TestData<{ deletePostsFromBin: Record<string, unknown> }>;

describe("Delete posts from bin - E2E", () => {
  const UUID = randomUUID();

  let server: ApolloServer<APIContext>, url: string;
  let registeredUserAccessToken = "";
  let unRegisteredUserAccessToken = "";
  let postAuthorAccessToken = "";
  let publishedPosts: Post[], unpublishedPosts: Post[];
  let draftPosts: Post[], postTags: PostTag[];

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const {
      postAuthor: user,
      registeredUser,
      unregisteredUser,
    } = await postsUsers(db);

    const registered = loginTestUser(registeredUser.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);
    const author = loginTestUser(user.userId);
    const createPostTags = createTestPostTags(db);

    [
      registeredUserAccessToken,
      unRegisteredUserAccessToken,
      postAuthorAccessToken,
      postTags,
    ] = await Promise.all([registered, unRegistered, author, createPostTags]);

    ({ draftPosts, unpublishedPosts, publishedPosts } =
      await createDeleteTestPosts(db, postTags, {
        userId: user.userId,
        firstName: postAuthor.firstName,
        lastName: postAuthor.lastName,
      }));
  });

  afterAll(async () => {
    const clearPosts = db.query(`DELETE FROM posts`);
    const clearPostTags = db.query(`DELETE FROM post_tags`);
    const stop = server.stop();
    await Promise.all([clearPosts, clearPostTags, stop]);
    await db.query(`DELETE FROM users`);
    await db.end();
  });

  test("Should return error on logged out user", async () => {
    const payload = {
      query: DELETE_POSTS_FROM_BIN,
      variables: { postIds: [] },
    };

    const { data } = await post<DeletePosts>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.deletePostsFromBin).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to delete post from bin",
      status: Status.Error,
    });
  });

  test.each([
    ["null input", null],
    ["undefined input", undefined],
    ["boolean input", true],
    ["array with invalid inputs", [false, 90, {}, []]],
  ])("Should throw graphql validation error for %s", async (_, postIds) => {
    const payload = { query: DELETE_POSTS_FROM_BIN, variables: { postIds } };

    const { data } = await post<DeletePosts>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeDefined();
    expect(data.data).toBeUndefined();
  });

  test.each(validationsTable)(
    "Returns error for %s",
    async (_, postIds, errorMsg) => {
      const payload = { query: DELETE_POSTS_FROM_BIN, variables: { postIds } };

      const { data } = await post<DeletePosts>(url, payload, {
        authorization: `Bearer ${registeredUserAccessToken}`,
      });

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.deletePostsFromBin).toStrictEqual({
        __typename: "PostIdsValidationError",
        postIdsError: errorMsg,
        status: Status.Error,
      });
    }
  );

  test("Should return error on unregistered user", async () => {
    const payload = {
      query: DELETE_POSTS_FROM_BIN,
      variables: { postIds: [UUID] },
    };

    const { data } = await post<DeletePosts>(url, payload, {
      authorization: `Bearer ${unRegisteredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.deletePostsFromBin).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to delete post from bin",
      status: Status.Error,
    });
  });

  test("Returns error if user tries to delete another author's posts from bin", async () => {
    const [post1, post2] = draftPosts;

    const payload = {
      query: DELETE_POSTS_FROM_BIN,
      variables: { postIds: [post1.id, post2.id] },
    };

    const { data } = await post<DeletePosts>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.deletePostsFromBin).toStrictEqual({
      __typename: "UnauthorizedAuthorError",
      message: "Cannot delete another author's posts from bin",
      status: Status.Error,
    });
  });

  test("Deletes all provided posts in the input array from bin", async () => {
    const [post1, post2] = draftPosts;

    const payload = {
      query: DELETE_POSTS_FROM_BIN,
      variables: { postIds: [post1.id, post2.id] },
    };

    const { data } = await post<DeletePosts>(url, payload, {
      authorization: `Bearer ${postAuthorAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.deletePostsFromBin).toStrictEqual({
      __typename: "Posts",
      posts: expect.arrayContaining([post1, post2]),
      status: Status.Success,
    });
  });

  test("Returns warning if at least one post could not be deleted from bin", async () => {
    const [post1, post2] = publishedPosts;
    const [post3] = unpublishedPosts;

    const payload = {
      query: DELETE_POSTS_FROM_BIN,
      variables: {
        postIds: [post1.id, post2.id, post3.id, UUID, randomUUID()],
      },
    };

    const { data } = await post<DeletePosts>(url, payload, {
      authorization: `Bearer ${postAuthorAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.deletePostsFromBin).toStrictEqual({
      __typename: "PostsWarning",
      posts: expect.arrayContaining([post3, post1, post2]),
      message:
        "3 posts deleted from bin. 2 other posts could not be deleted from bin",
      status: Status.Warn,
    });
  });

  test("Should return error if no post could be deleted from bin", async () => {
    const payload = {
      query: DELETE_POSTS_FROM_BIN,
      variables: { postIds: [UUID, randomUUID(), randomUUID(), randomUUID()] },
    };

    const { data } = await post<DeletePosts>(url, payload, {
      authorization: `Bearer ${postAuthorAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.deletePostsFromBin).toStrictEqual({
      __typename: "UnknownError",
      message: "The provided posts could not be deleted from bin",
      status: Status.Error,
    });
  });
});
