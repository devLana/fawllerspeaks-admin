import { randomUUID } from "node:crypto";

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { db } from "@services/db";
import { startServer } from "@server";
import { BIN_POST } from "@utils/tests/gqlQueries/postsTestQueries";
import post from "@utils/tests/post";
import loginTestUser from "@utils/tests/loginTestUser";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import createTestPostTags from "@utils/tests/createTestPostTags";
import createTestPost from "@utils/tests/createTestPost";
import { registeredUser as user, testPostData } from "@utils/tests/mocks";
import { DATE_REGEX } from "@utils/tests/constants";
import type { APIContext } from "@types";
import type { PostTag, Post, SinglePost as SP } from "@resolverTypes";
import type { BinPostData } from "types/posts/binPost";

describe("Bin Post", () => {
  const postId = randomUUID();
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
        title: "Test Binned Post Title - 1",
        binnedAt: new Date().toISOString(),
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
      postData: testPostData({ title: "Test Un-binned Post Title - 1" }),
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

      const { data, responseHeaders } = await post<BinPostData>(url, payload);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPost).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to move post to bin",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each([
      [
        "Expect an error object response when the post id input provided is an empty string",
        "",
        "Provide post id",
      ],
      [
        "Expect an error object response when the post id input provided is an empty whitespace string",
        "   ",
        "Provide post id",
      ],
      [
        "Expect an error object response when the post id input provided is an invalid uuid string",
        "post_id",
        "Invalid post id",
      ],
    ])("%s", async (_, id, errorMsg) => {
      const payload = { query: BIN_POST, variables: { postId: id } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<BinPostData>(url, payload, options);

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
      const payload = { query: BIN_POST, variables: { postId } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<BinPostData>(url, payload, options);

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
      const payload = { query: BIN_POST, variables: { postId } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPostData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPost).toStrictEqual({
        __typename: "NotFoundError",
        message: "Unable to move post to bin",
        status: "ERROR",
      });
    });

    it("Expect an error response if the post has already been moved to bin", async () => {
      const { id } = binned;

      const payload = { query: BIN_POST, variables: { postId: id } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPostData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPost).toStrictEqual({
        __typename: "ForbiddenError",
        message: "This blog post has already been sent to bin",
        status: "ERROR",
      });
    });
  });

  describe("Bin posts", () => {
    it("Expect the post to be moved to bin", async () => {
      const { id } = unBinned;
      const payload = { query: BIN_POST, variables: { postId: id } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPostData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPost).toHaveProperty("__typename", "SinglePost");
      expect(data.data?.binPost).toHaveProperty("status", "SUCCESS");
      expect((data.data?.binPost as SP).post.binnedAt).not.toBeNull();
      expect((data.data?.binPost as SP).post.binnedAt).toMatch(DATE_REGEX);
    });
  });
});
