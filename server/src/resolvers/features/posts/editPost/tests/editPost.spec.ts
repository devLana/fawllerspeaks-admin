import { afterAll, beforeAll, describe, it, expect, jest } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import { supabaseEvent } from "@events/supabase";
import { storageUrl } from "@services/supabase";
import * as mocks from "./editPost.testUtils";
import loginTestUser from "@utils/tests/loginTestUser";
import createTestPostTags from "@utils/tests/createTestPostTags";
import createTestPost from "@utils/tests/createTestPost";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import post from "@utils/tests/post";
import { registeredUser as user, testPostData } from "@utils/tests/mocks";
import { EDIT_POST } from "@utils/tests/gqlQueries/postsTestQueries";
import { DATE_REGEX } from "@utils/tests/constants";
import type { APIContext } from "@types";
import type { Post, PostTag } from "@resolverTypes";
import type { EditData } from "types/posts/editPost";

jest.mock("@events/supabase");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true).mockName("supabaseEvent.emit");

describe("Edit Post", () => {
  let server: ApolloServer<APIContext>, url: string, binnedPost: Post;
  let registeredJwt: string, unregisteredJwt: string, postTags: PostTag[];
  let draftPost1: Post, draftPost2: Post, draftPost3: Post;
  let publishedPost1: Post, publishedPost2: Post, unpublishedPost1: Post;
  let unpublishedPost2: Post;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);
    const registered = loginTestUser(registeredUser.userUUID);
    const unRegistered = loginTestUser(unregisteredUser.userUUID);
    const createPostTags = createTestPostTags(db, 10);

    [registeredJwt, unregisteredJwt, postTags] = await Promise.all([
      registered,
      unRegistered,
      createPostTags,
    ]);

    const published1 = createTestPost({
      db,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postData: testPostData({
        title: "Edit Test Post Published Title one",
        status: "Published",
        datePublished: new Date().toISOString(),
        imageBanner: "path/to/image/avatar/image.jpg",
        description: "This is a published test post description one",
        excerpt: "This is a published test post excerpt one",
        content: "<p>This is a published test post content one</p>",
      }),
      postTags: postTags.slice(0, 5),
    });

    const published2 = createTestPost({
      db,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postData: testPostData({
        title: "Edit Test Post Published Title Two",
        status: "Published",
        datePublished: new Date().toISOString(),
        description: "This is a published test post description two",
        excerpt: "This is a published test post excerpt two",
        content: "<p>This is a published test post content two</p>",
      }),
    });

    const unpublished1 = createTestPost({
      db,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postData: testPostData({
        title: "Edit Test Post Unpublished Title One",
        status: "Unpublished",
        description: "This is an unpublished test post description one",
        excerpt: "This is an unpublished test post excerpt one",
        content: "<p>This is an unpublished test post content one</p>",
      }),
    });

    const unpublished2 = createTestPost({
      db,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postTags: postTags.slice(6),
      postData: testPostData({
        title: "Edit Test Post Unpublished Title Two",
        status: "Unpublished",
        description: "This is an unpublished test post description two",
        excerpt: "This is an unpublished test post excerpt two",
        content: "<p>This is an unpublished test post content two</p>",
        imageBanner: "post/image/banner/storage/path",
      }),
    });

    const draft1 = createTestPost({
      db,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postTags: postTags.slice(4, 9),
      postData: testPostData({
        title: "Edit Test Post Draft Title One",
        status: "Draft",
        imageBanner: "post/image/banner/storage/path",
        content: "<p>This is a draft test post content one</p>",
        description: "This is a draft test post description one",
        excerpt: "This is a draft test post excerpt one",
      }),
    });

    const draft2 = createTestPost({
      db,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postTags: postTags.slice(2, 5),
      postData: testPostData({
        title: "Edit Test Post Draft Title Two",
        status: "Draft",
      }),
    });

    const draft3 = createTestPost({
      db,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postTags: postTags.slice(0, 5),
      postData: testPostData({
        title: "Edit Test Post Draft Title Three",
        status: "Draft",
        imageBanner: "post/image/banner/storage/path",
      }),
    });

    const binned = createTestPost({
      db,
      postTags: postTags.slice(5, 10),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postData: testPostData({
        title: "Edit Test Post Binned Title",
        status: "Draft",
        binnedAt: new Date().toISOString(),
        description: "This is a binned draft test post description",
        excerpt: "This is a binned draft test post excerpt",
        content: "<p>This is a binned draft test post content</p>",
      }),
    });

    [
      publishedPost1,
      publishedPost2,
      unpublishedPost1,
      unpublishedPost2,
      draftPost1,
      draftPost2,
      draftPost3,
      binnedPost,
    ] = await Promise.all([
      published1,
      published2,
      unpublished1,
      unpublished2,
      draft1,
      draft2,
      draft3,
      binned,
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
    it("Expect an error object response if the user is unauthenticated", async () => {
      const payload = { query: EDIT_POST, variables: { post: mocks.post1 } };

      const { data } = await post<EditData>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to edit post",
        status: "ERROR",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, postData, errors) => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };
      const payload = { query: EDIT_POST, variables: { post: postData } };

      const { data } = await post<EditData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "EditPostValidationError",
        ...errors,
        status: "ERROR",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });
  });

  describe("Verify logged in user", () => {
    it("Expect an error object response if the user is unregistered", async () => {
      const postData = { ...mocks.post1, imageBanner: mocks.imageBanner };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<EditData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to edit post",
        status: "ERROR",
      });
      expect(mockEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("Verify post", () => {
    it("Expect an error response if the user tries to edit a post that does not exist", async () => {
      const postData = { ...mocks.post1, imageBanner: mocks.imageBanner };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "NotFoundError",
        message: "Unable to edit post",
        status: "ERROR",
      });
      expect(mockEvent).toHaveBeenCalledTimes(1);
    });

    it("Expect an error response if the user tries to edit a binned post", async () => {
      const { id } = binnedPost;
      const postData = { id, title: "New Binned Edit Post Title" };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "ForbiddenError",
        message: "This blog post cannot be edited",
        status: "ERROR",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });
  });

  describe("Validate input for editing non Draft posts", () => {
    it("Expect an error response if no post metadata and content is provided for editing an Unpublished post", async () => {
      const { id } = unpublishedPost1;
      const postData = { id, title: "Post Title", editStatus: true };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditData>(url, payload, options);

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
      expect(mockEvent).not.toHaveBeenCalled();
    });

    it("Expect an error response if no post metadata and content is provided for a Published post", async () => {
      const { id } = publishedPost2;
      const postData = { id, title: "Post Title" };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditData>(url, payload, options);

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
      expect(mockEvent).not.toHaveBeenCalled();
    });
  });

  describe("Post edited", () => {
    it("Expect the title of a Draft post to be edited and its content and metadata to be deleted", async () => {
      const { id } = draftPost1;
      const postData = { ...mocks.post1, id };
      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...draftPost1,
          title: postData.title,
          description: null,
          excerpt: null,
          content: null,
          imageBanner: null,
          tags: null,
          lastModified: expect.stringMatching(DATE_REGEX),
        },
        status: "SUCCESS",
      });
      expect(mockEvent).toHaveBeenCalledTimes(1);
    });

    it("Expect the optional metadata of a Draft post and its content to be edited", async () => {
      const postData = {
        id: draftPost2.id,
        title: draftPost2.title,
        ...mocks.post2,
        tagIds: postTags.slice(4, 9).map(tag => tag.id),
      };

      const payload = { query: EDIT_POST, variables: { post: postData } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...draftPost2,
          description: postData.description,
          excerpt: postData.excerpt,
          content: mocks.post2ExpectedContent,
          imageBanner: `${storageUrl}${mocks.post2.imageBanner}`,
          tags: expect.arrayContaining(postTags.slice(4, 9)),
          lastModified: expect.stringMatching(DATE_REGEX),
        },
        status: "SUCCESS",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });

    it("Expect the content and all metadata of a Published post to be edited", async () => {
      const { id } = publishedPost1;
      const tagIds = postTags.slice(3, 6).map(postTag => postTag.id);
      const options = { authorization: `Bearer ${registeredJwt}` };
      const variables = { post: { ...mocks.post3, id, tagIds } };
      const payload = { query: EDIT_POST, variables };

      const { data } = await post<EditData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...publishedPost1,
          title: variables.post.title,
          description: variables.post.description,
          excerpt: variables.post.excerpt,
          content: mocks.expectedPostContent,
          tags: expect.arrayContaining(postTags.slice(3, 6)),
          lastModified: expect.stringMatching(DATE_REGEX),
        },
        status: "SUCCESS",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });

    it("Expect the content and all metadata of an Unpublished post to be edited", async () => {
      const { id } = unpublishedPost1;
      const options = { authorization: `Bearer ${registeredJwt}` };
      const variables = { post: { ...mocks.post4, id } };
      const payload = { query: EDIT_POST, variables };

      const { data } = await post<EditData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...unpublishedPost1,
          title: variables.post.title,
          description: variables.post.description,
          excerpt: variables.post.excerpt,
          content: mocks.expectedPostContent,
          lastModified: expect.stringMatching(DATE_REGEX),
        },
        status: "SUCCESS",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });

    it("Expect a Draft post to be updated to a Published post", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const { id } = draftPost3;
      const tagIds = postTags.slice(5).map(tag => tag.id);
      const postData = { id, ...mocks.post5, tagIds };
      const payload = { query: EDIT_POST, variables: { post: postData } };

      const { data } = await post<EditData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...draftPost3,
          title: postData.title,
          description: postData.description,
          excerpt: postData.excerpt,
          content: mocks.post5ExpectedContent,
          imageBanner: `${storageUrl}${mocks.imageBanner}`,
          tags: expect.arrayContaining(postTags.slice(5)),
          status: "Published",
          datePublished: expect.stringMatching(DATE_REGEX),
          lastModified: expect.stringMatching(DATE_REGEX),
        },
        status: "SUCCESS",
      });
      expect(mockEvent).toHaveBeenCalledTimes(1);
    });

    it("Expect an Unpublished post to be updated to a Published post", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const { id } = unpublishedPost2;
      const tagIds = postTags.slice(6, 8).map(tag => tag.id);
      const postData = { id, ...mocks.post6, tagIds };
      const payload = { query: EDIT_POST, variables: { post: postData } };

      const { data } = await post<EditData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...unpublishedPost2,
          status: "Published",
          title: postData.title,
          description: postData.description,
          excerpt: postData.excerpt,
          content: mocks.expectedPostContent,
          tags: expect.arrayContaining(postTags.slice(6, 8)),
          datePublished: expect.stringMatching(DATE_REGEX),
          lastModified: expect.stringMatching(DATE_REGEX),
        },
        status: "SUCCESS",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });

    it("Expect a Published post to be updated to an Unpublished post", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const { id } = publishedPost2;
      const postData = { ...mocks.post7, id };
      const payload = { query: EDIT_POST, variables: { post: postData } };

      const { data } = await post<EditData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          ...publishedPost2,
          title: postData.title,
          description: postData.description,
          excerpt: postData.excerpt,
          content: mocks.expectedUpdatedDraftPostContent,
          status: "Unpublished",
          datePublished: null,
          lastModified: expect.stringMatching(DATE_REGEX),
        },
        status: "SUCCESS",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });
  });
});
