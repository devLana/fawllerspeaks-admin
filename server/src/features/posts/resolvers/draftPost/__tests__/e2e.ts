import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, test, expect } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import { DATE_REGEX, UUID_REGEX, urls } from "@utils";
import {
  DRAFT_POST,
  createTestPostTags,
  createTestPosts,
  loginTestUser,
  post,
  postAuthor,
  unpublishedTestPosts,
  draftTestPosts,
  postsUsers,
} from "@tests";

import type { APIContext, TestData } from "@types";
import { type PostTag, type Post, Status, PostStatus } from "@resolverTypes";
import {
  e2eValidationsTable,
  validationTestsTable,
} from "../draftPost.testUtils";

type Draft = TestData<{ draftPost: Record<string, unknown> }>;

describe("Draft post - E2E", () => {
  const UUID = randomUUID();
  const testPost = {
    title: "new draft post title",
    description: "new draft post description",
    content: "new draft post content",
    slug: "New Draft Post Slug",
  };

  let server: ApolloServer<APIContext>, url: string;
  let registeredUserAccessToken: string;
  let unRegisteredUserAccessToken: string;
  let postAuthorAccessToken: string;
  let draftPosts: Post[], unpublishedPosts: Post[];
  let postTags: PostTag[];

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

    const unpublished = createTestPosts({
      db,
      postTags,
      author: {
        userId: user.userId,
        firstName: postAuthor.firstName,
        lastName: postAuthor.lastName,
      },
      posts: unpublishedTestPosts,
    });

    const draft = createTestPosts({
      db,
      postTags,
      author: {
        userId: user.userId,
        firstName: postAuthor.firstName,
        lastName: postAuthor.lastName,
      },
      posts: draftTestPosts,
    });

    [draftPosts, unpublishedPosts] = await Promise.all([draft, unpublished]);
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
    const payload = { query: DRAFT_POST, variables: { post: testPost } };

    const { data } = await post<Draft>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.draftPost).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to save post to draft",
      status: Status.Error,
    });
  });

  test.each(e2eValidationsTable)(
    "Throws graphql validation error for %s inputs",
    async (_, postData) => {
      const payload = { query: DRAFT_POST, variables: postData };

      const { data } = await post<Draft>(url, payload, {
        authorization: `Bearer ${unRegisteredUserAccessToken}`,
      });

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    }
  );

  test.each(validationTestsTable(null))(
    "Returns error on %s",
    async (_, postData, errors) => {
      const payload = { query: DRAFT_POST, variables: { post: postData } };

      const { data } = await post<Draft>(url, payload, {
        authorization: `Bearer ${unRegisteredUserAccessToken}`,
      });

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "PostValidationError",
        ...errors,
        status: Status.Error,
      });
    }
  );

  test("Returns error for unregistered user", async () => {
    const postData = { ...testPost, tags: [randomUUID(), randomUUID()] };
    const payload = { query: DRAFT_POST, variables: { post: postData } };
    const options = { authorization: `Bearer ${unRegisteredUserAccessToken}` };

    const { data } = await post<Draft>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.draftPost).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to save post to draft",
      status: Status.Error,
    });
  });

  test("Returns error if all provided post tags ids are unknown", async () => {
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };
    const testData = { ...testPost, tags: [randomUUID(), randomUUID()] };
    const payload = { query: DRAFT_POST, variables: { post: testData } };

    const { data } = await post<Draft>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.draftPost).toStrictEqual({
      __typename: "UnknownError",
      message: "Unknown post tag id provided",
      status: Status.Error,
    });
  });

  test("Returns error if at least one provided post tag id is unknown", async () => {
    const tagsData = [postTags[0].id, randomUUID(), randomUUID()];
    const testData = { ...testPost, tags: tagsData };
    const payload = { query: DRAFT_POST, variables: { post: testData } };
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const { data } = await post<Draft>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.draftPost).toStrictEqual({
      __typename: "UnknownError",
      message: "Unknown post tag id provided",
      status: Status.Error,
    });
  });

  test("Should return error if unknown post id is provided", async () => {
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };
    const variables = { post: { postId: UUID, ...testPost } };
    const payload = { query: DRAFT_POST, variables };

    const { data } = await post<Draft>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.draftPost).toStrictEqual({
      __typename: "UnknownError",
      message: "Unknown post id provided",
      status: Status.Error,
    });
  });

  test("Returns error if user tries to update another author's draft", async () => {
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };
    const variables = { post: { postId: unpublishedPosts[0].id, ...testPost } };
    const payload = { query: DRAFT_POST, variables };

    const { data } = await post<Draft>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.draftPost).toStrictEqual({
      __typename: "UnauthorizedAuthorError",
      message: "Cannot update another author's draft post",
      status: Status.Error,
    });
  });

  test("Should return error if post id is provided for non 'draft' post", async () => {
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };
    const variables = { post: { postId: unpublishedPosts[0].id, ...testPost } };
    const payload = { query: DRAFT_POST, variables };

    const { data } = await post<Draft>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.draftPost).toStrictEqual({
      __typename: "NotAllowedPostActionError",
      message: "Can only update a draft post",
      status: Status.Error,
    });
  });

  test("Returns error if post id is provided and post title already exists", async () => {
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };
    const [{ id }, { title }] = draftPosts;
    const variables = { post: { postId: id, ...testPost, title } };
    const payload = { query: DRAFT_POST, variables };

    const { data } = await post<Draft>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.draftPost).toStrictEqual({
      __typename: "DuplicatePostTitleError",
      message: "A post with that title has already been created",
      status: Status.Error,
    });
  });

  test("Updates already drafted post", async () => {
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };
    const [{ id: id1 }, { id: id2 }, { id: id3 }, { id: id4 }] = postTags;
    const [, , , , { id: id5 }] = postTags;
    const tags = [id1, id2, id3, id4, id5];
    const [{ id: postId, dateCreated, title }] = draftPosts;
    const testData = { post: { ...testPost, title, postId, tags } };
    const payload = { query: DRAFT_POST, variables: testData };

    const { data } = await post<Draft>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.draftPost).toStrictEqual({
      __typename: "SinglePost",
      post: {
        __typename: "Post",
        id: postId,
        title,
        description: testPost.description,
        content: testPost.content,
        author: `${postAuthor.firstName} ${postAuthor.lastName}`,
        status: PostStatus.Draft,
        slug: testPost.slug,
        url: `${urls.siteUrl}/blog/new-draft-post-slug`,
        imageBanner: null,
        dateCreated,
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

  test("Updates draft post with previously saved details", async () => {
    const [, { id }] = draftPosts;
    const variables = { post: { postId: id, title: "testing New title" } };
    const payload = { query: DRAFT_POST, variables };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<Draft>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.draftPost).toStrictEqual({
      __typename: "SinglePost",
      post: {
        ...draftPosts[1],
        title: "testing New title",
        url: `${urls.siteUrl}/blog/testing-new-title`,
      },
      status: Status.Success,
    });
  });

  test("Should return error for new draft if post title already exists", async () => {
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };
    const variables = { post: { ...testPost, title: "TESTING NEW TITLE" } };
    const payload = { query: DRAFT_POST, variables };

    const { data } = await post<Draft>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.draftPost).toStrictEqual({
      __typename: "DuplicatePostTitleError",
      message: "A post with that title has already been created",
      status: Status.Error,
    });
  });

  test("Saves new post as draft", async () => {
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };
    const [{ id: id1 }, { id: id2 }, { id: id3 }, { id: id4 }] = postTags;
    const [, , , , { id: id5 }] = postTags;
    const tags = [id1, id2, id3, id4, id5];
    const variables = { post: { ...testPost, tags } };

    const payload = { query: DRAFT_POST, variables };

    const { data } = await post<Draft>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.draftPost).toStrictEqual({
      __typename: "SinglePost",
      post: {
        __typename: "Post",
        id: expect.stringMatching(UUID_REGEX),
        title: testPost.title,
        description: testPost.description,
        content: testPost.content,
        author: `${postAuthor.firstName} ${postAuthor.lastName}`,
        status: PostStatus.Draft,
        slug: testPost.slug,
        url: `${urls.siteUrl}/blog/new-draft-post-slug`,
        imageBanner: null,
        dateCreated: expect.stringMatching(DATE_REGEX),
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
