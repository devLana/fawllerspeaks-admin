import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, it, expect } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import post from "@utils/tests/post";
import loginTestUser from "@utils/tests/loginTestUser";
import createTestPostTags from "@utils/tests/createTestPostTags";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import createTestPost from "@utils/tests/createTestPost";
import { testPostData, registeredUser as user } from "@utils/tests/mocks";
import { UNDO_UNPUBLISH_POST as GQL } from "@utils/tests/gqlQueries/postsTestQueries";
import { DATE_REGEX } from "@utils/tests/constants";
import type { APIContext } from "@types";
import type { PostTag, Post } from "@resolverTypes";
import type { UndoUnpublishPostData as Data } from "types/posts/undoUnpublishPost";

describe("Undo Unpublish post", () => {
  const UUID = randomUUID();
  let server: ApolloServer<APIContext>, url: string;
  let published: Post, unpublished: Post, draft: Post, binned: Post;
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
      postData: testPostData({ title: "Test Draft Post Title - 1" }),
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
        title: "Test Published Post Title - 2",
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
        title: "Test Unpublished Post Title - 3",
        status: "Unpublished",
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const binnedPost = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Test Binned Post Title - 3",
        status: "Draft",
        isBinned: true,
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    [published, unpublished, draft, binned] = await Promise.all([
      publishedPost,
      unpublishedPost,
      draftPost,
      binnedPost,
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
    it("Expect an error object response if the user is logged out", async () => {
      const payload = { query: GQL, variables: { postId: "UUID" } };

      const { data } = await post<Data>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.undoUnpublishPost).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to undo unpublish post",
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
    ])("%s", async (_, postId, errorMsg) => {
      const payload = { query: GQL, variables: { postId } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.undoUnpublishPost).toStrictEqual({
        __typename: "PostIdValidationError",
        postIdError: errorMsg,
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user", () => {
    it("Expect an error object response if the logged in user is unregistered", async () => {
      const payload = { query: GQL, variables: { postId: UUID } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.undoUnpublishPost).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to undo unpublish post",
        status: "ERROR",
      });
    });
  });

  describe("Verify post", () => {
    it("Expect an error object response if the provided post id does not exist", async () => {
      const payload = { query: GQL, variables: { postId: UUID } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.undoUnpublishPost).toStrictEqual({
        __typename: "UnknownError",
        message: "Unable to undo unpublish post",
        status: "ERROR",
      });
    });

    it("Expect an error object response if the post is a binned post", async () => {
      const { id } = binned;
      const payload = { query: GQL, variables: { postId: id } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.undoUnpublishPost).toStrictEqual({
        __typename: "NotAllowedPostActionError",
        message: "This blog post cannot be undone back to Published",
        status: "ERROR",
      });
    });
  });

  describe("Verify post status", () => {
    it("Expect an error object response if the user tries to undo a Draft post", async () => {
      const { id } = draft;
      const payload = { query: GQL, variables: { postId: id } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.undoUnpublishPost).toStrictEqual({
        __typename: "NotAllowedPostActionError",
        message: "Only an Unpublished post can be undone back to Published",
        status: "ERROR",
      });
    });

    it("Expect an warning object response if the user tries to undo a Published post", async () => {
      const { id } = published;
      const payload = { query: GQL, variables: { postId: id } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.undoUnpublishPost).toStrictEqual({
        __typename: "Response",
        message: "This blog post is already a Published post",
        status: "WARN",
      });
    });
  });

  describe("Update post status and undo an Unpublished post status", () => {
    it("Expect to be able to undo an Unpublished post back to Published", async () => {
      const { id } = unpublished;
      const payload = { query: GQL, variables: { postId: id } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.undoUnpublishPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...unpublished,
          status: "Published",
          lastModified: expect.stringMatching(DATE_REGEX),
          datePublished: expect.stringMatching(DATE_REGEX),
          tags: expect.arrayContaining(postTags),
        },
        status: "SUCCESS",
      });
    });
  });
});
