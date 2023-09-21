import { randomUUID } from "node:crypto";

import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { db } from "@lib/db";
import { startServer } from "@server";

import {
  post,
  UN_BIN_POSTS,
  postAuthor,
  postsUsers,
  loginTestUser,
  createTestPostTags,
  createBinnedTestPosts,
} from "@tests";

import type { APIContext, TestData } from "@types";
import { type PostTag, type Post, Status } from "@resolverTypes";
import { testTable1 } from "../unBinPosts.testUtils";

type UnBinPost = TestData<{ unBinPosts: Record<string, unknown> }>;

describe("Un-bin posts - E2E", () => {
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
        isInBin: false,
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
    const payload = { query: UN_BIN_POSTS, variables: { postIds: [] } };

    const { data } = await post<UnBinPost>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unBinPosts).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to remove post from bin",
      status: Status.Error,
    });
  });

  test.each([
    ["null input", null],
    ["undefined input", undefined],
    ["boolean input", true],
    ["array with invalid inputs", [false, 90, {}, []]],
  ])("Should throw graphql validation error for %s", async (_, postIds) => {
    const payload = { query: UN_BIN_POSTS, variables: { postIds } };
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const { data } = await post<UnBinPost>(url, payload, options);

    expect(data.errors).toBeDefined();
    expect(data.data).toBeUndefined();
  });

  test.each(testTable1)(
    "Returns error for %s",
    async (_, postIds, errorMsg) => {
      const payload = { query: UN_BIN_POSTS, variables: { postIds } };
      const options = { authorization: `Bearer ${registeredUserAccessToken}` };

      const { data } = await post<UnBinPost>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.unBinPosts).toStrictEqual({
        __typename: "PostIdsValidationError",
        postIdsError: errorMsg,
        status: Status.Error,
      });
    }
  );

  test("Should return error on unregistered user", async () => {
    const payload = { query: UN_BIN_POSTS, variables: { postIds: [UUID] } };
    const options = { authorization: `Bearer ${unRegisteredUserAccessToken}` };

    const { data } = await post<UnBinPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unBinPosts).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to remove post from bin",
      status: Status.Error,
    });
  });

  test("Returns error if user tries to remove another author's from bin", async () => {
    const [{ id: id1 }, { id: id2 }] = draftPosts;
    const variables = { postIds: [id1, id2] };
    const payload = { query: UN_BIN_POSTS, variables };
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const { data } = await post<UnBinPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unBinPosts).toStrictEqual({
      __typename: "UnauthorizedAuthorError",
      message: "Cannot remove another author's posts from bin",
      status: Status.Error,
    });
  });

  test("Removes all posts provided in the input array from bin", async () => {
    const [post1, post2] = draftPosts;
    const variables = { postIds: [post1.id, post2.id] };
    const payload = { query: UN_BIN_POSTS, variables };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<UnBinPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unBinPosts).toStrictEqual({
      __typename: "Posts",
      posts: expect.arrayContaining([post1, post2]),
      status: Status.Success,
    });
  });

  test("Returns warning if at least one post could not be removed from bin", async () => {
    const msg = "3 posts removed. 2 other posts could not be removed from bin";
    const [post1, post2] = publishedPosts;
    const [post3] = unpublishedPosts;
    const postIds = [post1.id, post2.id, post3.id, UUID, randomUUID()];
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };
    const payload = { query: UN_BIN_POSTS, variables: { postIds } };

    const { data } = await post<UnBinPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unBinPosts).toStrictEqual({
      __typename: "PostsWarning",
      posts: expect.arrayContaining([post3, post1, post2]),
      message: msg,
      status: Status.Warn,
    });
  });

  test("Should return error if no post could be removed from bin", async () => {
    const postIds = [UUID, randomUUID(), randomUUID(), randomUUID()];
    const payload = { query: UN_BIN_POSTS, variables: { postIds } };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<UnBinPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unBinPosts).toStrictEqual({
      __typename: "UnknownError",
      message: "The provided posts could not be removed from bin",
      status: Status.Error,
    });
  });
});
