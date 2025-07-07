import { test, expect, describe, beforeAll, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import supabase from "@lib/supabase/supabaseClient";
import { JWT_REGEX, SESSION_ID_REGEX } from "@tests/constants";

import { startServer } from "@server";
import { db } from "@lib/db";

import * as mocks from "../utils/login.testUtils";
import { LOGIN } from "@tests/gqlQueries/authTestQueries";
import post from "@tests/post";
import testUsers from "@tests/createTestUsers/testUsers";
import { registeredUser } from "@tests/mocks";

import type { APIContext, DbTestUser, TestData } from "@types";

type Login = TestData<{ login: Record<string, unknown> }>;

describe("Login - E2E", () => {
  let server: ApolloServer<APIContext>, url: string, user: DbTestUser;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    ({ registeredUser: user } = await testUsers(db));
  });

  afterAll(async () => {
    const clearSessions = db.query("DELETE FROM sessions");
    const stop = server.stop();
    await Promise.all([clearSessions, stop]);
    await db.query(`DELETE FROM users`);
    await db.end();
  });

  describe("Validate user input", () => {
    test.each(mocks.gqlValidation)("%s", async (_, variables) => {
      const { data } = await post<Login>(url, { query: LOGIN, variables });

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    test.each(mocks.validations(null))("%s", async (_, variables, errors) => {
      const { data } = await post<Login>(url, { query: LOGIN, variables });

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.login).toStrictEqual({
        __typename: "LoginValidationError",
        emailError: errors[0],
        passwordError: errors[1],
        status: "ERROR",
      });
    });
  });

  describe("Verify e-mail and password", () => {
    test.each(mocks.verifyInputs)("%s", async (_, variables) => {
      const { data } = await post<Login>(url, { query: LOGIN, variables });

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.login).toStrictEqual({
        __typename: "NotAllowedError",
        message: "Invalid email or password",
        status: "ERROR",
      });
    });
  });

  describe("Successfully log in user", () => {
    test("Should log the user in and return user details", async () => {
      const { email, password } = registeredUser;
      const { storageUrl } = supabase();
      const payload = { query: LOGIN, variables: { email, password } };

      const { data, responseHeaders } = await post<Login>(url, payload);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(3);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/^auth/);
      expect(responseHeaders["set-cookie"]?.[1]).toMatch(/^token/);
      expect(responseHeaders["set-cookie"]?.[2]).toMatch(/^sig/);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.login).not.toHaveProperty("password");
      expect(data.data?.login).toStrictEqual({
        __typename: "LoggedInUser",
        user: {
          __typename: "User",
          email: registeredUser.email,
          id: user.userUUID,
          firstName: registeredUser.firstName,
          lastName: registeredUser.lastName,
          image: `${storageUrl}${registeredUser.image}`,
          isRegistered: registeredUser.registered,
          dateCreated: user.dateCreated,
        },
        accessToken: expect.stringMatching(JWT_REGEX),
        sessionId: expect.stringMatching(SESSION_ID_REGEX),
        status: "SUCCESS",
      });
    });
  });
});
