import { test, expect, describe, beforeAll, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { db } from "@services/db";
import { startServer } from "@server";

import { EDIT_PROFILE, testUsers, loginTestUser, post } from "@tests";

import { Status } from "@resolverTypes";
import type { APIContext, DbTestUser, TestData } from "@types";

type EditProfile = TestData<{ editProfile: Record<string, unknown> }>;

describe("Edit user profile - E2E", () => {
  const variables = { firstName: "Ádè", lastName: "Lana" };

  let server: ApolloServer<APIContext>, url: string, user: DbTestUser;
  let registeredUserAccessToken: string, unRegisteredUserAccessToken: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser, unregisteredUser } = await testUsers(db);
    user = registeredUser;

    const registered = loginTestUser(registeredUser.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);

    [registeredUserAccessToken, unRegisteredUserAccessToken] =
      await Promise.all([registered, unRegistered]);
  });

  afterAll(async () => {
    const stop = server.stop();
    const clearUsers = db.query(`DELETE FROM users`);
    await Promise.all([stop, clearUsers]);
    await db.end();
  });

  test("Returns error on logged out user", async () => {
    const payload = {
      query: EDIT_PROFILE,
      variables: { firstName: "", lastName: "" },
    };

    const { data } = await post<EditProfile>(url, payload);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editProfile).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to edit user profile",
      status: Status.Error,
    });
  });

  test.each([
    ["null and undefined", { firstName: null, lastName: undefined }],
    ["number and boolean", { firstName: 754, lastName: false }],
  ])(
    "Should throw graphql validation error for %s input values",
    async (_, args) => {
      const payload = { query: EDIT_PROFILE, variables: args };

      const { data } = await post<EditProfile>(url, payload, {
        authorization: `Bearer ${registeredUserAccessToken}`,
      });

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    }
  );

  test.each([
    [
      "empty input values",
      { firstName: "", lastName: "" },
      { firstNameError: "Enter first name", lastNameError: "Enter last name" },
    ],
    [
      "empty password and password mismatch",
      { firstName: "   ", lastName: "  " },
      { firstNameError: "Enter first name", lastNameError: "Enter last name" },
    ],
    [
      "invalid password and password mismatch",
      { firstName: "Philip8", lastName: "Lana90" },
      {
        firstNameError: "First name cannot contain numbers",
        lastNameError: "Last name cannot contain numbers",
      },
    ],
  ])("Returns error for %s", async (_, args, errors) => {
    const payload = { query: EDIT_PROFILE, variables: args };

    const { data } = await post<EditProfile>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editProfile).toStrictEqual({
      __typename: "EditProfileValidationError",
      ...errors,
      status: Status.Error,
    });
  });

  test("Returns error on unregistered user", async () => {
    const payload = { query: EDIT_PROFILE, variables };

    const { data } = await post<EditProfile>(url, payload, {
      authorization: `Bearer ${unRegisteredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.editProfile).toStrictEqual({
      __typename: "RegistrationError",
      message: "Unable to edit user profile",
      status: Status.Error,
    });
  });

  test("Edits profile and updates user", async () => {
    const payload = { query: EDIT_PROFILE, variables };

    const { data } = await post<EditProfile>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data).not.toHaveProperty("message");

    expect(data.data?.editProfile).toStrictEqual({
      __typename: "EditedProfile",
      id: user.userId,
      firstName: variables.firstName,
      lastName: variables.lastName,
      status: Status.Success,
    });
  });
});
