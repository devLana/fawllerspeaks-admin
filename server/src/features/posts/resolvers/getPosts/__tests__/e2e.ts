import { afterAll, beforeAll, describe, it, expect } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import * as mocks from "../utils/getPosts.testUtils";
import { GET_POSTS } from "@tests/gqlQueries/postsTestQueries";
import post from "@tests/post";
import testUsers from "@tests/createTestUsers/testUsers";
import loginTestUser from "@tests/loginTestUser";
import createTestPostTags from "@tests/createTestPostTags";
import createTestPost from "@tests/createTestPost";
import { testPostData, registeredUser as user } from "@tests/mocks";

import type { APIContext, TestData } from "@types";
import type { GetPostsData, PostTag } from "@resolverTypes";

type GetPosts = TestData<{ getPosts: Record<string, unknown> }>;

describe("Get posts - E2E", () => {
  let server: ApolloServer<APIContext>, url: string, postTags: PostTag[];
  let registeredJwt: string, unregisteredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(registeredUser.userUUID);
    const unregistered = loginTestUser(unregisteredUser.userUUID);
    const createPostTags = createTestPostTags(db);

    [registeredJwt, unregisteredJwt, postTags] = await Promise.all([
      registered,
      unregistered,
      createPostTags,
    ]);

    const draftPost1 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Draft Test Post Title 1",
        status: "Draft",
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const draftPost2 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Draft Test Post Title 2",
        status: "Draft",
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const draftPost3 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Draft Test Post Title 3",
        status: "Draft",
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const draftPost4 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Draft Test Post Title 4",
        status: "Draft",
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const draftPost5 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Draft Test Post Title 5",
        status: "Draft",
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const publishedPost1 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Published Test Post 1",
        status: "Published",
        datePublished: new Date().toISOString(),
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const publishedPost2 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Published Test Post 2",
        status: "Published",
        datePublished: new Date().toISOString(),
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const publishedPost3 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Published Test Post 3",
        status: "Published",
        datePublished: new Date().toISOString(),
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const publishedPost4 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Published Test Post 4",
        status: "Published",
        datePublished: new Date().toISOString(),
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const unpublishedPost1 = createTestPost({
      db,
      postData: testPostData({
        title: "Unpublished Test Post 1",
        status: "Unpublished",
        datePublished: null,
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const unpublishedPost2 = createTestPost({
      db,
      postTags,
      postData: testPostData({
        title: "Unpublished Test Post 2",
        status: "Unpublished",
        datePublished: null,
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const unpublishedPost3 = createTestPost({
      db,
      postData: testPostData({
        title: "Unpublished Test Post 3",
        status: "Unpublished",
        datePublished: null,
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    const unpublishedPost4 = createTestPost({
      db,
      postData: testPostData({
        title: "Unpublished Test Post 4",
        status: "Unpublished",
        datePublished: null,
      }),
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });

    await Promise.all([
      draftPost1,
      draftPost2,
      draftPost3,
      draftPost4,
      draftPost5,
      publishedPost1,
      publishedPost2,
      publishedPost3,
      publishedPost4,
      unpublishedPost1,
      unpublishedPost2,
      unpublishedPost3,
      unpublishedPost4,
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
    it("Expect an error response if the user is not logged in", async () => {
      const { data } = await post<GetPosts>(url, { query: GET_POSTS });

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to retrieve posts",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.e2eValidations)("%s", async (_, variables, errors) => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };
      const payload = { query: GET_POSTS, variables };

      const { data } = await post<GetPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "GetPostsValidationError",
        ...errors,
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user", () => {
    it("Expect an error response if the logged in user is unregistered", async () => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<GetPosts>(url, { query: GET_POSTS }, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to retrieve posts",
        status: "ERROR",
      });
    });
  });

  describe("Verify after cursor", () => {
    it("Expect an error response if the sort column is 'date_created' and a malformed after cursor has been provided", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload = { query: GET_POSTS, variables: mocks.page };

      const { data } = await post<GetPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "ForbiddenError",
        message: "Unable to retrieve posts",
        status: "ERROR",
      });
    });
  });

  describe("Query for posts", () => {
    it("Expect all valid posts to be retrieved from the database", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload1 = { query: GET_POSTS };

      const { data: data1 } = await post<GetPosts>(url, payload1, options);

      expect(data1.errors).toBeUndefined();
      expect(data1.data).toBeDefined();
      expect(data1.data?.getPosts).toStrictEqual({
        __typename: "GetPostsData",
        posts: expect.any(Array),
        pageData: {
          __typename: "GetPostsPageData",
          previous: null,
          next: expect.stringMatching(/^\w+$/i),
        },
        status: "SUCCESS",
      });

      const { next } = (data1.data?.getPosts as GetPostsData).pageData;
      const payload2 = { query: GET_POSTS, variables: { after: next } };

      const { data: data2 } = await post<GetPosts>(url, payload2, options);

      expect(data2.errors).toBeUndefined();
      expect(data2.data).toBeDefined();
      expect(data2.data?.getPosts).toStrictEqual({
        __typename: "GetPostsData",
        posts: expect.any(Array),
        pageData: { __typename: "GetPostsPageData", previous: "", next: null },
        status: "SUCCESS",
      });
    });

    it("Expect an array of posts based on the application of filters provided", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload = { query: GET_POSTS, variables: mocks.e2eFilters1 };

      const { data } = await post<GetPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "GetPostsData",
        posts: expect.any(Array),
        pageData: {
          __typename: "GetPostsPageData",
          previous: null,
          next: null,
        },
        status: "SUCCESS",
      });
    });

    it("Expect an empty array if no posts could be found in the database using the provided filters", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload = { query: GET_POSTS, variables: mocks.e2eFilters2 };

      const { data } = await post<GetPosts>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.getPosts).toStrictEqual({
        __typename: "GetPostsData",
        posts: [],
        pageData: {
          __typename: "GetPostsPageData",
          previous: null,
          next: null,
        },
        status: "SUCCESS",
      });
    });

    it("Expect previous or next cursors if previous or next pages exist for the posts response", async () => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload1 = { query: GET_POSTS, variables: { size: 6 } };

      const { data: data1 } = await post<GetPosts>(url, payload1, options);

      expect(data1.errors).toBeUndefined();
      expect(data1.data).toBeDefined();
      expect(data1.data?.getPosts).toStrictEqual({
        __typename: "GetPostsData",
        posts: expect.any(Array),
        pageData: {
          __typename: "GetPostsPageData",
          previous: null,
          next: expect.stringMatching(/^\w+$/i),
        },
        status: "SUCCESS",
      });

      const { next: next1 } = (data1.data?.getPosts as GetPostsData).pageData;
      const vars1 = { after: next1, size: 6 };
      const payload2 = { query: GET_POSTS, variables: vars1 };

      const { data: data2 } = await post<GetPosts>(url, payload2, options);

      expect(data2.errors).toBeUndefined();
      expect(data2.data).toBeDefined();
      expect(data2.data?.getPosts).toStrictEqual({
        __typename: "GetPostsData",
        posts: expect.any(Array),
        pageData: {
          __typename: "GetPostsPageData",
          previous: "",
          next: expect.stringMatching(/^\w+$/i),
        },
        status: "SUCCESS",
      });

      const { next: next2 } = (data2.data?.getPosts as GetPostsData).pageData;
      const vars2 = { after: next2, size: 6 };
      const payload3 = { query: GET_POSTS, variables: vars2 };

      const { data: data3 } = await post<GetPosts>(url, payload3, options);

      expect(data3.errors).toBeUndefined();
      expect(data3.data).toBeDefined();
      expect(data3.data?.getPosts).toStrictEqual({
        __typename: "GetPostsData",
        posts: expect.any(Array),
        pageData: {
          __typename: "GetPostsPageData",
          previous: expect.stringMatching(/^\w+$/i),
          next: null,
        },
        status: "SUCCESS",
      });
    });
  });
});
