import { it, expect, describe, beforeAll, afterAll, jest } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import resetPasswordMail from "@services/mail/resetPassword";
import { db } from "@services/db";
import { MailError } from "@lib/Errors";
import { validations, verifyEmail } from "./resetPassword.testUtils";
import { RESET_PASSWORD } from "@utils/tests/gqlQueries/authTestQueries";
import authUsers from "@utils/tests/createTestUsers/authUsers";
import { registeredUser, newRegisteredUser } from "@utils/tests/mocks";
import post from "@utils/tests/post";
import type { APIContext } from "@types";
import type { ResetPassword } from "types/auth/resetPassword";

jest.mock("@services/mail/resetPassword", () => {
  return jest.fn().mockName("resetPasswordMail");
});

describe.skip("Reset password", () => {
  let server: ApolloServer<APIContext>, url: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    await authUsers(db);
  });

  afterAll(async () => {
    await db.query(
      "Truncate TABLE forgot_password, users RESTART IDENTITY CASCADE"
    );
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Validate user input", () => {
    it.each(validations)("%s", async (_, variables, errors) => {
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
    it.each(verifyEmail)("%s", async (_, token, typeName) => {
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
    it("Successfully verifies the password reset token, Should reset the user's password", async () => {
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

    it("Should return a warning if the reset password mail failed to send", async () => {
      const [token] = newRegisteredUser.resetToken;
      const password = "$eRtu78#@";
      const variables = { token, password, confirmPassword: password };
      const payload = { query: RESET_PASSWORD, variables };
      const mock = resetPasswordMail as jest.MockedFunction<() => never>;

      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const { data } = await post<ResetPassword>(url, payload);

      expect(resetPasswordMail).toHaveBeenCalledTimes(1);
      expect(resetPasswordMail).toThrow("Unable to send mail");
      expect(resetPasswordMail).toThrow(MailError);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.resetPassword).toStrictEqual({
        __typename: "Response",
        message: "Unable to send mail",
        status: "WARN",
      });
    });
  });
});
