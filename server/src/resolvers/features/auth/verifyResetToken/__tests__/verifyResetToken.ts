import { test, expect, describe, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { db } from "@services/db";
import { startServer } from "@server";
import { VERIFY_PASSWORD_RESET_TOKEN } from "@utils/tests/gqlQueries/authTestQueries";
import { registeredUser, unRegisteredUser } from "@utils/tests/mocks";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import post from "@utils/tests/post";
import type { APIContext } from "@types";
import type { VerifyResetToken } from "types/auth/verifyResetToken";

describe.skip("Verify password reset token", () => {
  let server: ApolloServer<APIContext>, url: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    await testUsers(db);
  });

  afterAll(async () => {
    await db.query("Truncate TABLE users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Validate user input", () => {
    test.each([
      [
        "Should return a validation error response if the password reset token is an empty string",
        "",
      ],
      [
        "Should return a validation error response if the password reset token is an empty whitespace string",
        "    ",
      ],
    ])("%s", async (_, token) => {
      const variables = { token };
      const payload = { query: VERIFY_PASSWORD_RESET_TOKEN, variables };

      const { data } = await post<VerifyResetToken>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data?.verifyResetToken).toBeDefined();
      expect(data.data?.verifyResetToken).toStrictEqual({
        __typename: "VerifyResetTokenValidationError",
        tokenError: "Provide password reset token",
        status: "ERROR",
      });
    });
  });

  describe("Verify provided password reset token", () => {
    test.each([
      [
        "Should return an error response if the password reset token is unknown",
        "token",
        "NotAllowedError",
      ],
      [
        "Should return an error response if the user's account is unregistered",
        unRegisteredUser.resetToken[0],
        "RegistrationError",
      ],
    ])("%s", async (_, token, typeName) => {
      const variables = { token };
      const payload = { query: VERIFY_PASSWORD_RESET_TOKEN, variables };

      const { data } = await post<VerifyResetToken>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifyResetToken).toStrictEqual({
        __typename: typeName,
        message: "Unable to verify password reset token",
        status: "ERROR",
      });
    });
  });

  describe("Successfully verify password reset token", () => {
    test("Should respond with the e-mail and password reset token of the user's account", async () => {
      const variables = { token: registeredUser.resetToken[0] };
      const payload = { query: VERIFY_PASSWORD_RESET_TOKEN, variables };

      const { data } = await post<VerifyResetToken>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifyResetToken).toStrictEqual({
        __typename: "VerifiedResetToken",
        email: registeredUser.email,
        resetToken: registeredUser.resetToken[0],
        status: "SUCCESS",
      });
    });
  });
});
