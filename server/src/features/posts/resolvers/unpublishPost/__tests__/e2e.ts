import { afterAll, beforeAll, describe, test, expect } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import { UUID, testsTable1 } from "../unpublishPost.testUtils";
import {
  createTestPostTags,
  postsUsers,
  loginTestUser,
  post,
  postAuthor,
  createAllTestPosts,
  UNPUBLISH_POST,
} from "@tests";

import type { APIContext, TestData } from "@types";
import type { PostTag, Post } from "@resolverTypes";

type UnpublishPost = TestData<{ unpublishPost: Record<string, unknown> }>;

describe("Unpublish post - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredUserAccessToken = "";
  let unRegisteredUserAccessToken = "";
  let postAuthorAccessToken = "";
  let publishedPosts: Post[], unpublishedPosts: Post[];
  let draftPosts: Post[], postTags: PostTag[];

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const {
      postAuthor: user,
      registeredUser,
      unregisteredUser,
    } = await postsUsers(db);

    const registered = loginTestUser(registeredUser.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);
    const author = loginTestUser(user.userId);
    const createPostTags = createTestPostTags(db);

    [
      registeredUserAccessToken,
      unRegisteredUserAccessToken,
      postAuthorAccessToken,
      postTags,
    ] = await Promise.all([registered, unRegistered, author, createPostTags]);

    ({ draftPosts, unpublishedPosts, publishedPosts } =
      await createAllTestPosts(db, postTags, {
        userId: user.userId,
        firstName: postAuthor.firstName,
        lastName: postAuthor.lastName,
      }));
  });

  afterAll(async () => {
    const clearPosts = db.query(`DELETE FROM posts`);
    const clearPostTags = db.query(`DELETE FROM post_tags`);
    const stop = server.stop();
    await Promise.all([clearPosts, clearPostTags, stop]);
    await db.query(`DELETE FROM users`);
    await db.end();
  });

  test("Should return error on logged out user", async () => {
    const payload = { query: UNPUBLISH_POST, variables: { postId: "UUID" } };

    const { data } = await post<UnpublishPost>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unpublishPost).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to unpublish post",
      status: "ERROR",
    });
  });

  test.each([
    ["null", null],
    ["undefined", undefined],
    ["boolean", true],
    ["object", {}],
    ["array", []],
  ])("Returns graphql error for %s post id", async (_, postId) => {
    const payload = { query: UNPUBLISH_POST, variables: { postId } };
    const options = { authorization: `Bearer ${unRegisteredUserAccessToken}` };

    const { data } = await post<UnpublishPost>(url, payload, options);

    expect(data.errors).toBeDefined();
    expect(data.data).toBeUndefined();
  });

  test.each([...testsTable1, ["invalid", 132, "Invalid post id"]])(
    "Should return error for %s post id",
    async (_, postId, errorMsg) => {
      const payload = { query: UNPUBLISH_POST, variables: { postId } };
      const options = { authorization: `Bearer ${registeredUserAccessToken}` };

      const { data } = await post<UnpublishPost>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.unpublishPost).toStrictEqual({
        __typename: "PostIdValidationError",
        postIdError: errorMsg,
        status: "ERROR",
      });
    }
  );

  test("Returns error for unregistered user", async () => {
    const payload = { query: UNPUBLISH_POST, variables: { postId: UUID } };
    const options = { authorization: `Bearer ${unRegisteredUserAccessToken}` };

    const { data } = await post<UnpublishPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unpublishPost).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to unpublish post",
      status: "ERROR",
    });
  });

  test("Returns error for unknown post id", async () => {
    const payload = { query: UNPUBLISH_POST, variables: { postId: UUID } };
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const { data } = await post<UnpublishPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unpublishPost).toStrictEqual({
      __typename: "UnknownError",
      message: "Unable to unpublish post",
      status: "ERROR",
    });
  });

  test("Returns error if post author is not the same as logged in user", async () => {
    const [{ id }] = publishedPosts;
    const payload = { query: UNPUBLISH_POST, variables: { postId: id } };
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const { data } = await post<UnpublishPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unpublishPost).toStrictEqual({
      __typename: "UnauthorizedAuthorError",
      message: "Cannot unpublish another author's post",
      status: "ERROR",
    });
  });

  test("Should return error if post is unpublished", async () => {
    const [{ id }] = unpublishedPosts;
    const payload = { query: UNPUBLISH_POST, variables: { postId: id } };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<UnpublishPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unpublishPost).toStrictEqual({
      __typename: "NotAllowedPostActionError",
      message: "Post is currently unpublished",
      status: "ERROR",
    });
  });

  test("Should return error if post status is not 'Published'", async () => {
    const [{ id }] = draftPosts;
    const payload = { query: UNPUBLISH_POST, variables: { postId: id } };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<UnpublishPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.unpublishPost).toStrictEqual({
      __typename: "NotAllowedPostActionError",
      message: "Only published posts can be unpublished",
      status: "ERROR",
    });
  });

  test("Publishes an unpublished post", async () => {
    const [testPost] = publishedPosts;
    const variables = { postId: testPost.id };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const payload = { query: UNPUBLISH_POST, variables };

    const { data } = await post<UnpublishPost>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.unpublishPost).toStrictEqual({
      __typename: "SinglePost",
      post: {
        ...testPost,
        status: "Unpublished",
        datePublished: null,
      },
      status: "SUCCESS",
    });
  });
});
