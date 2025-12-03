import { afterAll, beforeAll, describe, it, expect, jest } from "@jest/globals";
import { type ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import { supabaseEvent } from "@events/supabase";
import { storageUrl } from "@services/supabase";
import { urls } from "@lib/ClientUrls";
import * as mocks from "./draftPost.testUtils";
import { DRAFT_POST } from "@utils/tests/gqlQueries/postsTestQueries";
import { testPostData, registeredUser as user } from "@utils/tests/mocks";
import createTestPostTags from "@utils/tests/createTestPostTags";
import { DATE_REGEX, UUID_REGEX } from "@utils/tests/constants";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import createTestPost from "@utils/tests/createTestPost";
import loginTestUser from "@utils/tests/loginTestUser";
import post from "@utils/tests/post";
import type { APIContext } from "@types";
import type { PostTag, Post } from "@resolverTypes";
import type { DraftData } from "types/posts/draftPost";

jest.mock("@events/supabase");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true).mockName("supabaseEvent.emit");

describe("Draft post", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredJwt: string, unRegisteredJwt: string, postTags: PostTag[];

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
      postData: testPostData({
        title: "Draft Post Title",
        content: null,
        status: "Draft",
        datePublished: null,
      }),
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
    it("Should respond with an error if the user is not logged in", async () => {
      const variables = { post: mocks.argsWithNoImage };
      const payload = { query: DRAFT_POST, variables };

      const { data } = await post<DraftData>(url, payload);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to save post to draft",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, input, errors) => {
      const payload = { query: DRAFT_POST, variables: { post: input } };
      const options = { authorization: `Bearer ${unRegisteredJwt}` };

      const { data } = await post<DraftData>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "PostValidationError",
        ...errors,
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user", () => {
    it("Should send an error response if the user is unregistered", async () => {
      const variables = { post: { ...mocks.argsWithImage } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${unRegisteredJwt}` };

      const { data } = await post<DraftData>(url, payload, options);

      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to save post to draft",
        status: "ERROR",
      });
    });
  });

  describe("Draft a new post", () => {
    const author = {
      __typename: "PostAuthor",
      name: `${user.firstName} ${user.lastName}`,
      image: `${storageUrl}${user.image}`,
    };

    it("Should save a new post with an image and post tags as draft", async () => {
      const [tag1, tag2, tag3, tag4, tag5] = postTags;
      const tagIds = [tag1.id, tag2.id, tag3.id, tag4.id, tag5.id];
      const variables = { post: { ...mocks.argsWithImage, tagIds } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DraftData>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          __typename: "Post",
          id: expect.stringMatching(UUID_REGEX),
          title: mocks.argsWithImage.title,
          description: null,
          excerpt: null,
          content: null,
          author,
          status: "Draft",
          url: {
            __typename: "PostUrl",
            href: `${urls.siteUrl}/blog/blog-post-title`,
            slug: "blog-post-title",
          },
          imageBanner: `${storageUrl}${mocks.imageBanner}`,
          dateCreated: expect.stringMatching(DATE_REGEX),
          datePublished: null,
          lastModified: null,
          views: 0,
          isBinned: false,
          binnedAt: null,
          tags: expect.arrayContaining(postTags),
        },
        status: "SUCCESS",
      });
    });

    it("Should save a new post without an image and post tags as draft", async () => {
      const variables = { post: { ...mocks.argsWithNoImage, tagIds: null } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DraftData>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "SinglePost",
        post: {
          __typename: "Post",
          id: expect.stringMatching(UUID_REGEX),
          title: mocks.argsWithNoImage.title,
          description: null,
          excerpt: null,
          content: mocks.expectedPostContent,
          author,
          status: "Draft",
          url: {
            __typename: "PostUrl",
            href: `${urls.siteUrl}/blog/another-blog-post-title`,
            slug: "another-blog-post-title",
          },
          imageBanner: null,
          dateCreated: expect.stringMatching(DATE_REGEX),
          datePublished: null,
          lastModified: null,
          views: 0,
          isBinned: false,
          binnedAt: null,
          tags: null,
        },
        status: "SUCCESS",
      });
    });

    it("Should draft a new blog post with a tokenized slug for slug uniqueness", async () => {
      const variables = { post: { ...mocks.argsWithImage, tagIds: null } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DraftData>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toHaveProperty("post.url.slug");

      expect((data.data?.draftPost.post as Post).url.slug).toMatch(
        new RegExp("^blog-post-title-[a-z0-9]{4}$")
      );
    });
  });
});
