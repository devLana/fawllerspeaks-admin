import { test, expect, describe, beforeAll, afterAll } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import {
  gqlValidation,
  userInput,
  validations,
} from "../utils/registerUser.testUtils";

import { REGISTER_USER } from "@tests/gqlQueries/authTestQueries";
import testUsers from "@tests/createTestUsers/testUsers";
import loginTestUser from "@tests/loginTestUser";
import { unRegisteredUser } from "@tests/mocks";
import post from "@tests/post";

import type { APIContext, DbTestUser, TestData } from "@types";

type RegisterUser = TestData<{ registerUser: Record<string, unknown> }>;

describe("Register user - E2E", () => {
  let server: ApolloServer<APIContext>, url: string, user: DbTestUser;
  let unregisteredJwt: string, registeredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { unregisteredUser, registeredUser } = await testUsers(db);
    user = unregisteredUser;

    const logInRegistered = loginTestUser(registeredUser.userId);
    const logInUnregistered = loginTestUser(unregisteredUser.userId);

    [registeredJwt, unregisteredJwt] = await Promise.all([
      logInRegistered,
      logInUnregistered,
    ]);
  });

  afterAll(async () => {
    const clearUsers = db.query("DELETE FROM users");
    const stop = server.stop();
    await Promise.all([clearUsers, stop]);
    await db.end();
  });

  describe("Verify user authentication", () => {
    test("User is not logged in, Return an error response", async () => {
      const payload = { query: REGISTER_USER, variables: { userInput } };

      const { data } = await post<RegisterUser>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.registerUser).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to register user",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    test.each(gqlValidation)("%s", async (_, input) => {
      const variables = { userInput: input };
      const payload = { query: REGISTER_USER, variables };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<RegisterUser>(url, payload, options);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

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
        status: "ERROR",
      });
    });
  });

  describe("Verify user registration status", () => {
    test("User account already registered, Return an error response", async () => {
      const payload = { query: REGISTER_USER, variables: { userInput } };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<RegisterUser>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.registerUser).toStrictEqual({
        __typename: "RegistrationError",
        message: "User is already registered",
        status: "ERROR",
      });
    });
  });

  describe("Successfully register a user", () => {
    test("Register an unregistered user, Send user details response", async () => {
      const payload = { query: REGISTER_USER, variables: { userInput } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<RegisterUser>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.registerUser).toStrictEqual({
        __typename: "RegisteredUser",
        user: {
          __typename: "User",
          id: user.userId,
          email: unRegisteredUser.email,
          firstName: "Bart",
          lastName: "Simpson",
          image: null,
          isRegistered: true,
          dateCreated: user.dateCreated,
        },
        status: "SUCCESS",
      });
    });
  });
});
