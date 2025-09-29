import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { db } from "@lib/db";
import { startServer } from "@server";

import * as mocks from "../utils/binPost.testUtils";
import post from "@tests/post";
import loginTestUser from "@tests/loginTestUser";
import testUsers from "@tests/createTestUsers/testUsers";
import createTestPostTags from "@tests/createTestPostTags";
import createTestPost from "@tests/createTestPost";
import { BIN_POST } from "@tests/gqlQueries/postsTestQueries";
import { registeredUser as user, testPostData } from "@tests/mocks";
import { DATE_REGEX } from "@tests/constants";

import type { APIContext, TestData } from "@types";
import type { PostTag, Post } from "@resolverTypes";

type BinPost = TestData<{ binPost: Record<string, unknown> }>;

describe("Bin post - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredJwt: string, unregisteredJwt: string, postTags: PostTag[];
  let binned: Post, unBinned: Post;

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

    const binnedPost = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Test Binned Post Title - 4",
        isBinned: true,
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const unBinnedPost = createTestPost({
      db,
      postData: testPostData({ title: "Test Un-binned Post Title - 4" }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    [binned, unBinned] = await Promise.all([binnedPost, unBinnedPost]);
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
      const payload = { query: BIN_POST, variables: { postId: "" } };

      const { data } = await post<BinPost>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPost).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to move post to bin",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, postId, errorMsg) => {
      const payload = { query: BIN_POST, variables: { postId } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<BinPost>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPost).toStrictEqual({
        __typename: "PostIdValidationError",
        postIdError: errorMsg,
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user", () => {
    it("Expect an error response if the logged in user is unregistered", async () => {
      const { postId } = mocks;
      const payload = { query: BIN_POST, variables: { postId } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<BinPost>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPost).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to move post to bin",
        status: "ERROR",
      });
    });
  });

  describe("Verify post id", () => {
    it("Expect an error response if no post could be found using the provided post id", async () => {
      const { postId } = mocks;
      const payload = { query: BIN_POST, variables: { postId } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPost>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPost).toStrictEqual({
        __typename: "UnknownError",
        message: "Unable to move post to bin",
        status: "ERROR",
      });
    });

    it("Expect an error response if the post has already been moved to bin", async () => {
      const { id: postId } = binned;
      const payload = { query: BIN_POST, variables: { postId } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPost>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPost).toStrictEqual({
        __typename: "NotAllowedPostActionError",
        message: "This blog post has already been sent to bin",
        status: "ERROR",
      });
    });
  });

  describe("Bin posts", () => {
    it("Expect the post to be moved to bin", async () => {
      const { id: postId } = unBinned;
      const payload = { query: BIN_POST, variables: { postId } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPost>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...unBinned,
          isBinned: true,
          binnedAt: expect.stringMatching(DATE_REGEX),
        },

        status: "SUCCESS",
      });
    });
  });
});
