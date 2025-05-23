import { afterAll, beforeAll, describe, it, expect, jest } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";
import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import supabase from "@lib/supabase/supabaseClient";

import * as mocks from "../utils/editPost.testUtils";
import { urls } from "@utils/ClientUrls";

import loginTestUser from "@tests/loginTestUser";
import createTestPostTags from "@tests/createTestPostTags";
import createTestPost from "@tests/createTestPost";
import testUsers from "@tests/createTestUsers/testUsers";
import post from "@tests/post";
import { registeredUser as user, testPostData } from "@tests/mocks";
import { EDIT_POST } from "@tests/gqlQueries/postsTestQueries";
import { DATE_REGEX } from "@tests/constants";

import type { Post, PostTag } from "@resolverTypes";
import type { APIContext, TestData } from "@types";

type Edit = TestData<{ editPost: Record<string, unknown> }>;

jest.mock("@lib/supabase/supabaseEvent");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true).mockName("supabaseEvent.emit");

describe("Edit post - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredJwt: string, unregisteredJwt: string, postTags: PostTag[];
  let publishedPost: Post, unpublishedPost: Post, draftPost: Post;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);
    const registered = loginTestUser(registeredUser.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);
    const createPostTags = createTestPostTags(db);

    [registeredJwt, unregisteredJwt, postTags] = await Promise.all([
      registered,
      unRegistered,
      createPostTags,
    ]);

    const published = createTestPost({
      db,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postData: testPostData({
        title: "Create Test Published Post Title",
        status: "Published",
        datePublished: new Date().toISOString(),
      }),
    });

    const unpublished = createTestPost({
      db,
      postTags,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postData: testPostData({
        title: "Create Test Post Unpublished Title",
        status: "Unpublished",
      }),
    });

    const draft = createTestPost({
      db,
      postTags,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postData: testPostData({
        title: "Create Test Post Draft Title",
        status: "Draft",
      }),
    });

    [publishedPost, unpublishedPost, draftPost] = await Promise.all([
      published,
      unpublished,
      draft,
    ]);
  });

  afterAll(async () => {
    await db.query(
      "Truncate TABLE posts, post_tags, users RESTART IDENTITY CASCADE"
    );

    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("Should respond with an error object if the user is not logged in", async () => {
      const payload = { query: EDIT_POST, variables: { post: mocks.post } };

      const { data } = await post<Edit>(url, payload);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to edit post",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations(null))("%s", async (_, postData, errors) => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };
      const payload = { query: EDIT_POST, variables: { post: postData } };

      const { data } = await post<Edit>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "EditPostValidationError",
        ...errors,
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user", () => {
    it("Should respond with an error if the user is unregistered", async () => {
      const postData = { ...mocks.post, imageBanner: mocks.imageBanner };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<Edit>(url, payload, options);

      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to edit post",
        status: "ERROR",
      });
    });
  });

  describe("Verify post id", () => {
    it("Post id does not exist, Expect an error response", async () => {
      const postData = { ...mocks.post, imageBanner: mocks.imageBanner };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Edit>(url, payload, options);

      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "UnknownError",
        message: "Unable to edit post",
        status: "ERROR",
      });
    });
  });

  describe("Validate input for non Draft posts", () => {
    it("Should return an error object if no post metadata is provided for a published post", async () => {
      const { id } = unpublishedPost;
      const postData = { id, title: "Post Title", editStatus: true };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Edit>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "EditPostValidationError",
        descriptionError: "Provide post description",
        excerptError: "Provide post excerpt",
        contentError: "Provide post content",
        imageBannerError: null,
        idError: null,
        editStatusError: null,
        tagIdsError: null,
        titleError: null,
        status: "ERROR",
      });
    });

    it("Should return an error object if no post metadata is provided for an unpublished post", async () => {
      const { id } = publishedPost;
      const postData = { id, title: "Post Title", editStatus: true };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Edit>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "EditPostValidationError",
        descriptionError: "Provide post description",
        excerptError: "Provide post excerpt",
        contentError: "Provide post content",
        imageBannerError: null,
        idError: null,
        editStatusError: null,
        tagIdsError: null,
        titleError: null,
        status: "ERROR",
      });
    });
  });

  describe("Verify post title and post url slug", () => {
    it("Returns error if post title is used on another post in db", async () => {
      const { id } = publishedPost;
      const title = "Create Test.Post Unpublished#Title";
      const postData = { ...mocks.post, id, title, editStatus: true };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Edit>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "ForbiddenError",
        message: `This blog post's title generates a slug that already exists. Please ensure the provided title is as unique as possible`,
        status: "ERROR",
      });
    });
  });

  describe("Edit post", () => {
    const { storageUrl } = supabase();

    it("All input fields are passed, Expect the post status and all relevant post fields to be edited", async () => {
      const { id } = publishedPost;
      const tagIds = postTags.map(postTag => postTag.id);
      const postData = { ...mocks.post1, id, tagIds };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Edit>(url, payload, options);

      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...publishedPost,
          title: postData.title,
          description: postData.description,
          excerpt: postData.excerpt,
          content: mocks.expectedPostContent,
          imageBanner: `${storageUrl}${mocks.imageBanner}`,
          tags: expect.arrayContaining(postTags),
          status: "Unpublished",
          url: {
            __typename: "PostUrl",
            slug: "blog-post-title",
            href: `${urls.siteUrl}/blog/blog-post-title`,
          },
          datePublished: null,
          lastModified: expect.stringMatching(DATE_REGEX),
        },
        status: "SUCCESS",
      });
    });

    it("Should edit a post with the provided input data without editing the post status", async () => {
      const { id } = draftPost;
      const { editStatus: _, ...rest } = mocks.post2;
      const title = "Another Draft Blog Post Title";
      const postData = { ...rest, id, title };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Edit>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...draftPost,
          title: postData.title,
          description: postData.description,
          excerpt: postData.excerpt,
          content: mocks.expectedPostContent,
          url: {
            __typename: "PostUrl",
            slug: "another-draft-blog-post-title",
            href: `${urls.siteUrl}/blog/another-draft-blog-post-title`,
          },
          lastModified: expect.stringMatching(DATE_REGEX),
        },
        status: "SUCCESS",
      });
    });

    it("Input passed has the same title but different metadata, Expect the post title to remain the same but with different metadata", async () => {
      const { id, title } = unpublishedPost;
      const { imageBanner = null, tagIds = null } = mocks.post2;
      const postData = { ...mocks.post2, id, title, tagIds, imageBanner };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Edit>(url, payload, options);

      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...unpublishedPost,
          description: postData.description,
          excerpt: postData.excerpt,
          content: mocks.expectedPostContent,
          imageBanner: null,
          tags: null,
          url: {
            __typename: "PostUrl",
            slug: "create-test-post-unpublished-title",
            href: `${urls.siteUrl}/blog/create-test-post-unpublished-title`,
          },
          lastModified: expect.stringMatching(DATE_REGEX),
        },
        status: "SUCCESS",
      });
    });
  });
});
