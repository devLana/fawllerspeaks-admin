import { randomUUID } from "node:crypto";

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { db } from "@services/db";
import { startServer } from "@server";
import { BIN_POSTS } from "@utils/tests/gqlQueries/postsTestQueries";
import post from "@utils/tests/post";
import loginTestUser from "@utils/tests/loginTestUser";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import createTestPostTags from "@utils/tests/createTestPostTags";
import createTestPost from "@utils/tests/createTestPost";
import { registeredUser as user, testPostData } from "@utils/tests/mocks";
import { DATE_REGEX } from "@utils/tests/constants";
import type { APIContext } from "@types";
import type { PostTag, Post, Posts } from "@resolverTypes";
import type { BinPostsData } from "types/posts/binPosts";

describe("Bin Posts", () => {
  const UUID = randomUUID();
  let server: ApolloServer<APIContext>, url: string, published: Post;
  let unpublished: Post, drafted: Post, binned1: Post, binned2: Post;
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
        status: "Published",
        content: "<p>paragraph</p>",
        description: "Test Post Title Description - 2",
        excerpt: "Test Post Title Excerpt - 2",
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
        content: "<p>paragraph</p>",
        description: "Test Post Title Description - 3",
        excerpt: "Test Post Title Excerpt - 3",
        lastModified: new Date().toISOString(),
        imageBanner: "/path/to/image-banner.jpg",
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const binnedPost1 = createTestPost({
      db,
      postData: testPostData({
        title: "Test Post Title - 4",
        status: "Draft",
        content: "<p>some html paragraph</p>",
        description: "Test Post Title Description - 4",
        excerpt: "Test Post Title Excerpt - 4",
        imageBanner: "/path/to/image-banner-4.jpg",
        lastModified: new Date().toISOString(),
        binnedAt: new Date().toISOString(),
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const binnedPost2 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Test Post Title - 5",
        status: "Unpublished",
        content: "<p>some html paragraph</p>",
        description: "Test Post Title Description - 5",
        excerpt: "Test Post Title Excerpt - 5",
        lastModified: new Date().toISOString(),
        binnedAt: new Date().toISOString(),
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    [published, unpublished, drafted, binned1, binned2] = await Promise.all([
      publishedPost,
      unpublishedPost,
      draftPost,
      binnedPost1,
      binnedPost2,
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

      const { data } = await post<BinPostsData>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to move post to bin",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each([
      [
        "Expect a validation error response if the input is an empty array",
        [],
        "No post ids provided",
      ],
      [
        "Expect a validation error response if the input is an array of empty strings and/or empty whitespace strings",
        ["   ", ""],
        "Input post ids cannot be empty values",
      ],
      [
        "Expect a validation error response if the input array contains duplicate id strings",
        [UUID, UUID],
        "Input post ids can only contain unique ids",
      ],
      [
        "Expect a validation error response if the input array contains invalid post ids",
        ["id1", "id2"],
        "Invalid post id",
      ],
    ])("%s", async (_, postIds, errorMsg) => {
      const payload = { query: BIN_POSTS, variables: { postIds } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPostsData>(url, payload, options);

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

      const { data } = await post<BinPostsData>(url, payload, options);

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
    it("Expect an error response if the only selected post could not be moved to bin", async () => {
      const postIds = [randomUUID()];
      const payload = { query: BIN_POSTS, variables: { postIds } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPostsData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toStrictEqual({
        __typename: "NotFoundError",
        message: "The selected post could not be moved to bin",
        status: "ERROR",
      });
    });

    it("Expect an error response if all the multiple posts selected could not be moved to bin", async () => {
      const postIds = [randomUUID(), randomUUID(), randomUUID()];
      const payload = { query: BIN_POSTS, variables: { postIds } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<BinPostsData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toStrictEqual({
        __typename: "NotFoundError",
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

      const { data } = await post<BinPostsData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toHaveProperty("__typename", "Posts");
      expect(data.data?.binPosts).toHaveProperty("status", "SUCCESS");
      expect((data.data?.binPosts as Posts).posts.length).toBe(2);
      expect((data.data?.binPosts as Posts).posts[0].binnedAt).not.toBeNull();
      expect((data.data?.binPosts as Posts).posts[1].binnedAt).not.toBeNull();

      expect((data.data?.binPosts as Posts).posts[0].binnedAt).toMatch(
        DATE_REGEX
      );

      expect((data.data?.binPosts as Posts).posts[1].binnedAt).toMatch(
        DATE_REGEX
      );
    });

    it("Expect some of the provided posts to be moved to bin with a warning message", async () => {
      const postIds = [binned1.id, binned2.id, randomUUID(), unpublished.id];
      const payload = { query: BIN_POSTS, variables: { postIds } };
      const options = { authorization: `Bearer ${registeredJwt}` };
      const msg = "1 out of 4 posts moved to bin";

      const { data } = await post<BinPostsData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.binPosts).toHaveProperty("__typename", "PostsWarning");
      expect(data.data?.binPosts).toHaveProperty("status", "WARN");
      expect(data.data?.binPosts).toHaveProperty("message", msg);
      expect((data.data?.binPosts as Posts).posts.length).toBe(1);
      expect((data.data?.binPosts as Posts).posts[0].binnedAt).not.toBeNull();

      expect((data.data?.binPosts as Posts).posts[0].binnedAt).toMatch(
        DATE_REGEX
      );
    });
  });
});
