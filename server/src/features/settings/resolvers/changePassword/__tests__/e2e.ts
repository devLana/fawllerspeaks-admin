import type { ApolloServer } from "@apollo/server";

import {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
  jest,
} from "@jest/globals";

import changePasswordMail from "../changePasswordMail";
import { db } from "@services/db";
import { startServer } from "@server";

import { MailError } from "@utils";
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

jest.mock("../changePasswordMail");

describe("Change password - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredUserAccessToken: string, unRegisteredUserAccessToken: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser: user, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(user.userId);
    const unRegistered = loginTestUser(unregisteredUser.userId);

    [registeredUserAccessToken, unRegisteredUserAccessToken] =
      await Promise.all([registered, unRegistered]);
  });

  afterAll(async () => {
    const stop = server.stop();
    const clearUsers = db.query(`DELETE FROM users`);
    await Promise.all([clearUsers, stop]);
    await db.end();
  });

  test("Returns error on logged out user", async () => {
    const payload = {
      query: CHANGE_PASSWORD,
      variables: {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
    };

    const { data } = await post<ChangePassword>(url, payload);

    expect(changePasswordMail).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.changePassword).toStrictEqual({
      __typename: "NotAllowedError",
      message: "Unable to change password",
      status: Status.Error,
    });
  });

  test.each([
    [
      "null and undefined",
      {
        currentPassword: null,
        newPassword: undefined,
        confirmNewPassword: null,
      },
    ],
    [
      "number and boolean",
      {
        currentPassword: 576,
        newPassword: false,
        confirmNewPassword: true,
      },
    ],
  ])(
    "Should throw graphql validation error for %s input values",
    async (_, variables) => {
      const payload = { query: CHANGE_PASSWORD, variables };

      const { data } = await post<ChangePassword>(url, payload, {
        authorization: `Bearer ${unRegisteredUserAccessToken}`,
      });

      expect(changePasswordMail).not.toHaveBeenCalled();

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    }
  );

  test.each([
    [
      "empty",
      {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      {
        currentPasswordError: "Enter current password",
        newPasswordError: "Enter new password",
        confirmNewPasswordError: null,
      },
    ],
    [
      "empty whitespace inputs and password mismatch",
      {
        currentPassword: "  ",
        newPassword: "             ",
        confirmNewPassword: "    ",
      },
      {
        currentPasswordError: null,
        newPasswordError:
          "New password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol",
        confirmNewPasswordError: "Passwords do not match",
      },
    ],
    [
      "invalid password and password mismatch",
      {
        currentPassword: "null",
        newPassword: "gh5tY#",
        confirmNewPassword: "j667 ",
      },
      {
        currentPasswordError: null,
        newPasswordError: "Password must be at least 8 characters long",
        confirmNewPasswordError: "Passwords do not match",
      },
    ],
  ])("Returns error for %s input values", async (_, variables, errors) => {
    const payload = { query: CHANGE_PASSWORD, variables };

    const { data } = await post<ChangePassword>(url, payload, {
      authorization: `Bearer ${unRegisteredUserAccessToken}`,
    });

    expect(changePasswordMail).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.changePassword).toStrictEqual({
      __typename: "ChangePasswordValidationError",
      ...errors,
      status: Status.Error,
    });
  });

  test("Should return error for unregistered user", async () => {
    const payload = {
      query: CHANGE_PASSWORD,
      variables: {
        currentPassword: "null",
        newPassword: "PassW3!ord1@",
        confirmNewPassword: "PassW3!ord1@",
      },
    };

    const { data } = await post<ChangePassword>(url, payload, {
      authorization: `Bearer ${unRegisteredUserAccessToken}`,
    });

    expect(changePasswordMail).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.changePassword).toStrictEqual({
      __typename: "RegistrationError",
      message: "Unable to change password",
      status: Status.Error,
    });
  });

  test("Should return error if passwords don't match", async () => {
    const payload = {
      query: CHANGE_PASSWORD,
      variables: {
        currentPassword: "null",
        newPassword: "PassW3!ord1@",
        confirmNewPassword: "PassW3!ord1@",
      },
    };

    const { data } = await post<ChangePassword>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(changePasswordMail).not.toHaveBeenCalled();

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();
    expect(data.data?.changePassword).toStrictEqual({
      __typename: "UnknownError",
      message: "Unable to change password. 'current password' does not match",
      status: Status.Error,
    });
  });

  test("Changes Password and sends confirmation mail", async () => {
    const payload = {
      query: CHANGE_PASSWORD,
      variables: {
        currentPassword: registeredUser.password,
        newPassword: "PassW3!ord1@",
        confirmNewPassword: "PassW3!ord1@",
      },
    };

    const { data } = await post<ChangePassword>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

    expect(changePasswordMail).toHaveBeenCalledTimes(1);

    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    expect(data.data?.changePassword).toStrictEqual({
      __typename: "Response",
      message: "Password changed",
      status: Status.Success,
    });
  });

  test("Should revert change if confirmation mail throws", async () => {
    const payload = {
      query: CHANGE_PASSWORD,
      variables: {
        currentPassword: "PassW3!ord1@",
        newPassword: "newPassW3!ord1@",
        confirmNewPassword: "newPassW3!ord1@",
      },
    };

    const mock = changePasswordMail as jest.MockedFunction<() => never>;
    mock.mockImplementation(() => {
      throw new MailError("Unable to send mail");
    });

    const { data } = await post<ChangePassword>(url, payload, {
      authorization: `Bearer ${registeredUserAccessToken}`,
    });

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
