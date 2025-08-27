import { randomUUID } from "node:crypto";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { db } from "@lib/db";
import { startServer } from "@server";

import * as mocks from "../utils/binPosts.testUtils";
import post from "@tests/post";
import loginTestUser from "@tests/loginTestUser";
import testUsers from "@tests/createTestUsers/testUsers";
import createTestPostTags from "@tests/createTestPostTags";
import createTestPost from "@tests/createTestPost";
import { BIN_POSTS } from "@tests/gqlQueries/postsTestQueries";
import { registeredUser as user, testPostData } from "@tests/mocks";
import { DATE_REGEX } from "@tests/constants";

import type { APIContext, TestData } from "@types";
import type { PostTag, Post } from "@resolverTypes";

type BinPosts = TestData<{ binPosts: Record<string, unknown> }>;

describe("Bin posts - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let published: Post, unpublished: Post, drafted: Post;
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

    const draftPost = createTestPost({
      db,
      postTags,
      postData: testPostData({ title: "Test Post Title - 1" }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const publishedPost = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Test Post Title - 2",
        datePublished: new Date().toISOString(),
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const unpublishedPost = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Test Post Title - 3",
        status: "Unpublished",
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    [published, unpublished, drafted] = await Promise.all([
      publishedPost,
      unpublishedPost,
      draftPost,
    ]);
  });

  afterAll(async () => {
    await db.query(`
      Truncate TABLE post_contents, post_tags_to_posts, posts, post_tags, users
      RESTART IDENTITY CASCADE
    `);

    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("Expect an error object response if the user is not logged in", async () => {
      const payload = { query: BIN_POSTS, variables: { postIds: [] } };

      const { data } = await post<BinPosts>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to move post to bin",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, postIds, errorMsg) => {
      const payload = { query: BIN_POSTS, variables: { postIds } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toStrictEqual({
        __typename: "PostIdsValidationError",
        postIdsError: errorMsg,
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user", () => {
    it("Expect an error response if the logged in user is unregistered", async () => {
      const postIds = [randomUUID(), randomUUID()];
      const payload = { query: BIN_POSTS, variables: { postIds } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<BinPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to move posts to bin",
        status: "ERROR",
      });
    });
  });

  describe("Verify post ids", () => {
    it("Expect an error response if no post could be moved to bin", async () => {
      const postIds = [randomUUID(), randomUUID(), randomUUID()];
      const payload = { query: BIN_POSTS, variables: { postIds } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toStrictEqual({
        __typename: "UnknownError",
        message: "None of the selected posts could be moved to bin",
        status: "ERROR",
      });
    });
  });

  describe("Bin posts", () => {
    it("Expect all selected posts to be moved to bin", async () => {
      const postIds = [drafted.id, published.id];
      const payload = { query: BIN_POSTS, variables: { postIds } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toMatchObject({
        __typename: "Posts",
        posts: expect.arrayContaining([
          {
            ...drafted,
            isBinned: true,
            binnedAt: expect.stringMatching(DATE_REGEX),
            tags: expect.arrayContaining(drafted.tags as unknown[]),
          },
          {
            ...published,
            isBinned: true,
            binnedAt: expect.stringMatching(DATE_REGEX),
            tags: expect.arrayContaining(published.tags as unknown[]),
          },
        ]),
        status: "SUCCESS",
      });
    });

    it("Expect some of the provided posts to be moved to bin with a warning message", async () => {
      const postIds = [drafted.id, published.id, randomUUID(), unpublished.id];
      const payload = { query: BIN_POSTS, variables: { postIds } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toMatchObject({
        __typename: "PostsWarning",
        posts: [
          {
            ...unpublished,
            isBinned: true,
            binnedAt: expect.stringMatching(DATE_REGEX),
            tags: expect.arrayContaining(unpublished.tags as unknown[]),
          },
        ],
        message: "1 out of 4 posts moved to bin",
        status: "WARN",
      });
    });
  });
});
