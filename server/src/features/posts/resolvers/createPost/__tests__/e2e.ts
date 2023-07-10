import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, test, expect } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";

import { validationTestsTable } from "../testsData";
import { UUID_REGEX, urls } from "@utils";
import {
  registeredUser,
  post,
  CREATE_POST,
  loginTestUser,
  postAuthor,
  createTestPostTags,
  createTestPosts,
  unpublishedTestPosts,
  postsUsers,
} from "@tests";

import type { APIContext, TestData } from "@types";
import { type PostTag, type Post, Status, PostStatus } from "@resolverTypes";

type Create = TestData<{ createPost: Record<string, unknown> }>;

describe("Create post - E2E", () => {
  const UUID = randomUUID();
  const testPost = {
    title: "post title",
    description: "post description",
    content: "post content",
    slug: "post/slug",
  };

  let server: ApolloServer<APIContext>, url: string;
  let registeredUserAccessToken: string, unRegisteredUserAccessToken: string;
  let postTags: PostTag[], unpublishedPosts: Post[];

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const {
      postAuthor: user,
      registeredUser: userRegistered,
      unregisteredUser,
    } = await postsUsers(db);

    const registered = loginTestUser(userRegistered.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);
    const createPostTags = createTestPostTags(db);

    [registeredUserAccessToken, unRegisteredUserAccessToken, postTags] =
      await Promise.all([registered, unRegistered, createPostTags]);

    unpublishedPosts = await createTestPosts({
      db,
      postTags,
      author: {
        userId: user.userId,
        firstName: postAuthor.firstName,
        lastName: postAuthor.lastName,
      },
      posts: unpublishedTestPosts,
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

  test("Returns error on logged out user", async () => {
    const payload = {
      query: CREATE_POST,
      variables: {
        post: {
          ...testPost,
          tags: [postTags[0].id, postTags[1].id, postTags[2].id],
        },
      },
    };

    const { data } = await post<Create>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.createPost).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to create post",
      status: Status.Error,
    });
  });

  test.each([
    [
      "null and undefined",
      {
        title: null,
        description: undefined,
        content: null,
        tags: undefined,
        slug: undefined,
      },
    ],
    [
      "boolean and number",
      {
        title: false,
        description: 34646,
        content: true,
        tags: [9877, true],
        slug: 21314,
      },
    ],
  ])("Throws graphql validation error for %s inputs", async (_, postData) => {
    const options = { authorization: `Bearer ${unRegisteredUserAccessToken}` };
    const payload = { query: CREATE_POST, variables: { post: postData } };

    const { data } = await post<Create>(url, payload, options);

    expect(data.errors).toBeDefined();
    expect(data.data).toBeUndefined();
  });

  test.each(validationTestsTable(null))(
    "Returns error for %s",
    async (_, postData, errors) => {
      const options = {
        authorization: `Bearer ${unRegisteredUserAccessToken}`,
      };
      const payload = { query: CREATE_POST, variables: { post: postData } };

      const { data } = await post<Create>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "CreatePostValidationError",
        ...errors,
        status: Status.Error,
      });
    }
  );

  test("Returns error for unknown post tag id(s)", async () => {
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const payload = {
      query: CREATE_POST,
      variables: {
        post: { ...testPost, tags: [UUID, randomUUID(), randomUUID()] },
      },
    };

    const { data } = await post<Create>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.createPost).toStrictEqual({
      __typename: "UnknownError",
      message: "Unknown post tag id provided",
      status: Status.Error,
    });
  });

  test("Returns error for one or more unknown post tag ids", async () => {
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const payload = {
      query: CREATE_POST,
      variables: {
        post: {
          ...testPost,
          tags: [postTags[0].id, postTags[1].id, UUID, randomUUID()],
        },
      },
    };

    const { data } = await post<Create>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.createPost).toStrictEqual({
      __typename: "UnknownError",
      message: "Unknown post tag id provided",
      status: Status.Error,
    });
  });

  test("Returns error for unregistered user", async () => {
    const options = { authorization: `Bearer ${unRegisteredUserAccessToken}` };

    const payload = {
      query: CREATE_POST,
      variables: {
        post: {
          ...testPost,
          tags: [
            postTags[0].id,
            postTags[1].id,
            postTags[2].id,
            postTags[3].id,
            postTags[4].id,
          ],
        },
      },
    };

    const { data } = await post<Create>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.createPost).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to create post",
      status: Status.Error,
    });
  });

  test("Returns error if post title already exists", async () => {
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const payload = {
      query: CREATE_POST,
      variables: {
        post: {
          ...testPost,
          title: unpublishedPosts[0].title,
          tags: [
            postTags[0].id,
            postTags[1].id,
            postTags[2].id,
            postTags[3].id,
            postTags[4].id,
          ],
        },
      },
    };

    const { data } = await post<Create>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.createPost).toStrictEqual({
      __typename: "DuplicatePostTitleError",
      message: "A post with that title has already been created",
      status: Status.Error,
    });
  });

  test("Create new post", async () => {
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const payload = {
      query: CREATE_POST,
      variables: {
        post: {
          ...testPost,
          tags: [
            postTags[0].id,
            postTags[1].id,
            postTags[2].id,
            postTags[3].id,
            postTags[4].id,
          ],
        },
      },
    };

    const { data } = await post<Create>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.createPost).toStrictEqual({
      __typename: "SinglePost",
      post: {
        __typename: "Post",
        id: expect.stringMatching(UUID_REGEX),
        title: testPost.title,
        description: testPost.description,
        content: testPost.content,
        author: `${registeredUser.firstName} ${registeredUser.lastName}`,
        status: PostStatus.Unpublished,
        slug: testPost.slug,
        url: `${urls.siteUrl}/blog/post-slug`,
        imageBanner: null,
        dateCreated: expect.any(Number),
        datePublished: null,
        lastModified: null,
        views: 0,
        likes: 0,
        isInBin: false,
        isDeleted: false,
        tags: expect.arrayContaining(postTags),
      },
      status: Status.Success,
    });
  });
});
