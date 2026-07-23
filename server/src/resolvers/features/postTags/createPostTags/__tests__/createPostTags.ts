import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { db } from "@services/db";
import { startServer } from "@server";
import { CREATE_POST_TAGS } from "@utils/tests/gqlQueries/postTagsTestQueries";
import { testUsers } from "@utils/tests/createTestUsers/testUsers";
import { loginTestUser } from "@utils/tests/loginTestUser";
import { post } from "@utils/tests/post";
import { DATE_REGEX, UUID_REGEX } from "@utils/tests/constants";
import type { APIContext } from "@appTypes";
import type { Tags, Success, Warning } from "@appTypes/postTags/createPostTags";

describe("Create post tags", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredJwt: string, unRegisteredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(registeredUser.userUUID);
    const unRegistered = loginTestUser(unregisteredUser.userUUID);

    [registeredJwt, unRegisteredJwt] = await Promise.all([
      registered,
      unRegistered,
    ]);
  });

  afterAll(async () => {
    await db.query("TRUNCATE TABLE users, post_tags RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("Should respond with an error response if the user is not logged in", async () => {
      const payload = { query: CREATE_POST_TAGS, variables: { tags: ["tag"] } };

      const { data, responseHeaders } = await post<Tags>(url, payload);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPostTags).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to create post tag",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each([
      [
        "Should return a validation error for an array input that exceeds the maximum limit of 10",
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"],
        "Input tags can only contain at most 10 tags",
      ],
      [
        "Should return a validation error for an empty input array",
        [],
        "No post tags were provided",
      ],
      [
        "Should return a validation error for an array of empty strings & empty whitespace strings",
        ["", "   "],
        "Input tags cannot contain empty values",
      ],
      [
        "Should return a validation error for an array of duplicate input strings",
        ["tag a", "tagA", "b"],
        "Input tags can only contain unique tags",
      ],
    ])("%s", async (_, tags, errorMsg) => {
      const payload = { query: CREATE_POST_TAGS, variables: { tags } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Tags>(url, payload, options);

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

      const { data } = await post<Tags>(url, payload, options);

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

      const { data } = await post<Success>(url, payload, options);

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

    it("%Should create new post tags and respond with a warning message if only one input post tag already exists", async () => {
      const tags = ["Test_Post TAG-3", "tag4", "tag5"];
      const payload = { query: CREATE_POST_TAGS, variables: { tags } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Warning>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPostTags).toStrictEqual({
        __typename: "CreatedPostTagsWarning",
        tags: [
          {
            __typename: "PostTag",
            id: expect.stringMatching(UUID_REGEX),
            name: "tag4",
            dateCreated: expect.stringMatching(DATE_REGEX),
            lastModified: null,
          },
          {
            __typename: "PostTag",
            id: expect.stringMatching(UUID_REGEX),
            name: "tag5",
            dateCreated: expect.stringMatching(DATE_REGEX),
            lastModified: null,
          },
        ],
        message: `2 post tags created. 1 of the post tags provided already exist`,
        status: "WARN",
      });
    });

    it("Should create a new post tag and respond with a warning message if more than one input post tag already exists", async () => {
      const tags = ["tag1", "tag2", "tag4", "tag5", "TAG 6"];
      const payload = { query: CREATE_POST_TAGS, variables: { tags } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Warning>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPostTags).toStrictEqual({
        __typename: "CreatedPostTagsWarning",
        tags: [
          {
            __typename: "PostTag",
            id: expect.stringMatching(UUID_REGEX),
            name: "TAG 6",
            dateCreated: expect.stringMatching(DATE_REGEX),
            lastModified: null,
          },
        ],
        message: `1 post tag created. 4 of the post tags provided already exist`,
        status: "WARN",
      });
    });

    it.each([
      [
        "Should respond with an error if all the provided input post tags already exist",
        ["tag1", "tag2", "tag4", "tag5", "TAG 6"],
        "Post tags with similar names to the ones provided already exist",
      ],
      [
        "Should respond with an error if the only provided input post tag already exists",
        ["Test_Post TAG-3"],
        "A post tag with a similar name to the one provided already exists",
      ],
    ])("%s", async (_, tags, errorMsg) => {
      const payload = { query: CREATE_POST_TAGS, variables: { tags } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Tags>(url, payload, options);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createPostTags).toStrictEqual({
        __typename: "ForbiddenError",
        message: errorMsg,
        status: "ERROR",
      });
    });
  });
});
