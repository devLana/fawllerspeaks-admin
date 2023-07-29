import type { ApolloServer } from "@apollo/server";

import { test, expect, describe, beforeAll, afterAll } from "@jest/globals";

import { db } from "@services/db";
import { startServer } from "@server";

import { gqlValidations, validations, verifyToken } from "../utils";
import {
  registeredUser,
  post,
  VERIFY_PASSWORD_RESET_TOKEN,
  testUsers,
} from "@tests";

import type { APIContext, TestData } from "@types";
import { Status } from "@resolverTypes";

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
    test.each(gqlValidations)(
      "Should throw graphql validation error for %s token value",
      async (_, token) => {
        const payload = {
          query: VERIFY_PASSWORD_RESET_TOKEN,
          variables: { token },
        };

        const { data } = await post<VerifyResetToken>(url, payload);

        expect(data.errors).toBeDefined();
        expect(data.data).toBeUndefined();
      }
    );

    test.each(validations)(
      "Returns error for %s token string",
      async (_, token) => {
        const variables = { token };
        const payload = { query: VERIFY_PASSWORD_RESET_TOKEN, variables };

        const { data } = await post<VerifyResetToken>(url, payload);

        expect(data.errors).toBeUndefined();
        expect(data.data?.verifyResetToken).toBeDefined();
        expect(data.data?.verifyResetToken).toStrictEqual({
          __typename: "VerifyResetTokenValidationError",
          tokenError: "Provide password reset token",
          status: Status.Error,
        });
      }
    );
  });

  describe("Verify provided password reset token", () => {
    test.each(verifyToken)(
      "Returns error on %s",
      async (_, token, typeName) => {
        const variables = { token };
        const payload = { query: VERIFY_PASSWORD_RESET_TOKEN, variables };

        const { data } = await post<VerifyResetToken>(url, payload);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifyResetToken).toStrictEqual({
          __typename: typeName,
          message: "Unable to verify password reset token",
          status: Status.Error,
        });
      }
    );
  });

  describe("Successfully verify password reset token", () => {
    test("Respond with e-mail and password reset token", async () => {
      const variables = { token: registeredUser.resetToken[0] };
      const payload = { query: VERIFY_PASSWORD_RESET_TOKEN, variables };

      const { data } = await post<VerifyResetToken>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifyResetToken).toStrictEqual({
        __typename: "VerifiedResetToken",
        email: registeredUser.email,
        resetToken: registeredUser.resetToken[0],
        status: Status.Success,
      });
    });
  });
});
