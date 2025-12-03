import { afterAll, beforeAll, describe, it, expect, jest } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { supabaseEvent } from "@events/supabase";
import { db } from "@services/db";
import { storageUrl } from "@services/supabase";
import { urls } from "@lib/ClientUrls";
import * as mocks from "./createPost.testUtils";
import loginTestUser from "@utils/tests/loginTestUser";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import createTestPostTags from "@utils/tests/createTestPostTags";
import createTestPost from "@utils/tests/createTestPost";
import post from "@utils/tests/post";
import { registeredUser as user, testPostData } from "@utils/tests/mocks";
import { CREATE_POST } from "@utils/tests/gqlQueries/postsTestQueries";
import { DATE_REGEX, UUID_REGEX } from "@utils/tests/constants";
import type { APIContext } from "@types";
import type { Post, PostTag } from "@resolverTypes";
import type { Create } from "types/posts/createPost";

jest.mock("@events/supabase");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true).mockName("supabaseEvent.emit");

describe("Create post", () => {
  let server: ApolloServer<APIContext>, url: string, postTags: PostTag[];
  let registeredJwt: string, unRegisteredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(registeredUser.userUUID);
    const unregistered = loginTestUser(unregisteredUser.userUUID);
    const createPostTags = createTestPostTags(db);

    [registeredJwt, unRegisteredJwt, postTags] = await Promise.all([
      registered,
      unregistered,
      createPostTags,
    ]);

    await createTestPost({
      db,
      postTags,
      postAuthor: {
        userId: registeredUser.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      postData: testPostData({ title: "Create Test Post Title" }),
    });
  });

  afterAll(async () => {
    await db.query(`
      Truncate TABLE post_contents, post_tags_to_posts, posts, post_tags, users
      RESTART IDENTITY CASCADE
    `);

    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("Should send an error response if the user is not logged in", async () => {
      const variables = { post: { ...mocks.argsWithNoImage, tagIds: null } };
      const payload = { query: CREATE_POST, variables };

      const { data } = await post<Create>(url, payload);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to create post",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, postData, errors) => {
      const options = { authorization: `Bearer ${unRegisteredJwt}` };
      const payload = { query: CREATE_POST, variables: { post: postData } };

      const { data } = await post<Create>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "PostValidationError",
        ...errors,
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user", () => {
    it("Should respond with an error if the user is unregistered", async () => {
      const options = { authorization: `Bearer ${unRegisteredJwt}` };
      const variables = { post: { ...mocks.argsWithImage } };
      const payload = { query: CREATE_POST, variables };

      const { data } = await post<Create>(url, payload, options);

      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to create post",
        status: "ERROR",
      });
    });
  });

  describe("Create post", () => {
    const author = {
      __typename: "PostAuthor",
      name: `${user.firstName} ${user.lastName}`,
      image: `${storageUrl}${user.image}`,
    };

    it("Should create and publish a new post with an image banner and post tags", async () => {
      const [tag1, tag2, tag3, tag4, tag5] = postTags;
      const tagIds = [tag1.id, tag2.id, tag3.id, tag4.id, tag5.id];
      const variables = { post: { ...mocks.argsWithImage, tagIds } };
      const payload = { query: CREATE_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Create>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          __typename: "Post",
          id: expect.stringMatching(UUID_REGEX),
          title: mocks.argsWithImage.title,
          description: mocks.argsWithImage.description,
          excerpt: mocks.argsWithImage.excerpt,
          content: mocks.postContentWithImage,
          author,
          status: "Published",
          url: {
            __typename: "PostUrl",
            href: `${urls.siteUrl}/blog/blog-post-title`,
            slug: "blog-post-title",
          },
          imageBanner: `${storageUrl}${mocks.imageBanner}`,
          dateCreated: expect.stringMatching(DATE_REGEX),
          datePublished: expect.stringMatching(DATE_REGEX),
          lastModified: null,
          views: 0,
          isBinned: false,
          binnedAt: null,
          tags: expect.arrayContaining(postTags),
        },
        status: "SUCCESS",
      });
    });

    it("Should create and publish a new post without an image banner and post tags", async () => {
      const variables = { post: { ...mocks.argsWithNoImage, tagIds: null } };
      const payload = { query: CREATE_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Create>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          __typename: "Post",
          id: expect.stringMatching(UUID_REGEX),
          title: mocks.argsWithNoImage.title,
          description: mocks.argsWithNoImage.description,
          excerpt: mocks.argsWithNoImage.excerpt,
          content: mocks.postContentWithNoImage,
          author,
          status: "Published",
          url: {
            __typename: "PostUrl",
            href: `${urls.siteUrl}/blog/another-blog-post-title`,
            slug: "another-blog-post-title",
          },
          imageBanner: null,
          dateCreated: expect.stringMatching(DATE_REGEX),
          datePublished: expect.stringMatching(DATE_REGEX),
          lastModified: null,
          views: 0,
          isBinned: false,
          binnedAt: null,
          tags: null,
        },
        status: "SUCCESS",
      });
    });

    it("Should create a new blog post with a tokenized slug for slug uniqueness", async () => {
      const variables = { post: { ...mocks.argsWithNoImage, tagIds: null } };
      const payload = { query: CREATE_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Create>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPost).toHaveProperty("post.url.slug");

      expect((data.data?.createPost.post as Post).url.slug).toMatch(
        new RegExp("^another-blog-post-title-[a-z0-9]{4}$")
      );
    });
  });
});
