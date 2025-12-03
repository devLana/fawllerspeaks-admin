import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { db } from "@services/db";
import { startServer } from "@server";
import { DELETE_POST_CONTENT_IMAGES as MUTATION } from "@utils/tests/gqlQueries/postsTestQueries";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import loginTestUser from "@utils/tests/loginTestUser";
import post from "@utils/tests/post";
import * as mocks from "./deletePostContentImages.testUtils";
import { deleteImages } from "@services/supabase/deleteImages";
import type { APIContext } from "@types";
import type { Result, DeleteData } from "types/posts/deletePostContentImages";

jest.mock("@services/supabase/deleteImages");

describe("Delete Post Content Images", () => {
  const mockFn = deleteImages as unknown as jest.MockedFunction<Result>;
  let server: ApolloServer<APIContext>, url: string;
  let registeredJwt: string, unregisteredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));

    const { registeredUser, unregisteredUser } = await testUsers(db);
    const registered = loginTestUser(registeredUser.userUUID);
    const unregistered = loginTestUser(unregisteredUser.userUUID);

    [registeredJwt, unregisteredJwt] = await Promise.all([
      registered,
      unregistered,
    ]);
  });

  afterAll(async () => {
    await db.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("User is not logged in, Expect an error response", async () => {
      const payload = { query: MUTATION, variables: { images: ["images"] } };
      const { data } = await post<DeleteData>(url, payload);

      expect(deleteImages).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();

      expect(data.data?.deletePostContentImages).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to delete post content image",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, images, messages) => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };
      const payload = { query: MUTATION, variables: { images } };
      const { data } = await post<DeleteData>(url, payload, options);

      expect(deleteImages).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();

      expect(data.data?.deletePostContentImages).toStrictEqual({
        __typename: "DeletePostContentImagesValidationError",
        imagesError: messages,
        status: "ERROR",
      });
    });

    describe("Images input array validated", () => {
      it("The input uri strings are not storage url strings, Expect an error object response", async () => {
        const images = mocks.nonStorageUris;
        const options = { authorization: `Bearer ${unregisteredJwt}` };
        const payload = { query: MUTATION, variables: { images } };
        const { data } = await post<DeleteData>(url, payload, options);

        expect(deleteImages).not.toHaveBeenCalled();
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        expect(data.data?.deletePostContentImages).toStrictEqual({
          __typename: "ForbiddenError",
          message: "Unable to delete post content image",
          status: "ERROR",
        });
      });
    });
  });

  describe("Verify logged in user", () => {
    it("The logged in user is unregistered, Expect an error response", async () => {
      const options = { authorization: `Bearer ${unregisteredJwt}` };
      const payload = { query: MUTATION, variables: { images: mocks.images } };
      const { data } = await post<DeleteData>(url, payload, options);

      expect(deleteImages).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();

      expect(data.data?.deletePostContentImages).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to delete post content image",
        status: "ERROR",
      });
    });
  });

  describe("DeleteData request failed", () => {
    it("Post content images request failed, Expect an error object response", async () => {
      mockFn.mockResolvedValueOnce({ error: "Request Failed" });

      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload = { query: MUTATION, variables: { images: mocks.images } };
      const { data } = await post<DeleteData>(url, payload, options);

      expect(deleteImages).toHaveBeenCalledTimes(1);
      expect(deleteImages).toHaveBeenCalledWith(mocks.storageUris);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();

      expect(data.data?.deletePostContentImages).toStrictEqual({
        __typename: "ServerError",
        message: "Unable to delete post content image",
        status: "ERROR",
      });
    });
  });

  describe("Images deleted", () => {
    it("Post content images deleted, Expect a success object response", async () => {
      mockFn.mockResolvedValueOnce({ error: null });

      const options = { authorization: `Bearer ${registeredJwt}` };
      const payload = { query: MUTATION, variables: { images: mocks.images } };
      const { data } = await post<DeleteData>(url, payload, options);

      expect(deleteImages).toHaveBeenCalledTimes(1);
      expect(deleteImages).toHaveBeenCalledWith(mocks.storageUris);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();

      expect(data.data?.deletePostContentImages).toStrictEqual({
        __typename: "Response",
        message: "Post content images deleted",
        status: "SUCCESS",
      });
    });
  });
});
