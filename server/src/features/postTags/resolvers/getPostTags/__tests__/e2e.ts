import type { ApolloServer } from "@apollo/server";

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

import { startServer } from "@server";
import { db } from "@lib/db";

import { GET_POST_TAGS } from "@tests/gqlQueries/postTagsTestQueries";
import post from "@tests/post";
import testUsers from "@tests/createTestUsers/testUsers";
import loginTestUser from "@tests/loginTestUser";
import createTestPostTags from "@tests/createTestPostTags";

import type { APIContext, TestData } from "@types";
import type { PostTag } from "@resolverTypes";

type GetPostTags = TestData<{ getPostTags: Record<string, unknown> }>;

describe("Get post tags - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredJwt: string, unregisteredJwt: string;
  let postTags: PostTag[];

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(registeredUser.userUUID);
    const unRegistered = loginTestUser(unregisteredUser.userUUID);
    const createPostTags = createTestPostTags(db);

    [registeredJwt, unregisteredJwt, postTags] = await Promise.all([
      registered,
      unRegistered,
      createPostTags,
    ]);
  });

  afterAll(async () => {
    const clearPostTags = db.query(`DELETE FROM post_tags`);
    const clearUsers = db.query(`DELETE FROM users`);
    const stop = server.stop();
    await Promise.all([clearPostTags, clearUsers, stop]);
    await db.end();
  });

  describe("Verify user authentication", () => {
    it("Should respond with an error if the user is not logged in", async () => {
      const { data } = await post<GetPostTags>(url, { query: GET_POST_TAGS });

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPostTags).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to get post tags",
        status: "ERROR",
      });
    });
  });

  describe("Verify user registration status", () => {
    it("Should respond with an error if the user is unregistered", async () => {
      const payload = { query: GET_POST_TAGS };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<GetPostTags>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPostTags).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to get post tags",
        status: "ERROR",
      });
    });
  });

  describe("Get all post tags", () => {
    it("Should respond with all the post tags saved in the db", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload = { query: GET_POST_TAGS };

      const { data } = await post<GetPostTags>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPostTags).toStrictEqual({
        __typename: "PostTags",
        tags: expect.arrayContaining(postTags),
        status: "SUCCESS",
      });
    });
  });
});
