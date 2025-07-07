import { afterAll, beforeAll, describe, test, expect } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import * as mocks from "../utils/getPost.testUtils";
import post from "@tests/post";
import { GET_POST } from "@tests/gqlQueries/postsTestQueries";
import loginTestUser from "@tests/loginTestUser";
import createTestPostTags from "@tests/createTestPostTags";
import testUsers from "@tests/createTestUsers/testUsers";
import createTestPost from "@tests/createTestPost";
import { testPostData, registeredUser as user } from "@tests/mocks";

import type { PostTag, Post } from "@resolverTypes";
import type { APIContext, TestData } from "@types";

type GetPost = TestData<{ getPost: Record<string, unknown> }>;

describe("Get post - E2E", () => {
  let server: ApolloServer<APIContext>, url: string, post1: Post;
  let registeredJwt: string, unregisteredJwt: string, postTags: PostTag[];

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

    post1 = await createTestPost({
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
  });

  afterAll(async () => {
    await db.query(
      `TRUNCATE TABLE posts, post_tags, users RESTART IDENTITY CASCADE`
    );

    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    test("User is not logged in, Expect an error response", async () => {
      const payload = { query: GET_POST, variables: { slug: "" } };
      const { data } = await post<GetPost>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPost).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to retrieve post",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    test.each(mocks.gqlValidations)("%s", async (_, slug) => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };
      const payload = { query: GET_POST, variables: { slug } };

      const { data } = await post<GetPost>(url, payload, options);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    test.each(mocks.validations)("%s", async (_, slug) => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };
      const payload = { query: GET_POST, variables: { slug } };

      const { data } = await post<GetPost>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPost).toStrictEqual({
        __typename: "GetPostValidationError",
        slugError: "Provide post slug",
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user", () => {
    test("The logged in user is unregistered, Expect an error response", async () => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };
      const payload = { query: GET_POST, variables: { slug: "slug" } };

      const { data } = await post<GetPost>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPost).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to retrieve post",
        status: "ERROR",
      });
    });
  });

  describe("Retrieve post", () => {
    test("Expect a warning response if no post with the provided post slug was found", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload = { query: GET_POST, variables: { slug: "slug" } };

      const { data } = await post<GetPost>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPost).toStrictEqual({
        __typename: "GetPostWarning",
        message: "Unable to retrieve post",
        status: "WARN",
      });
    });

    test("Should find a post with the given post id", async () => {
      const payload = { query: GET_POST, variables: { slug: post1.url.slug } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<GetPost>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPost).toStrictEqual({
        __typename: "SinglePost",
        post: { ...post1, tags: expect.arrayContaining(postTags) },
        status: "SUCCESS",
      });
    });
  });
});
