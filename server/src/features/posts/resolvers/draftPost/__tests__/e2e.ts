import { afterAll, beforeAll, describe, it, expect, jest } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";
import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import supabase from "@lib/supabase/supabaseClient";

import { urls } from "@utils/ClientUrls";
import * as mocks from "../utils/draftPost.testUtils";

import { testPostData, registeredUser as user } from "@tests/mocks";
import { DRAFT_POST } from "@tests/gqlQueries/postsTestQueries";
import createTestPostTags from "@tests/createTestPostTags";
import { DATE_REGEX, UUID_REGEX } from "@tests/constants";
import testUsers from "@tests/createTestUsers/testUsers";
import createTestPost from "@tests/createTestPost";
import loginTestUser from "@tests/loginTestUser";
import post from "@tests/post";

import type { APIContext, TestData } from "@types";
import type { PostTag, Post } from "@resolverTypes";

type Draft = TestData<{ draftPost: Record<string, unknown> }>;

jest.mock("@lib/supabase/supabaseEvent");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true);

describe("Draft post - E2E", () => {
  let server: ApolloServer<APIContext>, url: string, dbPost: Post;
  let registeredJwt: string, unRegisteredJwt: string, postTags: PostTag[];

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

    dbPost = await createTestPost({
      db,
      postTags,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postData: testPostData({
        content: null,
        status: "Draft",
        datePublished: null,
      }),
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
    it("Should respond with an error if the user is not logged in", async () => {
      const variables = { post: mocks.argsWithNoImage };
      const payload = { query: DRAFT_POST, variables };

      const { data } = await post<Draft>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to save post to draft",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.gqlValidations)("%s", async (_, postData) => {
      const variables = { post: postData };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${unRegisteredJwt}` };

      const { data } = await post<Draft>(url, payload, options);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    it.each(mocks.validations(null))("%s", async (_, input, errors) => {
      const payload = { query: DRAFT_POST, variables: { post: input } };
      const options = { authorization: `Bearer ${unRegisteredJwt}` };

      const { data } = await post<Draft>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "PostValidationError",
        ...errors,
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user", () => {
    it("Should send an error response if the user is unregistered", async () => {
      const postData = { ...mocks.argsWithNoImage, tags: mocks.tags };
      const variables = { post: postData };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${unRegisteredJwt}` };

      const { data } = await post<Draft>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to save post to draft",
        status: "ERROR",
      });
    });
  });

  describe("Verify post title", () => {
    it("Should respond with an error if the provided post title already exists", async () => {
      const testData = { ...mocks.argsWithNoImage, title: dbPost.title };
      const variables = { post: testData };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Draft>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "DuplicatePostTitleError",
        message: "A post with that title has already been created",
        status: "ERROR",
      });
    });
  });

  describe("Verify post tag ids", () => {
    it("Should send an error response if at least one of the provided post tags ids is unknown", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const testData = { ...mocks.argsWithImage, tags: mocks.tags };
      const variables = { post: testData };
      const payload = { query: DRAFT_POST, variables };

      const { data } = await post<Draft>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "UnknownError",
        message: "Unknown post tag id provided",
        status: "ERROR",
      });
    });
  });

  describe("Draft a new post", () => {
    const { storageUrl } = supabase();

    const author = {
      name: `${user.firstName} ${user.lastName}`,
      image: `${storageUrl}${user.image}`,
    };

    it("Should save a new post with an image and post tags as draft", async () => {
      const [tag1, tag2, tag3, tag4, tag5] = postTags;
      const tags = [tag1.id, tag2.id, tag3.id, tag4.id, tag5.id];
      const variables = { post: { ...mocks.argsWithImage, tags } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Draft>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          __typename: "Post",
          id: expect.stringMatching(UUID_REGEX),
          title: mocks.argsWithImage.title,
          description: null,
          excerpt: null,
          content: mocks.argsWithImage.content,
          author,
          status: "Draft",
          slug: "blog-post-title",
          url: `${urls.siteUrl}/blog/blog-post-title`,
          imageBanner: `${storageUrl}${mocks.imageBanner}`,
          dateCreated: expect.stringMatching(DATE_REGEX),
          datePublished: null,
          lastModified: null,
          views: 0,
          isInBin: false,
          isDeleted: false,
          tags: expect.arrayContaining(postTags),
        },
        status: "SUCCESS",
      });
    });

    it("Should save a new post without an image and post tags as draft", async () => {
      const variables = { post: { ...mocks.argsWithNoImage, tags: null } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Draft>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          __typename: "Post",
          id: expect.stringMatching(UUID_REGEX),
          title: mocks.argsWithNoImage.title,
          description: null,
          excerpt: null,
          content: null,
          author,
          status: "Draft",
          slug: "another-blog-post-title",
          url: `${urls.siteUrl}/blog/another-blog-post-title`,
          imageBanner: null,
          dateCreated: expect.stringMatching(DATE_REGEX),
          datePublished: null,
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
