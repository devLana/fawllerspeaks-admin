import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, test, expect } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import {
  e2eValidationsTable,
  postFields,
  validationsTable,
} from "../editPost.testUtils";
import {
  post,
  EDIT_POST,
  loginTestUser,
  createTestPostTags,
  createAllTestPosts,
  postAuthor,
  postsUsers,
} from "@tests";
import { DATE_REGEX, urls } from "@utils";

import { type PostTag, type Post, Status } from "@resolverTypes";
import type { APIContext, TestData } from "@types";

type Edit = TestData<{ editPost: Record<string, unknown> }>;

describe("Edit post - E2E", () => {
  const UUID = randomUUID();

  const testPost = { ...postFields, slug: "post.slug" };

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

  test("Returns error on logged out user", async () => {
    const variables = { post: { ...testPost, tags: [postTags[0].id] } };
    const payload = { query: EDIT_POST, variables };

    const { data } = await post<Edit>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to edit post",
      status: Status.Error,
    });
  });

  test.each(e2eValidationsTable)(
    "Throws graphql validation error for %s inputs",
    async (_, postData) => {
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredUserAccessToken}` };

      const { data } = await post<Edit>(url, payload, options);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    }
  );

  test.each(validationsTable(null))(
    "Returns error for %s",
    async (_, postData, errors) => {
      const options = { authorization: `Bearer ${registeredUserAccessToken}` };
      const payload = { query: EDIT_POST, variables: { post: postData } };

      const { data } = await post<Edit>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "PostValidationError",
        ...errors,
        status: Status.Error,
      });
    }
  );

  test("Returns error if all provided post tags ids are unknown", async () => {
    const variables = { post: { ...testPost, tags: [UUID, randomUUID()] } };
    const payload = { query: EDIT_POST, variables };
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "UnknownError",
      message: "Unknown post tag id provided",
      status: Status.Error,
    });
  });

  test("Returns error if at least one provided post tag id is unknown", async () => {
    const tags = [postTags[0].id, UUID, randomUUID()];
    const postData = { ...testPost, tags };
    const payload = { query: EDIT_POST, variables: { post: postData } };
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "UnknownError",
      message: "Unknown post tag id provided",
      status: Status.Error,
    });
  });

  test("Returns error for unregistered user", async () => {
    const variables = { post: { ...testPost, tags: [postTags[0].id] } };
    const payload = { query: EDIT_POST, variables };
    const options = { authorization: `Bearer ${unRegisteredUserAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to edit post",
      status: Status.Error,
    });
  });

  test("Returns error if unknown post id is provided", async () => {
    const variables = { post: { ...testPost, tags: [postTags[0].id] } };
    const payload = { query: EDIT_POST, variables };
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "UnknownError",
      message: "We could not find the post you are trying to edit",
      status: Status.Error,
    });
  });

  test("Returns error if post author is not the same as logged in user", async () => {
    const [{ id }] = draftPosts;
    const variables = { post: { ...testPost, postId: id } };
    const payload = { query: EDIT_POST, variables };
    const options = { authorization: `Bearer ${registeredUserAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "UnauthorizedAuthorError",
      message: "Unable to edit another author's post",
      status: Status.Error,
    });
  });

  test("Returns error if post is not 'Published' and 'Unpublished'", async () => {
    const [{ id }] = draftPosts;
    const variables = { post: { ...testPost, postId: id } };
    const payload = { query: EDIT_POST, variables };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "NotAllowedPostActionError",
      message: "Can only edit published or unpublished posts",
      status: Status.Error,
    });
  });

  test("Returns error if post title is used on another post in db", async () => {
    const [{ id }, { title }] = publishedPosts;
    const variables = { post: { ...testPost, postId: id, title } };
    const payload = { query: EDIT_POST, variables };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "DuplicatePostTitleError",
      message: "A post has already been created with that title",
      status: Status.Error,
    });
  });

  test("Should edit post with saved tags & slug in db", async () => {
    const [unpublishedPost] = unpublishedPosts;
    const postData = {
      postId: unpublishedPost.id,
      title: "Testing Null Tags And Slug",
      description: "description",
      content: "content",
    };
    const payload = { query: EDIT_POST, variables: { post: postData } };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "SinglePost",
      post: {
        ...unpublishedPost,
        id: unpublishedPost.id,
        title: postData.title,
        description: postData.description,
        content: postData.content,
        lastModified: expect.stringMatching(DATE_REGEX),
      },
      status: Status.Success,
    });
  });

  test("Should edit published post with a new title", async () => {
    const [publishedPost] = publishedPosts;
    const [{ id: id1 }, { id: id2 }, { id: id3 }, { id: id4 }, { id: id5 }] =
      postTags;
    const tags = [id1, id2, id3, id4, id5];
    const variables = { post: { ...testPost, postId: publishedPost.id, tags } };
    const payload = { query: EDIT_POST, variables };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "SinglePost",
      post: {
        ...publishedPost,
        title: testPost.title,
        description: testPost.description,
        content: testPost.content,
        slug: testPost.slug,
        url: `${urls.siteUrl}/blog/post-slug`,
        lastModified: expect.stringMatching(DATE_REGEX),
        tags: expect.arrayContaining(postTags),
      },
      status: Status.Success,
    });
  });

  test("Should edit published post with the same title", async () => {
    const [, publishedPost] = publishedPosts;
    const { title, id } = publishedPost;
    const [{ id: id1 }, { id: id2 }, { id: id3 }, { id: id4 }, { id: id5 }] =
      postTags;
    const tags = [id1, id2, id3, id4, id5];
    const variables = { post: { ...testPost, postId: id, title, tags } };
    const payload = { query: EDIT_POST, variables };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "SinglePost",
      post: {
        ...publishedPost,
        title,
        description: testPost.description,
        content: testPost.content,
        slug: testPost.slug,
        url: `${urls.siteUrl}/blog/post-slug`,
        lastModified: expect.stringMatching(DATE_REGEX),
        tags: expect.arrayContaining(postTags),
      },
      status: Status.Success,
    });
  });

  test("Should edit unpublished post with a new title", async () => {
    const [unpublishedPost] = unpublishedPosts;
    const { id } = unpublishedPost;
    const [{ id: id1 }, { id: id2 }, { id: id3 }, { id: id4 }, { id: id5 }] =
      postTags;
    const tags = [id1, id2, id3, id4, id5];
    const postData = { title: "A New Unpublished Title", tags, postId: id };
    const variables = { post: { ...testPost, ...postData } };
    const payload = { query: EDIT_POST, variables };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "SinglePost",
      post: {
        ...unpublishedPost,
        title: "A New Unpublished Title",
        description: testPost.description,
        content: testPost.content,
        slug: testPost.slug,
        url: `${urls.siteUrl}/blog/post-slug`,
        lastModified: expect.stringMatching(DATE_REGEX),
        tags: expect.arrayContaining(postTags),
      },
      status: Status.Success,
    });
  });

  test("Should edit unpublished post with the same title", async () => {
    const [, unpublishedPost] = unpublishedPosts;
    const { title, id } = unpublishedPost;
    const [{ id: id1 }, { id: id2 }, { id: id3 }, { id: id4 }, { id: id5 }] =
      postTags;
    const tags = [id1, id2, id3, id4, id5];
    const variables = { post: { ...testPost, title, tags, postId: id } };
    const payload = { query: EDIT_POST, variables };
    const options = { authorization: `Bearer ${postAuthorAccessToken}` };

    const { data } = await post<Edit>(url, payload, options);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editPost).toStrictEqual({
      __typename: "SinglePost",
      post: {
        ...unpublishedPost,
        title,
        description: testPost.description,
        content: testPost.content,
        slug: testPost.slug,
        url: `${urls.siteUrl}/blog/post-slug`,
        lastModified: expect.stringMatching(DATE_REGEX),
        tags: expect.arrayContaining(postTags),
      },
      status: Status.Success,
    });
  });
});
