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
import type { PostTag } from "@resolverTypes";

type Draft = TestData<{ draftPost: Record<string, unknown> }>;

jest.mock("@lib/supabase/supabaseEvent");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true);

describe("Draft post - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
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

    await createTestPost({
      db,
      postTags,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postData: testPostData({
        title: "Draft Post Title",
        content: null,
        status: "Draft",
        datePublished: null,
      }),
    });
  });

  afterAll(async () => {
    await db.query(
      "TRUNCATE TABLE posts, post_tags, users RESTART IDENTITY CASCADE"
    );

    await Promise.all([server.stop(), db.end()]);
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
      const payload = { query: DRAFT_POST, variables: { post: postData } };
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
      const variables = { post: { ...mocks.argsWithNoImage } };
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

  describe("Verify post title and post url slug", () => {
    it("Should respond with an error if the post slug generated from the provided post title already exists", async () => {
      const title = "Draft Post.Title";
      const variables = { post: { ...mocks.argsWithNoImage, title } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Draft>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "ForbiddenError",
        message:
          "The generated url slug for the provided post title already exists. Please ensure every post has a unique title",
        status: "ERROR",
      });
    });

    it("Should respond with an error if the provided post title already exists", async () => {
      const title = "Draft Po-st Title";
      const variables = { post: { ...mocks.argsWithNoImage, title } };
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

  describe("Draft a new post", () => {
    const { storageUrl } = supabase();

    const author = {
      __typename: "PostAuthor",
      name: `${user.firstName} ${user.lastName}`,
      image: `${storageUrl}${user.image}`,
    };

    it("Should save a new post with an image and post tags as draft", async () => {
      const [tag1, tag2, tag3, tag4, tag5] = postTags;
      const tagIds = [tag1.id, tag2.id, tag3.id, tag4.id, tag5.id];
      const variables = { post: { ...mocks.argsWithImage, tagIds } };
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
          content: null,
          author,
          status: "Draft",
          url: {
            __typename: "PostUrl",
            href: `${urls.siteUrl}/blog/blog-post-title`,
            slug: "blog-post-title",
          },
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
      const variables = { post: { ...mocks.argsWithNoImage, tagIds: null } };
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
          content: mocks.expectedPostContent,
          author,
          status: "Draft",
          url: {
            __typename: "PostUrl",
            href: `${urls.siteUrl}/blog/another-blog-post-title`,
            slug: "another-blog-post-title",
          },
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
