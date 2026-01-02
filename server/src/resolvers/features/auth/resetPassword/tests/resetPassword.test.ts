import { it, expect, describe, beforeAll, afterAll, jest } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import resetPasswordMail from "@services/mail/resetPassword";
import { db } from "@services/db";
import { MailError } from "@lib/Errors";
import { validations, verify } from "./resetPassword.testUtils";
import { RESET_PASSWORD } from "@utils/tests/gqlQueries/authTestQueries";
import authUsers from "@utils/tests/createTestUsers/authUsers";
import createPasswordReset from "@utils/tests/createPasswordReset";
import { otherRegisteredReset, registeredReset } from "@utils/tests/mocks";
import post from "@utils/tests/post";
import type { APIContext } from "@types";
import type { ResetPassword } from "types/auth/resetPassword";

jest.mock("@services/mail/resetPassword", () => {
  return jest.fn().mockName("resetPasswordMail");
});

describe("Reset password", () => {
  let server: ApolloServer<APIContext>, url: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));

    const users = await authUsers(db);

    await createPasswordReset(
      db,
      users.registeredUser.userId,
      users.unregisteredUser.userId,
      users.newRegisteredUser.userId
    );
  });

  afterAll(async () => {
    await db.query(
      "Truncate TABLE password_reset, users RESTART IDENTITY CASCADE"
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

  describe("Verify password reset token", () => {
    it.each(verify)("%s", async (_, token, errorMessage) => {
      const password = "$eRtu78#@";
      const variables = { token, password, confirmPassword: password };
      const payload = { query: RESET_PASSWORD, variables };

      const { data } = await post<ResetPassword>(url, payload);

      expect(resetPasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.resetPassword).toStrictEqual({
        __typename: "ForbiddenError",
        message: errorMessage,
        status: "ERROR",
      });
    });
  });

  describe("Successfully reset password", () => {
    it("Successfully verifies the password reset token, Should reset the user's password", async () => {
      const { token } = registeredReset;
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

    it("Should the reset the password even if the reset password mail failed to send", async () => {
      const { token } = otherRegisteredReset;
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
        message: "Your password has been reset",
        status: "SUCCESS",
      });
    });
  });
});
