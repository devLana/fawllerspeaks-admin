import { test, expect, describe, beforeAll, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";

import {
  post,
  REGISTER_USER,
  testUsers,
  testSession,
  loginTestUser,
  unRegisteredUser,
} from "@tests";

import type { APIContext, DbTestUser, TestData } from "@types";
import { Status } from "@resolverTypes";
import {
  gqlValidation,
  sessionCookies,
  userInput,
  validations,
  verifyE2eCookie,
} from "../registerUserTestUtils";

type RegisterUser = TestData<{ registerUser: Record<string, unknown> }>;

describe("Register user - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let unregisteredJwt: string, unregisteredSessionId: string;
  let unregisteredCookies: string, registeredJwt: string;
  let user: DbTestUser, registeredCookies: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { unregisteredUser, registeredUser } = await testUsers(db);
    user = unregisteredUser;

    const logInRegistered = loginTestUser(registeredUser.userId);
    const logInUnregistered = loginTestUser(unregisteredUser.userId);
    const unRegisteredSession = testSession(db, unregisteredUser.userId);
    const registeredSession = testSession(db, registeredUser.userId);

    [
      registeredJwt,
      unregisteredJwt,
      { cookies: unregisteredCookies, sessionId: unregisteredSessionId },
      { cookies: registeredCookies },
    ] = await Promise.all([
      logInRegistered,
      logInUnregistered,
      unRegisteredSession,
      registeredSession,
    ]);
  });

  afterAll(async () => {
    await db.query("DELETE FROM sessions");
    const clearUsers = db.query("DELETE FROM users");
    const stop = server.stop();
    await Promise.all([clearUsers, stop]);
    await db.end();
  });

  describe("Verify user authentication", () => {
    test("User is not logged in, Return an AuthenticationError response", async () => {
      const payload = { query: REGISTER_USER, variables: { userInput } };

      const { data } = await post<RegisterUser>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.registerUser).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to register user",
        status: Status.Error,
      });
    });
  });

  describe("Validate user input", () => {
    test.each(gqlValidation)(
      "Should throw a graphql validation error if the input values are %s",
      async (_, input) => {
        const variables = { userInput: input };
        const payload = { query: REGISTER_USER, variables };
        const options = { authorization: `Bearer ${unregisteredJwt}` };

        const { data } = await post<RegisterUser>(url, payload, options);

        expect(data.errors).toBeDefined();
        expect(data.data).toBeUndefined();
      }
    );

    test.each(validations(null))("%s", async (_, input, errors) => {
      const payload = { query: REGISTER_USER, variables: { userInput: input } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<RegisterUser>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.registerUser).toStrictEqual({
        __typename: "RegisterUserValidationError",
        firstNameError: errors.firstNameError,
        lastNameError: errors.lastNameError,
        passwordError: errors.passwordError,
        confirmPasswordError: errors.confirmPasswordError,
        status: Status.Error,
      });
    });
  });

  describe("Verify cookie request header", () => {
    test.each(verifyE2eCookie)(
      "Cookie request header has one or more %s, Return a NotAllowedError response",
      async (_, cookie) => {
        const payload = { query: REGISTER_USER, variables: { userInput } };
        const options = { authorization: `Bearer ${registeredJwt}`, cookie };

        const { data } = await post<RegisterUser>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.registerUser).toStrictEqual({
          __typename: "NotAllowedError",
          message: "Unable to register user",
          status: Status.Error,
        });
      }
    );
  });

  describe("Verify user session", () => {
    test("Return an UnknownError response if user session could not be verified with cookies", async () => {
      const payload = { query: REGISTER_USER, variables: { userInput } };
      const authorization = `Bearer ${registeredJwt}`;
      const options = { authorization, cookie: sessionCookies };

      const { data } = await post<RegisterUser>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.registerUser).toStrictEqual({
        __typename: "UnknownError",
        message: "Unable to register user",
        status: Status.Error,
      });
    });
  });

  describe("Verify user registration status", () => {
    test("User account already registered, Return a RegistrationError response", async () => {
      const payload = { query: REGISTER_USER, variables: { userInput } };
      const authorization = `Bearer ${registeredJwt}`;
      const options = { authorization, cookie: registeredCookies };

      const { data } = await post<RegisterUser>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.registerUser).toStrictEqual({
        __typename: "RegistrationError",
        message: "User is already registered",
        status: Status.Error,
      });
    });
  });

  describe("Successfully register a user", () => {
    test("Register an unregistered user, Send user details response", async () => {
      const payload = { query: REGISTER_USER, variables: { userInput } };
      const authorization = `Bearer ${unregisteredJwt}`;
      const options = { authorization, cookie: unregisteredCookies };

      const { data } = await post<RegisterUser>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.registerUser).toStrictEqual({
        __typename: "UserData",
        user: {
          __typename: "User",
          id: user.userId,
          email: unRegisteredUser.email,
          firstName: "Bart",
          lastName: "Simpson",
          image: null,
          isRegistered: true,
          dateCreated: +user.dateCreated,
          accessToken: unregisteredJwt,
          sessionId: unregisteredSessionId,
        },
        status: Status.Success,
      });
    });
  });
});
