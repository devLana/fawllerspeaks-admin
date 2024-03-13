import { randomUUID } from "node:crypto";
import { Worker } from "node:worker_threads";

import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  jest,
} from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { db } from "@lib/db";
import { startServer } from "@server";

// import binPostsWorker from "../binPostsWorker";

import { validationsTable } from "../binPosts.testUtils";
import { BIN_POSTS } from "@tests/gqlQueries/postsTestQueries";
import post from "@tests/post";
import loginTestUser from "@tests/loginTestUser";
import createTestPostTags from "@tests/createTestPostTags";
// import postAuthor from "@tests/post";
// import postsUsers from "@tests/cre";
// import createBinnedTestPosts from "@tests/cre";

import type { APIContext, TestData } from "@types";
import type { PostTag, Post } from "@resolverTypes";

type BinPosts = TestData<{ binPosts: Record<string, unknown> }>;

jest.mock("node:worker_threads");
// jest.mock("../binPostsWorker");

describe("Bin posts - E2E", () => {
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
      await createBinnedTestPosts({
        db,
        postTags,
        author: {
          userId: user.userId,
          firstName: postAuthor.firstName,
          lastName: postAuthor.lastName,
        },
        isInBin: true,
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
    const payload = { query: BIN_POSTS, variables: { postIds: [] } };

    const { data } = await post<BinPosts>(url, payload);

    expect(Worker).not.toHaveBeenCalled();
    // expect(binPostsWorker).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.binPosts).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to move post to bin",
      status: "ERROR",
    });
  });

  test.each([
    ["null input", null],
    ["undefined input", undefined],
    ["boolean input", true],
    ["array with invalid inputs", [false, 90, {}, []]],
  ])("Should throw graphql validation error for %s", async (_, posts) => {
    const payload = { query: BIN_POSTS, variables: { posts } };

    const { data } = await post<BinPosts>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(Worker).not.toHaveBeenCalled();
    // expect(binPostsWorker).not.toHaveBeenCalled();

    expect(data.errors).toBeDefined();
    expect(data.data).toBeUndefined();
  });

  test.each(validationsTable)(
    "Returns error for %s",
    async (_, postIds, errorMsg) => {
      const payload = { query: BIN_POSTS, variables: { postIds } };

      const { data } = await post<BinPosts>(url, payload, {
        authorization: `Bearer ${registeredUserAccessToken}`,
      });

      expect(Worker).not.toHaveBeenCalled();
      // expect(binPostsWorker).not.toHaveBeenCalled();

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toStrictEqual({
        __typename: "PostIdsValidationError",
        postIdsError: errorMsg,
        status: "ERROR",
      });
    }
  );

  test("Should return error on unregistered user", async () => {
    const payload = { query: BIN_POSTS, variables: { postIds: [UUID] } };

    const { data } = await post<BinPosts>(url, payload, {
      authorization: `Bearer ${unRegisteredUserAccessToken}`,
    });

    expect(Worker).not.toHaveBeenCalled();
    // expect(binPostsWorker).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.binPosts).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to move post to bin",
      status: "ERROR",
    });
  });

  test("Returns error if user tries to move another author's posts to bin", async () => {
    const [post1, post2] = draftPosts;

    const payload = {
      query: BIN_POSTS,
      variables: { postIds: [post1.id, post2.id] },
    };

    const { data } = await post<BinPosts>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(Worker).not.toHaveBeenCalled();
    // expect(binPostsWorker).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.binPosts).toStrictEqual({
      __typename: "UnauthorizedAuthorError",
      message: "Cannot move another author's posts to bin",
      status: "ERROR",
    });
  });

  test("Moves all provided posts in the input array to bin", async () => {
    const [post1, post2] = draftPosts;

    const payload = {
      query: BIN_POSTS,
      variables: { postIds: [post1.id, post2.id] },
    };

    const { data } = await post<BinPosts>(url, payload, {
      authorization: `Bearer ${postAuthorAccessToken}`,
    });

    expect(Worker).toHaveBeenCalledTimes(1);
    // expect(binPostsWorker).toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.binPosts).toStrictEqual({
      __typename: "Posts",
      posts: expect.arrayContaining([post1, post2]),
      status: "SUCCESS",
    });
  });

  test("Returns warning if at least one post could not be moved to bin", async () => {
    const [post1, post2] = publishedPosts;
    const [post3] = unpublishedPosts;

    const payload = {
      query: BIN_POSTS,
      variables: {
        postIds: [post1.id, post2.id, post3.id, UUID, randomUUID()],
      },
    };

    const { data } = await post<BinPosts>(url, payload, {
      authorization: `Bearer ${postAuthorAccessToken}`,
    });

    expect(Worker).toHaveBeenCalledTimes(1);
    // expect(binPostsWorker).toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.binPosts).toStrictEqual({
      __typename: "PostsWarning",
      posts: expect.arrayContaining([post3, post1, post2]),
      message: "3 posts moved to bin. 2 other posts could not be moved to bin",
      status: "WARN",
    });
  });

  test("Should return error if no post could be moved to bin", async () => {
    const payload = {
      query: BIN_POSTS,
      variables: { postIds: [UUID, randomUUID(), randomUUID(), randomUUID()] },
    };

    const { data } = await post<BinPosts>(url, payload, {
      authorization: `Bearer ${postAuthorAccessToken}`,
    });

    expect(Worker).not.toHaveBeenCalled();
    // expect(binPostsWorker).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.binPosts).toStrictEqual({
      __typename: "UnknownError",
      message: "The selected posts could not be moved to bin",
      status: "ERROR",
    });
  });
});
