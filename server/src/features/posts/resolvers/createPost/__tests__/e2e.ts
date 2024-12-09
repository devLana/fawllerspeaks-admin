import { afterAll, beforeAll, describe, it, expect, jest } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";
import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import supabase from "@lib/supabase/supabaseClient";

import * as mocks from "../utils/createPost.testUtils";
import { urls } from "@utils/ClientUrls";

import loginTestUser from "@tests/loginTestUser";
import testUsers from "@tests/createTestUsers/testUsers";
import createTestPostTags from "@tests/createTestPostTags";
import createTestPost from "@tests/createTestPost";
import post from "@tests/post";
import { registeredUser as user, testPostData } from "@tests/mocks";
import { CREATE_POST } from "@tests/gqlQueries/postsTestQueries";
import { DATE_REGEX, UUID_REGEX } from "@tests/constants";

import type { APIContext, TestData } from "@types";
import type { PostTag } from "@resolverTypes";

type Create = TestData<{ createPost: Record<string, unknown> }>;

jest.mock("@lib/supabase/supabaseEvent");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true);

describe("Create post - E2E", () => {
  let server: ApolloServer<APIContext>, url: string, postTags: PostTag[];
  let registeredJwt: string, unRegisteredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(registeredUser.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);
    const createPostTags = createTestPostTags(db);

    [registeredJwt, unRegisteredJwt, postTags] = await Promise.all([
      registered,
      unRegistered,
      createPostTags,
    ]);

    await createTestPost({
      db,
      postTags,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postData: testPostData({ title: "Create Test Post Title" }),
    });
  });

  afterAll(async () => {
    await db.query(
      "Truncate TABLE posts, post_tags, users RESTART IDENTITY CASCADE"
    );

    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("Should send an error response if the user is not logged in", async () => {
      const variables = { post: { ...mocks.argsWithNoImage, tagIds: null } };
      const payload = { query: CREATE_POST, variables };

      const { data } = await post<Create>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to create post",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.gqlValidations)("%s", async (_, postData) => {
      const options = { authorization: `Bearer ${unRegisteredJwt}` };
      const payload = { query: CREATE_POST, variables: { post: postData } };

      const { data } = await post<Create>(url, payload, options);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    it.each(mocks.validations(null))("%s", async (_, postData, errors) => {
      const options = { authorization: `Bearer ${unRegisteredJwt}` };
      const payload = { query: CREATE_POST, variables: { post: postData } };

      const { data } = await post<Create>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "PostValidationError",
        ...errors,
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user", () => {
    it("Should respond with an error if the user is unregistered", async () => {
      const options = { authorization: `Bearer ${unRegisteredJwt}` };
      const variables = { post: { ...mocks.argsWithImage } };
      const payload = { query: CREATE_POST, variables };

      const { data } = await post<Create>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to create post",
        status: "ERROR",
      });
    });
  });

  describe("Verify post title and post url slug", () => {
    it("Should respond with an error if the post slug generated from the provided post title already exists", async () => {
      const title = "Create Test.Post #Title";
      const variables = { post: { ...mocks.argsWithNoImage, title } };
      const payload = { query: CREATE_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Create>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "ForbiddenError",
        message: `It seems this post title generates a slug that already exists. Please ensure the provided title is as unique as possible`,
        status: "ERROR",
      });
    });
  });

  describe("Create post", () => {
    const { storageUrl } = supabase();

    const author = {
      __typename: "PostAuthor",
      name: `${user.firstName} ${user.lastName}`,
      image: `${storageUrl}${user.image}`,
    };

    it("Should create and publish a new post with an image banner and post tags", async () => {
      const [tag1, tag2, tag3, tag4, tag5] = postTags;
      const tagIds = [tag1.id, tag2.id, tag3.id, tag4.id, tag5.id];
      const variables = { post: { ...mocks.argsWithImage, tagIds } };
      const payload = { query: CREATE_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Create>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          __typename: "Post",
          id: expect.stringMatching(UUID_REGEX),
          title: mocks.argsWithImage.title,
          description: mocks.argsWithImage.description,
          excerpt: mocks.argsWithImage.excerpt,
          content: mocks.postContentWithImage,
          author,
          status: "Published",
          url: {
            __typename: "PostUrl",
            href: `${urls.siteUrl}/blog/blog-post-title`,
            slug: "blog-post-title",
          },
          imageBanner: `${storageUrl}${mocks.imageBanner}`,
          dateCreated: expect.stringMatching(DATE_REGEX),
          datePublished: expect.stringMatching(DATE_REGEX),
          lastModified: null,
          views: 0,
          isInBin: false,
          isDeleted: false,
          tags: expect.arrayContaining(postTags),
        },
        status: "SUCCESS",
      });
    });

    it("Should create and publish a new post without an image banner and post tags", async () => {
      const variables = { post: { ...mocks.argsWithNoImage, tagIds: null } };
      const payload = { query: CREATE_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Create>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          __typename: "Post",
          id: expect.stringMatching(UUID_REGEX),
          title: mocks.argsWithNoImage.title,
          description: mocks.argsWithNoImage.description,
          excerpt: mocks.argsWithNoImage.excerpt,
          content: mocks.postContentWithNoImage,
          author,
          status: "Published",
          url: {
            __typename: "PostUrl",
            href: `${urls.siteUrl}/blog/another-blog-post-title`,
            slug: "another-blog-post-title",
          },
          imageBanner: null,
          dateCreated: expect.stringMatching(DATE_REGEX),
          datePublished: expect.stringMatching(DATE_REGEX),
          lastModified: null,
          views: 0,
          isInBin: false,
          isDeleted: false,
          tags: null,
        },
        status: "SUCCESS",
      });
    });
  });
});
