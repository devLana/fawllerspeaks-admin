import {
  test,
  expect,
  describe,
  beforeAll,
  jest,
  afterEach,
  afterAll,
} from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { db } from "@lib/db";
import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import { startServer } from "@server";

import {
  EDIT_PROFILE,
  testUsers,
  registeredUser as mockUser,
  loginTestUser,
  post,
} from "@tests";
import {
  args as variables,
  gqlValidate,
  validations,
  edit,
} from "../utils/editProfile.testUtils";

import type { APIContext, DbTestUser, TestData } from "@types";

type EditProfile = TestData<{ editProfile: Record<string, unknown> }>;

jest.mock("@lib/supabase/supabaseEvent");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true);

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    const stop = server.stop();
    const clearUsers = db.query(`DELETE FROM users`);
    await Promise.all([stop, clearUsers]);
    await db.end();
  });

  describe("Verify user authentication", () => {
    test("Should send an error response if the user is not logged in", async () => {
      const input = { firstName: "", lastName: "" };
      const payload = { query: EDIT_PROFILE, variables: input };

      const { data } = await post<EditProfile>(url, payload);

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
    test.each(gqlValidate)("%s", async (_, args) => {
      const payload = { query: EDIT_PROFILE, variables: args };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditProfile>(url, payload, options);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    test.each(validations(null))("%s", async (_, args, errors) => {
      const payload = { query: EDIT_PROFILE, variables: args };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditProfile>(url, payload, options);

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
    test("Should respond with an error if the user is unregistered", async () => {
      const payload = { query: EDIT_PROFILE, variables };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<EditProfile>(url, payload, options);

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
    test.each(edit)("%s", async (_, args, image) => {
      const payload = { query: EDIT_PROFILE, variables: args };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<EditProfile>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();

      expect(data.data).not.toHaveProperty("message");

      expect(data.data?.editProfile).toStrictEqual({
        __typename: "EditedProfile",
        user: {
          __typename: "User",
          id: user.userId,
          email: mockUser.email,
          firstName: variables.firstName,
          lastName: variables.lastName,
          image,
          isRegistered: mockUser.registered,
          dateCreated: user.dateCreated,
        },
        status: "SUCCESS",
      });
    });
  });
});
