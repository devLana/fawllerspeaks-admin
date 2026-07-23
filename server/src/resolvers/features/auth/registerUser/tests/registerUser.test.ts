import { test, expect, describe, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import { userInput, validations } from "./registerUser.testUtils";
import { REGISTER_USER } from "@utils/tests/gqlQueries/authTestQueries";
import { testUsers } from "@utils/tests/createTestUsers/testUsers";
import { loginTestUser } from "@utils/tests/loginTestUser";
import { unRegisteredUser } from "@utils/tests/mocks";
import { post } from "@utils/tests/post";
import type { APIContext } from "@appTypes";
import type { DbTestUser } from "@appTypes/tests";
import type { RegisterUserData as Data } from "@appTypes/auth/registerUser";

describe("Register user", () => {
  let server: ApolloServer<APIContext>, url: string, user: DbTestUser;
  let unregisteredJwt: string, registeredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { unregisteredUser, registeredUser } = await testUsers(db);
    const logInRegistered = loginTestUser(registeredUser.userUUID);
    const logInUnregistered = loginTestUser(unregisteredUser.userUUID);
    user = unregisteredUser;

    [registeredJwt, unregisteredJwt] = await Promise.all([
      logInRegistered,
      logInUnregistered,
    ]);
  });

  afterAll(async () => {
    await db.query("Truncate TABLE users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    test("User is not logged in, Return an error response", async () => {
      const payload = { query: REGISTER_USER, variables: { userInput } };

      const { data, responseHeaders } = await post<Data>(url, payload);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.registerUser).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to register user",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    test.each(validations)("%s", async (_, input, errors) => {
      const payload = { query: REGISTER_USER, variables: { userInput: input } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<Data>(url, payload, options);

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

      const { data } = await post<Data>(url, payload, options);

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

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.registerUser).toStrictEqual({
        __typename: "RegisteredUser",
        user: {
          __typename: "User",
          id: user.userUUID,
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
