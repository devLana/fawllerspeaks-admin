import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, it, expect, jest } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import { supabaseEvent } from "@events/supabase";
import { storageUrl } from "@services/supabase";
import { urls } from "@lib/ClientUrls";
import * as mocks from "./draftPost.testUtils";
import { DRAFT_POST } from "@utils/tests/gqlQueries/postsTestQueries";
import { registeredUser as user } from "@utils/tests/mocks";
import { createTestPostTags } from "@utils/tests/createTestPostTags";
import { DATE_REGEX, UUID_REGEX } from "@utils/tests/constants";
import { testUsers } from "@utils/tests/createTestUsers/testUsers";
import { loginTestUser } from "@utils/tests/loginTestUser";
import { post } from "@utils/tests/post";
import type { APIContext } from "@appTypes";
import type { PostTag } from "@appTypes/resolverTypes";
import type { DraftData, Drafted } from "@appTypes/posts/draftPost";

jest.mock("@events/supabase");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true).mockName("supabaseEvent.emit");

describe("Draft Post", () => {
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

      const { data, responseHeaders } = await post<DraftData>(url, payload);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to save post to draft",
        status: "ERROR",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, input, errors) => {
      const payload = { query: DRAFT_POST, variables: { post: input } };
      const options = { authorization: `Bearer ${unRegisteredJwt}` };

      const { data } = await post<DraftData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "PostValidationError",
        ...errors,
        status: "ERROR",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });
  });

  describe("Verify logged in user", () => {
    it("Should send an error response if the user is unregistered", async () => {
      const variables = { post: { ...mocks.argsWithImage } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${unRegisteredJwt}` };

      const { data } = await post<DraftData>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to save post to draft",
        status: "ERROR",
      });
      expect(mockEvent).toHaveBeenCalledTimes(1);
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
          binnedAt: null,
          tags: expect.arrayContaining(postTags),
        },
        status: "SUCCESS",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });

    it("Should save a new post without an image and post tags as draft", async () => {
      const variables = { post: { ...mocks.argsWithNoImage, tagIds: null } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DraftData>(url, payload, options);

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
          binnedAt: null,
          tags: null,
        },
        status: "SUCCESS",
      });
      expect(mockEvent).not.toHaveBeenCalled();
    });

    it("Should draft a new blog post with a tokenized slug for slug uniqueness", async () => {
      const variables = { post: { ...mocks.argsWithImage, tagIds: null } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Drafted>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost.post.url.slug).toMatch(
        new RegExp("^blog-post-title-[a-z0-9]{4}$")
      );
      expect(mockEvent).not.toHaveBeenCalled();
    });

    it("Expect a new post to be drafted without any of the provided post tags", async () => {
      const tagIds = [randomUUID(), randomUUID(), randomUUID(), randomUUID()];
      const variables = { post: { title: mocks.title1, tagIds } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Drafted>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost.post.tags).toBeNull();
      expect(mockEvent).not.toHaveBeenCalled();
    });

    it("Expect a new post to be drafted with some of the provided post tags", async () => {
      const [tag1, , , , tag5] = postTags;
      const tagIds = [tag1.id, randomUUID(), randomUUID(), tag5.id];
      const variables = { post: { title: mocks.title2, tagIds } };
      const payload = { query: DRAFT_POST, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Drafted>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.draftPost.post.tags).toStrictEqual(
        expect.arrayContaining([tag1, tag5])
      );
      expect(mockEvent).not.toHaveBeenCalled();
    });
  });
});
