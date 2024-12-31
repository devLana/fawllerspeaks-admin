import { it, expect, describe, beforeAll, jest, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { db } from "@lib/db";
import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import { startServer } from "@server";

import { registeredUser as mockUser } from "@tests/mocks";
import testUsers from "@tests/createTestUsers/testUsers";
import loginTestUser from "@tests/loginTestUser";
import post from "@tests/post";
import { EDIT_PROFILE } from "@tests/gqlQueries/settingsTestQueries";
import * as mocks from "../utils/editProfile.testUtils";

import type { APIContext, DbTestUser, TestData } from "@types";

type EditProfile = TestData<{ editProfile: Record<string, unknown> }>;

jest.mock("@lib/supabase/supabaseEvent");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true).mockName("supabaseEvent.emit");

describe("Edit user profile - E2E", () => {
  let server: ApolloServer<APIContext>, url: string, user: DbTestUser;
  let registeredJwt: string, unregisteredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    user = registeredUser;

    const registered = loginTestUser(registeredUser.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);

    [registeredJwt, unregisteredJwt] = await Promise.all([
      registered,
      unRegistered,
    ]);
  });

  afterAll(async () => {
    await db.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("Should send an error response if the user is not logged in", async () => {
      const input = { firstName: "", lastName: "" };
      const payload = { query: EDIT_PROFILE, variables: input };

      const { data } = await post<EditProfile>(url, payload);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editProfile).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to edit user profile",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations(null))("%s", async (_, args, errors) => {
      const payload = { query: EDIT_PROFILE, variables: args };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditProfile>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editProfile).toStrictEqual({
        __typename: "EditProfileValidationError",
        ...errors,
        status: "ERROR",
      });
    });
  });

  describe("Verify user registration status", () => {
    it("Should respond with an error if the user is unregistered", async () => {
      const variables = { ...mocks.args, image: "image/string/path" };
      const payload = { query: EDIT_PROFILE, variables };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<EditProfile>(url, payload, options);

      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editProfile).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to edit user profile",
        status: "ERROR",
      });
    });
  });

  describe("Edit user details", () => {
    it("Should edit the user's profile without an input image", async () => {
      const payload = { query: EDIT_PROFILE, variables: mocks.args };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditProfile>(url, payload, options);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data).not.toHaveProperty("message");
      expect(data.data?.editProfile).toStrictEqual({
        __typename: "EditedProfile",
        user: {
          __typename: "User",
          id: user.userId,
          email: mockUser.email,
          firstName: mocks.args.firstName,
          lastName: mocks.args.lastName,
          image: mocks.storageImage,
          isRegistered: mockUser.registered,
          dateCreated: user.dateCreated,
        },
        status: "SUCCESS",
      });
    });

    it("Should edit the user's profile with an image", async () => {
      const variables = { ...mocks.args, image: mocks.image };
      const payload = { query: EDIT_PROFILE, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditProfile>(url, payload, options);

      expect(mockEvent).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data).not.toHaveProperty("message");
      expect(data.data?.editProfile).toStrictEqual({
        __typename: "EditedProfile",
        user: {
          __typename: "User",
          id: user.userId,
          email: mockUser.email,
          firstName: mocks.args.firstName,
          lastName: mocks.args.lastName,
          image: mocks.userImage,
          isRegistered: mockUser.registered,
          dateCreated: user.dateCreated,
        },
        status: "SUCCESS",
      });
    });
  });
});
