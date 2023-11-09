import { randomUUID } from "node:crypto";

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import {
  post,
  EDIT_POST_TAG,
  testUsers,
  loginTestUser,
  createTestPostTags,
} from "@tests";

import type { APIContext, TestData } from "@types";
import type { PostTag } from "@resolverTypes";
import { DATE_REGEX } from "@utils";
import { gqlValidations, validations } from "../utils/editPostTag.testUtils";

type EditTag = TestData<{ editPostTag: Record<string, unknown> }>;

describe("Edit post tags - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredJwt: string, unRegisteredJwt: string;
  let postTags: PostTag[];

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(registeredUser.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);
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
      const variables = { tagId: "", name: "" };
      const payload = { query: EDIT_POST_TAG, variables };

      const { data } = await post<EditTag>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPostTag).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to edit post tag",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(gqlValidations)("%s", async (_, variables) => {
      const options = { authorization: `Bearer ${unRegisteredJwt}` };
      const payload = { query: EDIT_POST_TAG, variables };

      const { data } = await post<EditTag>(url, payload, options);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    it.each(validations(null))("%s", async (_, variables, errors) => {
      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload = { query: EDIT_POST_TAG, variables };

      const { data } = await post<EditTag>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPostTag).toStrictEqual({
        __typename: "EditPostTagValidationError",
        tagIdError: errors[0],
        nameError: errors[1],
        status: "ERROR",
      });
    });
  });

  describe("Verify user", () => {
    it("Should return an error response if the user is unregistered", async () => {
      const variables = { tagId: postTags[0].id, name: postTags[0].name };
      const payload = { query: EDIT_POST_TAG, variables };
      const options = { authorization: `Bearer ${unRegisteredJwt}` };

      const { data } = await post<EditTag>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPostTag).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to edit post tag",
        status: "ERROR",
      });
    });
  });

  describe("Verify post tag id", () => {
    it("Should respond with an error if the provided post tag id does not exist", async () => {
      const variables = { tagId: randomUUID(), name: "newTag" };
      const payload = { query: EDIT_POST_TAG, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditTag>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPostTag).toStrictEqual({
        __typename: "UnknownError",
        message: "The post tag you are trying to edit does not exist",
        status: "ERROR",
      });
    });
  });

  describe("Verify input post tag name, Return a DuplicatePostTagError response", () => {
    it("Should return an error response if the post tag name already exists", async () => {
      const variables = { tagId: postTags[2].id, name: postTags[3].name };
      const payload = { query: EDIT_POST_TAG, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditTag>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPostTag).toStrictEqual({
        __typename: "DuplicatePostTagError",
        message: `A post tag with the name "${variables.name}" already exists`,
        status: "ERROR",
      });
    });

    it("Should return an error response if a similar post tag name already exists", async () => {
      const [, , , { id }, { name }] = postTags;
      const variables = { tagId: id, name: name.toUpperCase() };
      const payload = { query: EDIT_POST_TAG, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditTag>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPostTag).toStrictEqual({
        __typename: "DuplicatePostTagError",
        message: `A similar post tag, "${name}", already exists`,
        status: "ERROR",
      });
    });
  });

  describe("Respond with an edited post tag warning object", () => {
    it("New post tag name equals old post tag name, Respond with the same post tag info", async () => {
      const variables = { tagId: postTags[0].id, name: postTags[0].name };
      const payload = { query: EDIT_POST_TAG, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditTag>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPostTag).toStrictEqual({
        __typename: "EditedPostTagWarning",
        tag: { __typename: "PostTag", ...postTags[0] },
        status: "WARN",
        message:
          "Post tag not updated. New post tag name is the same as the old one",
      });
    });
  });

  describe("Edit post tag", () => {
    it("Should update the post tag if the new post tag name equals old post tag name but differs by case sensitivity", async () => {
      const [, { id, name, dateCreated }] = postTags;
      const variables = { tagId: id, name: name.toUpperCase() };
      const payload = { query: EDIT_POST_TAG, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditTag>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPostTag).toStrictEqual({
        __typename: "EditedPostTag",
        tag: {
          __typename: "PostTag",
          id,
          name: variables.name,
          lastModified: expect.stringMatching(DATE_REGEX),
          dateCreated,
        },
        status: "SUCCESS",
      });
    });

    it("Should edit the post tag with a new name and update its lastModified value", async () => {
      const variables = { tagId: postTags[0].id, name: "name not in db" };
      const payload = { query: EDIT_POST_TAG, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditTag>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editPostTag).toStrictEqual({
        __typename: "EditedPostTag",
        tag: {
          __typename: "PostTag",
          id: postTags[0].id,
          name: variables.name,
          lastModified: expect.stringMatching(DATE_REGEX),
          dateCreated: postTags[0].dateCreated,
        },
        status: "SUCCESS",
      });
    });
  });
});
