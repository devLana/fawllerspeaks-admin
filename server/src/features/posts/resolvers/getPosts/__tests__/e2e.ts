import { afterAll, beforeAll, describe, it, expect } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import * as mocks from "../utils/getPosts.testUtils";
import { GET_POSTS } from "@tests/gqlQueries/postsTestQueries";
import post from "@tests/post";
import testUsers from "@tests/createTestUsers/testUsers";
import loginTestUser from "@tests/loginTestUser";
import createTestPostTags from "@tests/createTestPostTags";
import createTestPost from "@tests/createTestPost";
import { testPostData, registeredUser as user } from "@tests/mocks";

import type { APIContext, TestData } from "@types";
import type { Post, PostTag } from "@resolverTypes";

type GetPosts = TestData<{ getPosts: Record<string, unknown> }>;

describe("Get posts - E2E", () => {
  let server: ApolloServer<APIContext>, url: string, postTags: PostTag[];
  let registeredJwt: string, unregisteredJwt: string, posts: Post[];

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(registeredUser.userId);
    const unregistered = loginTestUser(unregisteredUser.userId);
    const createPostTags = createTestPostTags(db);

    [registeredJwt, unregisteredJwt, postTags] = await Promise.all([
      registered,
      unregistered,
      createPostTags,
    ]);

    const testPost1 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Test Post Title - 1",
        datePublished: new Date().toISOString(),
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const testPost2 = createTestPost({
      db,
      postData: testPostData({
        title: "Test Post 2",
        status: "Draft",
        content: null,
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    posts = await Promise.all([testPost1, testPost2]);
  });

  afterAll(async () => {
    await db.query(
      `TRUNCATE TABLE posts, post_tags, users RESTART IDENTITY CASCADE`
    );

    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("Should return an error response if the user is not logged in", async () => {
      const { data } = await post<GetPosts>(url, { query: GET_POSTS });

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to retrieve posts",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.gqlValidations)("%s", async (_, variables) => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };
      const payload = { query: GET_POSTS, variables };

      const { data } = await post<GetPosts>(url, payload, options);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    it.each(mocks.e2eValidations)("%s", async (_, variables, errors) => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };
      const payload = { query: GET_POSTS, variables };

      const { data } = await post<GetPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "GetPostsValidationError",
        ...errors,
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user", () => {
    it("Should respond with an error if the logged in user is unregistered", async () => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<GetPosts>(url, { query: GET_POSTS }, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to retrieve posts",
        status: "ERROR",
      });
    });
  });

  describe("Verify pagination cursor", () => {
    it("Should return an error response if an invalid base64 pagination cursor was provided", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload = { query: GET_POSTS, variables: { page: mocks.page } };

      const { data } = await post<GetPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "ForbiddenError",
        message: "Unable to retrieve posts",
        status: "ERROR",
      });
    });
  });

  describe("Query for posts", () => {
    it("Should successfully retrieve posts stored in the database", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload = { query: GET_POSTS };

      const { data } = await post<GetPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "GetPostsData",
        posts: expect.arrayContaining(posts),
        pageData: {
          __typename: "GetPostsPageData",
          after: null,
          before: null,
        },
        status: "SUCCESS",
      });
    });

    it("Should return an empty posts array if the passed filters could not be used to retrieve any post from the database", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const variables = { page: mocks.page, filters: mocks.filters };
      const payload = { query: GET_POSTS, variables };

      const { data } = await post<GetPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "GetPostsData",
        posts: [],
        pageData: {
          __typename: "GetPostsPageData",
          after: null,
          before: null,
        },
        status: "SUCCESS",
      });
    });
  });
});
