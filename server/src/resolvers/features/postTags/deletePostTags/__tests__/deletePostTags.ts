import { randomUUID } from "node:crypto";

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { db } from "@services/db";
import { startServer } from "@server";
import { DELETE_POST_TAGS } from "@utils/tests/gqlQueries/postTagsTestQueries";
import post from "@utils/tests/post";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import loginTestUser from "@utils/tests/loginTestUser";
import createTestPostTags from "@utils/tests/createTestPostTags";
import type { APIContext } from "@types";
import type { PostTag } from "@resolverTypes";
import type { DeleteTags } from "types/postTags/deletePostTags";

describe("Delete post tags", () => {
  const UUID = randomUUID();
  let server: ApolloServer<APIContext>, url: string;
  let registeredJwt: string, unRegisteredJwt: string;
  let postTags: PostTag[];

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(registeredUser.userUUID);
    const unRegistered = loginTestUser(unregisteredUser.userUUID);
    const createPostTags = createTestPostTags(db);

    [registeredJwt, unRegisteredJwt, postTags] = await Promise.all([
      registered,
      unRegistered,
      createPostTags,
    ]);
  });

  afterAll(async () => {
    await db.query("TRUNCATE TABLE users, post_tags RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("Should respond with an error if the user is not logged in", async () => {
      const payload = { query: DELETE_POST_TAGS, variables: { tagIds: [] } };

      const { data } = await post<DeleteTags>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.deletePostTags).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to delete post tag",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each([
      [
        "Should return a validation error if the input array is empty",
        [],
        "No post tag provided",
      ],
      [
        "Should return a validation error for an array of empty strings or empty whitespace strings",
        ["", "   "],
        "Input tag ids cannot be empty strings",
      ],
      [
        "Should return a validation error if the strings in the input array are not unique ids",
        [UUID, UUID, UUID],
        "No duplicate tags allowed. Input tag ids must be unique",
      ],
      [
        "Should return a validation error if the array input contains an invalid post tag id",
        ["id1", "id2"],
        "Invalid post tag id",
      ],
    ])("%s", async (_, tagIds, errorMsg) => {
      const payload = { query: DELETE_POST_TAGS, variables: { tagIds } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DeleteTags>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.deletePostTags).toStrictEqual({
        __typename: "DeletePostTagsValidationError",
        tagIdsError: errorMsg,
        status: "ERROR",
      });
    });
  });

  describe("Verify user verification status", () => {
    it("Should return an error response if the user is unregistered", async () => {
      const variables = { tagIds: [UUID, randomUUID()] };
      const payload = { query: DELETE_POST_TAGS, variables };
      const options = { authorization: `Bearer ${unRegisteredJwt}` };

      const { data } = await post<DeleteTags>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.deletePostTags).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to delete post tags",
        status: "ERROR",
      });
    });
  });

  describe("Delete post tags", () => {
    it("Should delete all post tags provided in the input array", async () => {
      const [tag1, tag2] = postTags;
      const variables = { tagIds: [tag1.id, tag2.id] };
      const payload = { query: DELETE_POST_TAGS, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DeleteTags>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.deletePostTags).toStrictEqual({
        __typename: "DeletedPostTags",
        tagIds: expect.arrayContaining([tag1.id, tag2.id]),
        status: "SUCCESS",
      });
    });

    it("Should respond with a message if at least one post tag could not be deleted", async () => {
      const [tag1, tag2, tag3, tag4] = postTags;
      const variables = { tagIds: [tag1.id, tag2.id, tag3.id, tag4.id] };
      const payload = { query: DELETE_POST_TAGS, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DeleteTags>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.deletePostTags).toStrictEqual({
        __typename: "DeletedPostTagsWarning",
        tagIds: expect.arrayContaining([tag3.id, tag4.id]),
        message: "2 out of 4 post tags deleted",
        status: "WARN",
      });
    });
  });

  describe("No post tag could be deleted", () => {
    it("Should respond with an error if the one selected post tag could be deleted", async () => {
      const [tag1] = postTags;
      const variables = { tagIds: [tag1.id] };
      const payload = { query: DELETE_POST_TAGS, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DeleteTags>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.deletePostTags).toStrictEqual({
        __typename: "NotFoundError",
        message: "The selected post tag could not be deleted",
        status: "ERROR",
      });
    });

    it("Should respond with an error if all the multiple post tags selected could be deleted", async () => {
      const [tag1, tag2, tag3, tag4] = postTags;
      const variables = { tagIds: [tag1.id, tag2.id, tag3.id, tag4.id] };
      const payload = { query: DELETE_POST_TAGS, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DeleteTags>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.deletePostTags).toStrictEqual({
        __typename: "NotFoundError",
        message: "None of the selected post tags could be deleted",
        status: "ERROR",
      });
    });
  });
});
