import { it, expect, describe, beforeAll, jest, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { db } from "@services/db";
import { supabaseEvent } from "@events/supabase";
import { startServer } from "@server";
import { registeredUser as mockUser } from "@utils/tests/mocks";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import loginTestUser from "@utils/tests/loginTestUser";
import post from "@utils/tests/post";
import { EDIT_PROFILE } from "@utils/tests/gqlQueries/settingsTestQueries";
import * as mocks from "./editProfile.testUtils";
import type { APIContext } from "@types";
import type { DbTestUser } from "types/tests";
import type { EditProfile } from "types/settings/editProfile";

jest.mock("@events/supabase");

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true).mockName("supabaseEvent.emit");

describe("Edit user profile", () => {
  let server: ApolloServer<APIContext>, url: string, user: DbTestUser;
  let registeredJwt: string, unregisteredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);

    user = registeredUser;

    const registered = loginTestUser(registeredUser.userUUID);
    const unRegistered = loginTestUser(unregisteredUser.userUUID);

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

      const { data, responseHeaders } = await post<EditProfile>(url, payload);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(mockEvent).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.editProfile).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to edit user profile",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, args, errors) => {
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
          id: user.userUUID,
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
          id: user.userUUID,
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
