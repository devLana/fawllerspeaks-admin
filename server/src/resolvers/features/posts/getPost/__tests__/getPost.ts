import { afterAll, beforeAll, describe, test, expect } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import post from "@utils/tests/post";
import { GET_POST } from "@utils/tests/gqlQueries/postsTestQueries";
import loginTestUser from "@utils/tests/loginTestUser";
import createTestPostTags from "@utils/tests/createTestPostTags";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import createTestPost from "@utils/tests/createTestPost";
import { testPostData, registeredUser as user } from "@utils/tests/mocks";
import type { PostTag, Post } from "@resolverTypes";
import type { APIContext } from "@types";
import type { GetPostData } from "types/posts/getPost";

describe("Get Post", () => {
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
        status: "Published",
        datePublished: new Date().toISOString(),
        binnedAt: new Date().toISOString(),
        imageBanner: "path/to/image/avatar/image.jpg",
        description: "This is a binned published test post description",
        excerpt: "This is a binned published test post excerpt",
        content: "<p>This is a binned published test post content</p>",
        lastModified: new Date().toISOString(),
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
    await db.query(`
      Truncate TABLE post_contents, post_tags_to_posts, posts, post_tags, users
      RESTART IDENTITY CASCADE
    `);

    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    test("User is not logged in, Expect an error response", async () => {
      const payload = { query: GET_POST, variables: { slug: "" } };
      const { data } = await post<GetPostData>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPost).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to retrieve post",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    test.each([
      [
        "Expect an error object response when the slug input provided is an empty string",
        "",
      ],
      [
        "Expect an error object response when the slug input provided is an empty whitespace string",
        "   ",
      ],
    ])("%s", async (_, slug) => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };
      const payload = { query: GET_POST, variables: { slug } };

      const { data } = await post<GetPostData>(url, payload, options);

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

      const { data } = await post<GetPostData>(url, payload, options);

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
    test("Expect an error response if no post with the provided post slug could be found", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload = { query: GET_POST, variables: { slug: "slug" } };

      const { data } = await post<GetPostData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPost).toStrictEqual({
        __typename: "NotFoundError",
        message: "Unable to retrieve post",
        status: "ERROR",
      });
    });

    test("Should find a post with the given post id", async () => {
      const payload = { query: GET_POST, variables: { slug: post1.url.slug } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<GetPostData>(url, payload, options);

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
