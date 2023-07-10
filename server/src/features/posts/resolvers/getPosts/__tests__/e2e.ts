import { afterAll, beforeAll, describe, test, expect } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";

import {
  post,
  GET_POSTS,
  loginTestUser,
  createTestPostTags,
  createAllTestPosts,
  postsUsers,
  postAuthor,
} from "@tests";

import type { APIContext, TestData } from "@types";
import { type Post, type PostTag, Status } from "@resolverTypes";

type GetPosts = TestData<{ getPosts: Record<string, unknown> }>;

describe("Get posts - E2E", () => {
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

    const { unpublishedPosts, publishedPosts, draftPosts } =
      await createAllTestPosts(db, postTags, {
        userId: user.userId,
        lastName: postAuthor.lastName,
        firstName: postAuthor.firstName,
      });

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

  test("Returns error on logged out user", async () => {
    const payload = { query: GET_POSTS };

    const { data } = await post<GetPosts>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.getPosts).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to retrieve posts",
      status: Status.Error,
    });
  });

  test("Returns error on unregistered user", async () => {
    const payload = { query: GET_POSTS };
    const options = { authorization: `Bearer ${unRegisteredUserAccessToken}` };

    const { data } = await post<GetPosts>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.getPosts).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to retrieve posts",
      status: Status.Error,
    });
  });

  test("Should return all posts", async () => {
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };
    const payload = { query: GET_POSTS };

    const { data } = await post<GetPosts>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.getPosts).toStrictEqual({
      __typename: "Posts",
      posts: expect.arrayContaining(posts),
      status: Status.Success,
    });
  });
});
