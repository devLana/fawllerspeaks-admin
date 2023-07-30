import type { ApolloServer } from "@apollo/server";

import {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
  jest,
} from "@jest/globals";

import { db } from "@services/db";
import { startServer } from "@server";

import { MailError } from "@utils";
import changePasswordMail from "../utils/changePasswordMail";
import {
  authCheck,
  gqlValidation,
  errorInput,
  validations,
  PASSWORD,
} from "../utils/changePasswordTestUtils";
import {
  CHANGE_PASSWORD,
  testUsers,
  loginTestUser,
  post,
  registeredUser,
} from "@tests";

import type { APIContext, TestData } from "@types";
import { Status } from "@resolverTypes";

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
    test("User is not logged in, Return an AuthenticationError response", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: authCheck };

      const { data } = await post<ChangePassword>(url, payload);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to change password",
        status: Status.Error,
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
        status: Status.Error,
      });
    });
  });

  describe("Verify user registration status", () => {
    test("Should return an error response for an unregistered user", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: errorInput };
      const options = { authorization: `Bearer ${unRegisteredJWT}` };

      const { data } = await post<ChangePassword>(url, payload, options);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to change password",
        status: Status.Error,
      });
    });
  });

  describe("Verify user's current password", () => {
    test("Should return an error response if passwords do not match", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: errorInput };
      const options = { authorization: `Bearer ${registeredJWT}` };

      const { data } = await post<ChangePassword>(url, payload, options);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "NotAllowedError",
        message: "Unable to change password. 'current password' does not match",
        status: Status.Error,
      });
    });
  });

  describe("Change user password", () => {
    test("Change password and send confirmation mail", async () => {
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
        status: Status.Success,
      });
    });

    test("Sending confirmation mail fails, Revert update and send an error response", async () => {
      const mock = changePasswordMail as jest.MockedFunction<() => never>;
      const options = { authorization: `Bearer ${registeredJWT}` };
      const payload = {
        query: CHANGE_PASSWORD,
        variables: {
          currentPassword: PASSWORD,
          newPassword: "newPassW3!ord1@",
          confirmNewPassword: "newPassW3!ord1@",
        },
      };

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
        status: Status.Error,
      });
    });
  });
});
