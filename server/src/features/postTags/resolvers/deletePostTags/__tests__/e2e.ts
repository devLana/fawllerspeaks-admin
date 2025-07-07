import { randomUUID } from "node:crypto";
// import { Worker } from "node:worker_threads";

// import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

// import deletePostTagsWorker from "../deletePostTagsWorker";

import { db } from "@lib/db";
import { startServer } from "@server";

import { DELETE_POST_TAGS } from "@tests/gqlQueries/postTagsTestQueries";
import post from "@tests/post";
import testUsers from "@tests/createTestUsers/testUsers";
import loginTestUser from "@tests/loginTestUser";
import createTestPostTags from "@tests/createTestPostTags";
import {
  gqlValidate,
  uuid,
  validations,
} from "../utils/deletePostTags.testUtils";

import type { APIContext, TestData } from "@types";
import type { PostTag } from "@resolverTypes";

type DeleteTags = TestData<{ deletePostTags: Record<string, unknown> }>;

// jest.mock("../deletePostTagsWorker");
// jest.mock("node:worker_threads");

describe("Delete post tags - E2E", () => {
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
    const clearPostTags = db.query(`DELETE FROM post_tags`);
    const clearUsers = db.query(`DELETE FROM users`);
    const stop = server.stop();
    await Promise.all([clearPostTags, clearUsers, stop]);
    await db.end();
  });

  describe("Verify user authentication", () => {
    it("Should respond with an error if the user is not logged in", async () => {
      const payload = { query: DELETE_POST_TAGS, variables: { tagIds: [] } };

      const { data } = await post<DeleteTags>(url, payload);

      // expect(Worker).not.toHaveBeenCalled();
      // expect(deletePostTagsWorker).not.toHaveBeenCalled();

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.deletePostTags).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to delete post tag",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(gqlValidate)("%s", async (_, tagIds) => {
      const payload = { query: DELETE_POST_TAGS, variables: { tagIds } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DeleteTags>(url, payload, options);

      // expect(Worker).not.toHaveBeenCalled();
      // expect(deletePostTagsWorker).not.toHaveBeenCalled();

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    it.each(validations)("%s", async (_, tagIds, errorMsg) => {
      const payload = { query: DELETE_POST_TAGS, variables: { tagIds } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DeleteTags>(url, payload, options);

      // expect(Worker).not.toHaveBeenCalled();
      // expect(deletePostTagsWorker).not.toHaveBeenCalled();

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
      const variables = { tagIds: [uuid, randomUUID()] };
      const payload = { query: DELETE_POST_TAGS, variables };
      const options = { authorization: `Bearer ${unRegisteredJwt}` };

      const { data } = await post<DeleteTags>(url, payload, options);

      // expect(Worker).not.toHaveBeenCalled();
      // expect(deletePostTagsWorker).not.toHaveBeenCalled();

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

      // expect(Worker).toHaveBeenCalledTimes(1);
      // expect(deletePostTagsWorker).toHaveBeenCalledTimes(1);
    });

    it("Delete post tags, Respond with a message if at least one post tag could not be deleted", async () => {
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
        message: `${tag3.name} and 1 other post tag deleted. 2 post tags could not be deleted`,
        status: "WARN",
      });

      // expect(Worker).toHaveBeenCalledTimes(1);
      // expect(deletePostTagsWorker).toHaveBeenCalledTimes(1);
    });
  });

  describe("No post tag could be deleted", () => {
    it("Should respond with an error if no post tag could be deleted", async () => {
      const [tag1, tag2, tag3, tag4] = postTags;
      const variables = { tagIds: [tag1.id, tag2.id, tag3.id, tag4.id] };
      const payload = { query: DELETE_POST_TAGS, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<DeleteTags>(url, payload, options);

      // expect(Worker).not.toHaveBeenCalled();
      // expect(deletePostTagsWorker).not.toHaveBeenCalled();

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.deletePostTags).toStrictEqual({
        __typename: "UnknownError",
        message: "The provided post tags could not be deleted",
        status: "ERROR",
      });
    });
  });
});
