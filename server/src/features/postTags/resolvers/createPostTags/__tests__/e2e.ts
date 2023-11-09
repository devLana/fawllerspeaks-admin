import type { ApolloServer } from "@apollo/server";

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

import { db } from "@lib/db";
import { startServer } from "@server";

import { DATE_REGEX, UUID_REGEX } from "@utils";
import { CREATE_POST_TAGS, testUsers, loginTestUser, post } from "@tests";
import {
  duplicate,
  gqlValidations,
  validations,
  warn,
} from "../utils/createPostTags.testUtils";

import type { APIContext, TestData } from "@types";
import type { PostTagsWarning, PostTags } from "@resolverTypes";

type CreateTags = TestData<{ createPostTags: Record<string, unknown> }>;
type CreateTagsSuccess = TestData<{ createPostTags: PostTags }>;
type CreateTagsWarning = TestData<{ createPostTags: PostTagsWarning }>;

describe("Create post tags - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredJwt: string, unRegisteredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(registeredUser.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);

    [registeredJwt, unRegisteredJwt] = await Promise.all([
      registered,
      unRegistered,
    ]);
  });

  afterAll(async () => {
    const clearPostTags = db.query(`DELETE FROM post_tags`);
    const clearUsers = db.query(`DELETE FROM users`);
    const stop = server.stop();
    await Promise.all([clearPostTags, clearUsers, stop]);
    await db.end();
  });

  describe("Verify user authentication", () => {
    it("Should respond with an error response if the user is not logged in", async () => {
      const payload = { query: CREATE_POST_TAGS, variables: { tags: ["tag"] } };

      const { data } = await post<CreateTags>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPostTags).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to create post tag",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(gqlValidations)("%s", async (_, tags) => {
      const payload = { query: CREATE_POST_TAGS, variables: { tags } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<CreateTags>(url, payload, options);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    it.each(validations)("%s", async (_, tags, errorMsg) => {
      const payload = { query: CREATE_POST_TAGS, variables: { tags } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<CreateTags>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPostTags).toStrictEqual({
        __typename: "CreatePostTagsValidationError",
        tagsError: errorMsg,
        status: "ERROR",
      });
    });
  });

  describe("Verify logged in user registration status", () => {
    it("Should respond with an error response if the user is unregistered", async () => {
      const variables = { tags: ["tag1", "tag2"] };
      const payload = { query: CREATE_POST_TAGS, variables };
      const options = { authorization: `Bearer ${unRegisteredJwt}` };

      const { data } = await post<CreateTags>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPostTags).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to create post tags",
        status: "ERROR",
      });
    });
  });

  describe("Create post tags", () => {
    it("Should create new post tags from the provided input array", async () => {
      const variables = { tags: ["tag1", "tag2", "Test_Post TAG-3"] };
      const payload = { query: CREATE_POST_TAGS, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<CreateTagsSuccess>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPostTags).toStrictEqual({
        __typename: "PostTags",
        tags: expect.arrayContaining([
          {
            __typename: "PostTag",
            id: expect.stringMatching(UUID_REGEX),
            name: "tag1",
            dateCreated: expect.stringMatching(DATE_REGEX),
            lastModified: null,
          },
          {
            __typename: "PostTag",
            id: expect.stringMatching(UUID_REGEX),
            name: "tag2",
            dateCreated: expect.stringMatching(DATE_REGEX),
            lastModified: null,
          },
          {
            __typename: "PostTag",
            id: expect.stringMatching(UUID_REGEX),
            name: "Test_Post TAG-3",
            dateCreated: expect.stringMatching(DATE_REGEX),
            lastModified: null,
          },
        ]),
        status: "SUCCESS",
      });
    });

    it.each(warn)("%s", async (_, tags, created, errorMsg) => {
      const payload = { query: CREATE_POST_TAGS, variables: { tags } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<CreateTagsWarning>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPostTags).toStrictEqual({
        __typename: "PostTagsWarning",
        tags: [
          {
            __typename: "PostTag",
            id: expect.stringMatching(UUID_REGEX),
            name: created[0],
            dateCreated: expect.stringMatching(DATE_REGEX),
            lastModified: null,
          },
          {
            __typename: "PostTag",
            id: expect.stringMatching(UUID_REGEX),
            name: created[1],
            dateCreated: expect.stringMatching(DATE_REGEX),
            lastModified: null,
          },
        ],
        message: errorMsg,
        status: "WARN",
      });
    });

    it.each(duplicate)("%s", async (_, tags, errorMsg) => {
      const payload = { query: CREATE_POST_TAGS, variables: { tags } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<CreateTags>(url, payload, options);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPostTags).toStrictEqual({
        __typename: "DuplicatePostTagError",
        message: errorMsg,
        status: "ERROR",
      });
    });
  });
});
