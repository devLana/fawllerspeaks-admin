import type { ApolloServer } from "@apollo/server";

import {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
  jest,
} from "@jest/globals";

import { db } from "@lib/db";
import { startServer } from "@server";

import { MailError } from "@utils/Errors";
import changePasswordMail from "../utils/changePasswordMail";
import {
  authCheck,
  gqlValidation,
  errorInput,
  validations,
  PASSWORD,
} from "../utils/changePassword.testUtils";
import { registeredUser } from "@tests/mocks";
import testUsers from "@tests/createTestUsers/testUsers";
import loginTestUser from "@tests/loginTestUser";
import post from "@tests/post";
import { CHANGE_PASSWORD } from "@tests/gqlQueries/settingsTestQueries";

import type { APIContext, TestData } from "@types";

type ChangePassword = TestData<{ changePassword: Record<string, unknown> }>;

jest.mock("../utils/changePasswordMail", () => {
  return jest.fn().mockName("changePasswordMail");
});

describe("Change password - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredJWT: string, unRegisteredJWT: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser: user, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(user.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);

    [registeredJWT, unRegisteredJWT] = await Promise.all([
      registered,
      unRegistered,
    ]);
  });

  afterAll(async () => {
    const stop = server.stop();
    const clearUsers = db.query(`DELETE FROM users`);
    await Promise.all([clearUsers, stop]);
    await db.end();
  });

  describe("Verify user authentication", () => {
    test("User is not logged in, Send an error response", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: authCheck };

      const { data } = await post<ChangePassword>(url, payload);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to change password",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    test.each(gqlValidation)("%s", async (_, variables) => {
      const payload = { query: CHANGE_PASSWORD, variables };
      const options = { authorization: `Bearer ${unRegisteredJWT}` };

      const { data } = await post<ChangePassword>(url, payload, options);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    test.each(validations(null))("%s", async (_, variables, errors) => {
      const payload = { query: CHANGE_PASSWORD, variables: { ...variables } };
      const options = { authorization: `Bearer ${unRegisteredJWT}` };

      const { data } = await post<ChangePassword>(url, payload, options);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "ChangePasswordValidationError",
        ...errors,
        status: "ERROR",
      });
    });
  });

  describe("Verify user registration status", () => {
    test("Should send an error response if the user is unregistered", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: errorInput };
      const options = { authorization: `Bearer ${unRegisteredJWT}` };

      const { data } = await post<ChangePassword>(url, payload, options);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to change password",
        status: "ERROR",
      });
    });
  });

  describe("Verify user's current password", () => {
    test("Should send an error response if the current password does not match the user's password", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: errorInput };
      const options = { authorization: `Bearer ${registeredJWT}` };

      const { data } = await post<ChangePassword>(url, payload, options);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "NotAllowedError",
        message: "Unable to change password",
        status: "ERROR",
      });
    });
  });

  describe("Change user password", () => {
    test("Should change the user's password and send a confirmation mail", async () => {
      const options = { authorization: `Bearer ${registeredJWT}` };
      const payload = {
        query: CHANGE_PASSWORD,
        variables: {
          currentPassword: registeredUser.password,
          newPassword: PASSWORD,
          confirmNewPassword: PASSWORD,
        },
      };

      const { data } = await post<ChangePassword>(url, payload, options);

      expect(changePasswordMail).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "Response",
        message: "Password changed",
        status: "SUCCESS",
      });
    });

    test("Confirmation mail fails to send, Revert all updates and send an error response", async () => {
      const mock = changePasswordMail as jest.MockedFunction<() => never>;
      const options = { authorization: `Bearer ${registeredJWT}` };
      const variables = {
        currentPassword: PASSWORD,
        newPassword: "newPassW3!ord1@",
        confirmNewPassword: "newPassW3!ord1@",
      };
      const payload = { query: CHANGE_PASSWORD, variables };

      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const { data } = await post<ChangePassword>(url, payload, options);

      expect(changePasswordMail).toHaveBeenCalledTimes(1);
      expect(changePasswordMail).toThrow("Unable to send mail");
      expect(changePasswordMail).toThrow(MailError);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "ServerError",
        message: "Unable to send mail",
        status: "ERROR",
      });
    });
  });
});
