import { it, expect, describe, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { storageUrl } from "@services/supabase";
import { startServer } from "@server";
import { db } from "@services/db";
import { JWT_REGEX } from "@utils/tests/constants";
import { LOGIN } from "@utils/tests/gqlQueries/authTestQueries";
import { testUsers } from "@utils/tests/createTestUsers/testUsers";
import { registeredUser } from "@utils/tests/mocks";
import { post } from "@utils/tests/post";
import type { APIContext } from "@appTypes";
import type { DbTestUser } from "@appTypes/tests";
import type { LoginData } from "@appTypes/auth/login";

describe("Login", () => {
  let server: ApolloServer<APIContext>, url: string, user: DbTestUser;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    ({ registeredUser: user } = await testUsers(db));
  });

  afterAll(async () => {
    await db.query("Truncate TABLE sessions, users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Validate user input", () => {
    it.each([
      [
        "Should return a validation error response for empty email and password strings",
        { email: "", password: "" },
        ["Enter an e-mail address", "Enter password"],
      ],
      [
        "Should return a validation error response for an empty whitespace email string",
        { email: "   ", password: "   " },
        ["Enter an e-mail address", null],
      ],
      [
        "Should return a validation error response for an invalid email and empty password input strings",
        { email: "invalid_email", password: "grdte" },
        ["Invalid e-mail address", null],
      ],
    ])("%s", async (_, variables, errors) => {
      const { data } = await post<LoginData>(url, { query: LOGIN, variables });

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
    it.each([
      [
        "Should return an error response if the e-mail address is unknown",
        { email: "unknown_email@example.com", password: "pass_pass_apps" },
      ],
      [
        "Should return an error response if the e-mail & password combination is incorrect",
        { email: registeredUser.email, password: "password123" },
      ],
    ])("%s", async (_, variables) => {
      const { data } = await post<LoginData>(url, { query: LOGIN, variables });

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.login).toStrictEqual({
        __typename: "ForbiddenError",
        message: "Invalid email or password",
        status: "ERROR",
      });
    });
  });

  describe("Successfully log in user", () => {
    it("Should log the user in and return user details", async () => {
      const { email, password } = registeredUser;
      const payload = { query: LOGIN, variables: { email, password } };

      const { data, responseHeaders } = await post<LoginData>(url, payload);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/^auth/);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.login).not.toHaveProperty("password");
      expect(data.data?.login).toStrictEqual({
        __typename: "SessionData",
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
        status: "SUCCESS",
      });
    });
  });
});
