import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import { GET_POST_TAGS } from "@utils/tests/gqlQueries/postTagsTestQueries";
import post from "@utils/tests/post";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import loginTestUser from "@utils/tests/loginTestUser";
import createTestPostTags from "@utils/tests/createTestPostTags";
import type { APIContext } from "@types";
import type { PostTag } from "@resolverTypes";
import type { GetPostTagsData as Data } from "types/postTags/getPostTags";

describe("Get post tags", () => {
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
    await db.query("TRUNCATE TABLE users, post_tags RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("Should respond with an error if the user is not logged in", async () => {
      const payload = { query: GET_POST_TAGS };
      const { data, responseHeaders } = await post<Data>(url, payload);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPostTags).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to get post tags",
        status: "ERROR",
      });
    });
  });

  describe("Verify user registration status", () => {
    it("Should respond with an error if the user is unregistered", async () => {
      const payload = { query: GET_POST_TAGS };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<Data>(url, payload, options);

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

      const { data } = await post<Data>(url, payload, options);

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
