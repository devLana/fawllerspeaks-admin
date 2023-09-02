import type { ApolloServer } from "@apollo/server";

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

import { startServer } from "@server";
import { db } from "@lib/db";

import {
  post,
  GET_POST_TAGS,
  testUsers,
  loginTestUser,
  createTestPostTags,
} from "@tests";

import type { APIContext, TestData } from "@types";
import { type PostTag, Status } from "@resolverTypes";

type GetPostTags = TestData<{ getPostTags: Record<string, unknown> }>;

describe("Get post tags - E2E", () => {
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

  it("Returns error for logged out user", async () => {
    const payload = { query: GET_POST_TAGS };
    const { data } = await post<GetPostTags>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.getPostTags).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to get post tags",
      status: Status.Error,
    });
  });

  it("Returns error for unregistered user", async () => {
    const payload = { query: GET_POST_TAGS };
    const { data } = await post<GetPostTags>(url, payload, {
      authorization: `Bearer ${unRegisteredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.getPostTags).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to get post tags",
      status: Status.Error,
    });
  });

  it("Returns all post tags", async () => {
    const payload = { query: GET_POST_TAGS };
    const { data } = await post<GetPostTags>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.getPostTags).toStrictEqual({
      __typename: "PostTags",
      tags: expect.arrayContaining(postTags),
      status: Status.Success,
    });
  });
});
