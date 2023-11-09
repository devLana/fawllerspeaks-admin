import type { ApolloServer } from "@apollo/server";

import { test, expect, describe, beforeAll, afterAll } from "@jest/globals";

import { db } from "@lib/db";
import { startServer } from "@server";

import {
  gqlValidations,
  validations,
  verifyToken,
} from "../utils/verifyResetToken.testUtils";
import {
  registeredUser,
  post,
  VERIFY_PASSWORD_RESET_TOKEN,
  testUsers,
} from "@tests";

import type { APIContext, TestData } from "@types";

type VerifyResetToken = TestData<{ verifyResetToken: Record<string, unknown> }>;

describe("Verify password reset token - E2E", () => {
  let server: ApolloServer<APIContext>, url: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    await testUsers(db);
  });

  afterAll(async () => {
    const clearUsers = db.query(`DELETE FROM users`);
    const stop = server.stop();
    await Promise.all([clearUsers, stop]);
    await db.end();
  });

  describe("Validate user input", () => {
    test.each(gqlValidations)("%s", async (_, token) => {
      const variables = { token };
      const payload = { query: VERIFY_PASSWORD_RESET_TOKEN, variables };

      const { data } = await post<VerifyResetToken>(url, payload);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    test.each(validations)("%s", async (_, token) => {
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
    test.each(verifyToken)("%s", async (_, token, typeName) => {
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
