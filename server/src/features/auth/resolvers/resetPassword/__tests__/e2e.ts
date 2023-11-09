import type { ApolloServer } from "@apollo/server";

import {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
  jest,
} from "@jest/globals";

import { startServer } from "@server";
import { db } from "@lib/db";

import resetPasswordMail from "../utils/resetPasswordMail";
import {
  gqlValidations,
  validations,
  verifyEmail,
} from "../utils/resetPassword.testUtils";
import { MailError } from "@utils";
import {
  registeredUser,
  newRegisteredUser,
  post,
  RESET_PASSWORD,
  authUsers,
} from "@tests";

import type { APIContext, TestData } from "@types";

type ResetPassword = TestData<{ resetPassword: Record<string, unknown> }>;
type JestSpied = jest.Spied<(timerId: number) => void>;

jest.useFakeTimers({ legacyFakeTimers: true });
jest.spyOn(global, "clearTimeout");

jest.mock("../utils/resetPasswordMail", () => {
  return jest.fn().mockName("resetPasswordMail");
});

const spy = jest.spyOn(global, "clearTimeout") as unknown as JestSpied;
spy.mockReturnValue(undefined);

describe("Reset password - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    await authUsers(db);
  });

  afterAll(async () => {
    const clearUsers = db.query(`DELETE FROM users`);
    const stop = server.stop();
    await Promise.all([clearUsers, stop]);
    await db.end();
    jest.restoreAllMocks();
  });

  describe("Validate user input", () => {
    test.each(gqlValidations)("%s", async (_, variables) => {
      const payload = { query: RESET_PASSWORD, variables };

      const { data } = await post<ResetPassword>(url, payload);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    test.each(validations(null))("%s", async (_, variables, errors) => {
      const payload = { query: RESET_PASSWORD, variables };

      const { data } = await post<ResetPassword>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.resetPassword).toStrictEqual({
        __typename: "ResetPasswordValidationError",
        tokenError: errors.tokenError,
        passwordError: errors.passwordError,
        confirmPasswordError: errors.confirmPasswordError,
        status: "ERROR",
      });
    });
  });

  describe("Verify provided e-mail address", () => {
    test.each(verifyEmail)("%s", async (_, token, typeName) => {
      const password = "$eRtu78#@";
      const variables = { token, password, confirmPassword: password };
      const payload = { query: RESET_PASSWORD, variables };

      const { data } = await post<ResetPassword>(url, payload);

      expect(resetPasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.resetPassword).toStrictEqual({
        __typename: typeName,
        message: "Unable to reset password",
        status: "ERROR",
      });
    });
  });

  describe("Verify provided password reset token", () => {
    test("Successfully verifies the password reset token, Should reset the user's password", async () => {
      const [token] = registeredUser.resetToken;
      const password = "$eRtu78#@";
      const variables = { token, password, confirmPassword: password };
      const payload = { query: RESET_PASSWORD, variables };

      const { data } = await post<ResetPassword>(url, payload);

      expect(resetPasswordMail).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.resetPassword).toStrictEqual({
        __typename: "Response",
        message: "Your password has been reset",
        status: "SUCCESS",
      });
    });

    test("Should return a warning if the reset password mail failed to send", async () => {
      const msg = "Unable to send mail";
      const [token] = newRegisteredUser.resetToken;
      const password = "$eRtu78#@";
      const variables = { token, password, confirmPassword: password };
      const payload = { query: RESET_PASSWORD, variables };
      const mock = resetPasswordMail as jest.MockedFunction<() => never>;
      mock.mockImplementation(() => {
        throw new MailError(msg);
      });

      const { data } = await post<ResetPassword>(url, payload);

      expect(resetPasswordMail).toHaveBeenCalledTimes(1);
      expect(resetPasswordMail).toThrow(msg);
      expect(resetPasswordMail).toThrow(MailError);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.resetPassword).toStrictEqual({
        __typename: "Response",
        message: msg,
        status: "WARN",
      });
    });
  });
});
