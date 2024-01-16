import { afterAll, beforeAll, describe, it, expect, jest } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";
import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import supabase from "@lib/supabase/supabaseClient";

import * as mocks from "../utils/createPost.testUtils";
import { urls } from "@utils";
import * as tests from "@tests";

import type { APIContext, TestData } from "@types";
import type { PostTag, Post } from "@resolverTypes";

type Create = TestData<{ createPost: Record<string, unknown> }>;

jest.mock("@lib/supabase/supabaseEvent");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true);

describe("Create post - E2E", () => {
  let server: ApolloServer<APIContext>, url: string, dbPost: Post;
  let registeredJwt: string, unRegisteredJwt: string, postTags: PostTag[];

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await tests.testUsers(db);

    const registered = tests.loginTestUser(registeredUser.userId);
    const unRegistered = tests.loginTestUser(unregisteredUser.userId);
    const createPostTags = tests.createTestPostTags(db);

    [registeredJwt, unRegisteredJwt, postTags] = await Promise.all([
      registered,
      unRegistered,
      createPostTags,
    ]);

    dbPost = await tests.createTestPost({
      db,
      postTags,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: tests.registeredUser.firstName,
        lastName: tests.registeredUser.lastName,
        image: tests.registeredUser.image,
      },
      postData: tests.testPostData(),
    });
  });

  afterAll(async () => {
    const clearPosts = db.query(`DELETE FROM posts`);
    const clearPostTags = db.query(`DELETE FROM post_tags`);
    const stop = server.stop();
    await Promise.all([clearPosts, clearPostTags, stop]);
    await db.query(`DELETE FROM users`);
    await db.end();
  });

  describe("Verify user authentication", () => {
    it("Should send an error response if the user is not logged in", async () => {
      const variables = { post: { ...mocks.argsWithNoImage, tags: null } };
      const payload = { query: tests.CREATE_POST, variables };

      const { data } = await tests.post<Create>(url, payload);

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
      const variables = { post: postData };
      const payload = { query: tests.CREATE_POST, variables };

      const { data } = await tests.post<Create>(url, payload, options);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    it.each(mocks.validations(null))("%s", async (_, postData, errors) => {
      const options = { authorization: `Bearer ${unRegisteredJwt}` };
      const variables = { post: postData };
      const payload = { query: tests.CREATE_POST, variables };

      const { data } = await tests.post<Create>(url, payload, options);

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
      const payload = { query: tests.CREATE_POST, variables };

      const { data } = await tests.post<Create>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to create post",
        status: "ERROR",
      });
    });
  });

  describe("Verify post title", () => {
    it("Should respond with an error if the provided post title already exists", async () => {
      const { title } = dbPost;
      const variables = { post: { ...mocks.argsWithNoImage, title } };
      const payload = { query: tests.CREATE_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await tests.post<Create>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "DuplicatePostTitleError",
        message: "A post with that title has already been created",
        status: "ERROR",
      });
    });
  });

  describe("Verify post tag ids", () => {
    it("Should respond with an error if at least one unknown post tag id was passed", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const tags = [mocks.UUID];
      const variables = { post: { ...mocks.argsWithNoImage, tags } };
      const payload = { query: tests.CREATE_POST, variables };

      const { data } = await tests.post<Create>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "UnknownError",
        message: "Unknown post tag id provided",
        status: "ERROR",
      });
    });
  });

  describe("Create post", () => {
    const { storageUrl } = supabase();

    const author = {
      name: `${tests.registeredUser.firstName} ${tests.registeredUser.lastName}`,
      image: `${storageUrl}${tests.registeredUser.image}`,
    };

    it("Should create and publish a new post with an image banner and post tags", async () => {
      const [tag1, tag2, tag3, tag4, tag5] = postTags;
      const tags = [tag1.id, tag2.id, tag3.id, tag4.id, tag5.id];
      const variables = { post: { ...mocks.argsWithImage, tags } };
      const payload = { query: tests.CREATE_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await tests.post<Create>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          __typename: "Post",
          id: expect.stringMatching(tests.UUID_REGEX),
          title: mocks.argsWithImage.title,
          description: mocks.argsWithImage.description,
          content: mocks.argsWithImage.content,
          author,
          status: "Published",
          slug: "blog-post-title",
          url: `${urls.siteUrl}/blog/blog-post-title`,
          imageBanner: `${storageUrl}${mocks.imageBanner}`,
          dateCreated: expect.stringMatching(tests.DATE_REGEX),
          datePublished: expect.stringMatching(tests.DATE_REGEX),
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
      const variables = { post: { ...mocks.argsWithNoImage, tags: null } };
      const payload = { query: tests.CREATE_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await tests.post<Create>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          __typename: "Post",
          id: expect.stringMatching(tests.UUID_REGEX),
          title: mocks.argsWithNoImage.title,
          description: mocks.argsWithNoImage.description,
          content: mocks.argsWithNoImage.content,
          author,
          status: "Published",
          slug: "another-blog-post-title",
          url: `${urls.siteUrl}/blog/another-blog-post-title`,
          imageBanner: null,
          dateCreated: expect.stringMatching(tests.DATE_REGEX),
          datePublished: expect.stringMatching(tests.DATE_REGEX),
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
