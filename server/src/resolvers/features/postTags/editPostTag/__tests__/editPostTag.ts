import { randomUUID } from "node:crypto";

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import { EDIT_POST_TAG } from "@utils/tests/gqlQueries/postTagsTestQueries";
import post from "@utils/tests/post";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import loginTestUser from "@utils/tests/loginTestUser";
import createTestPostTags from "@utils/tests/createTestPostTags";
import { DATE_REGEX } from "@utils/tests/constants";
import type { APIContext } from "@types";
import type { PostTag } from "@resolverTypes";
import type { EditTag } from "types/postTags/editPostTag";

describe("Edit post tags", () => {
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
    it.each([
      [
        "Should return a validation error for empty tag id and name input strings",
        { tagId: "", name: "" },
        ["Provide post tag id", "Provide post tag name"],
      ],
      [
        "Should return a validation error for empty whitespace tag id and name input strings",
        { tagId: " ", name: "    " },
        ["Provide post tag id", "Provide post tag name"],
      ],
      [
        "Should return a validation error for an invalid post tag id",
        { tagId: "tagId", name: "name" },
        ["Invalid post tag id", null],
      ],
    ])("%s", async (_, variables, errors) => {
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
        message: `Post tag not updated. New post tag name is the same as the old one`,
      });
    });
  });

  describe("Edit post tag", () => {
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
