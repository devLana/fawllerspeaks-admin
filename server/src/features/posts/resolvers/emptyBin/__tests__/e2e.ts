import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { db } from "@lib/db";
import { startServer } from "@server";

import post from "@tests/post";
import { EMPTY_BIN } from "@tests/gqlQueries/postsTestQueries";
import loginTestUser from "@tests/loginTestUser";
import createTestPostTags from "@tests/createTestPostTags";
// import  postAuthor
// import  postsUsers
// import createDeleteTestPosts

import type { APIContext, TestData } from "@types";
import type { PostTag, Post } from "@resolverTypes";

type EmptyBin = TestData<{ emptyBin: Record<string, unknown> }>;

describe("Empty bin - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredUserAccessToken = "";
  let unRegisteredUserAccessToken = "";
  let postAuthorAccessToken = "";
  let posts: Post[] = [];
  let draftPosts: Post[] = [];
  let publishedPosts: Post[] = [];
  let unpublishedPosts: Post[] = [];

  let postTags: PostTag[];

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

    posts = [...unpublishedPosts, ...publishedPosts, ...draftPosts];
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
    const payload = { query: EMPTY_BIN };

    const { data } = await post<EmptyBin>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.emptyBin).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to empty all posts from bin",
      status: "ERROR",
    });
  });

  test("Returns error on unregistered user", async () => {
    const options = { authorization: `Bearer ${unRegisteredUserAccessToken}` };
    const payload = { query: EMPTY_BIN };

    const { data } = await post<EmptyBin>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.emptyBin).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to empty all posts from bin",
      status: "ERROR",
    });
  });

  test("Expect nothing to happen if user has no posts in their bin", async () => {
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };
    const payload = { query: EMPTY_BIN };

    const { data } = await post<EmptyBin>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.emptyBin).toStrictEqual({
      __typename: "EmptyBinWarning",
      message: "You have no posts in your bin to delete",
      status: "WARN",
    });
  });

  test("Should empty all posts from bin", async () => {
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };
    const payload = { query: EMPTY_BIN };

    const { data } = await post<EmptyBin>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.emptyBin).toStrictEqual({
      __typename: "Posts",
      posts: expect.arrayContaining(posts),
      status: "SUCCESS",
    });
  });
});
