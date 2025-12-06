import { test, expect, describe, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { db } from "@services/db";
import { startServer } from "@server";
import { VERIFY_PASSWORD_RESET_TOKEN } from "@utils/tests/gqlQueries/authTestQueries";
import authUsers from "@utils/tests/createTestUsers/authUsers";
import createPasswordReset from "@utils/tests/createPasswordReset";
import { validations, verify } from "./verifyResetToken.testUtils";
import { registeredUser, registeredReset } from "@utils/tests/mocks";
import post from "@utils/tests/post";
import type { APIContext } from "@types";
import type { VerifyResetToken } from "types/auth/verifyResetToken";

describe("Verify password reset token", () => {
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

  describe("Verify password reset token", () => {
    test.each(verify)("%s", async (_, token, typeName, errorMsg) => {
      const variables = { token };
      const payload = { query: VERIFY_PASSWORD_RESET_TOKEN, variables };

      const { data } = await post<VerifyResetToken>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifyResetToken).toStrictEqual({
        __typename: typeName,
        message: errorMsg,
        status: "ERROR",
      });
    });
  });

  describe("Successfully verify password reset token", () => {
    test("Should respond with the e-mail and password reset token of the user's account", async () => {
      const variables = { token: registeredReset.token };
      const payload = { query: VERIFY_PASSWORD_RESET_TOKEN, variables };

      const { data } = await post<VerifyResetToken>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifyResetToken).toStrictEqual({
        __typename: "VerifiedResetToken",
        email: registeredUser.email,
        resetToken: registeredReset.token,
        status: "SUCCESS",
      });
    });
  });
});
