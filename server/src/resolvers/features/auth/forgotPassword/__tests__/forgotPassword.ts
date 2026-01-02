import { describe, it, expect, jest, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import forgotPasswordMail from "@services/mail/forgotPassword";
import { db } from "@services/db";
import { MailError } from "@lib/Errors";
import { emailValidationsTestCases } from "@utils/tests/emailValidationTestCases";
import { FORGOT_PASSWORD } from "@utils/tests/gqlQueries/authTestQueries";
import { unRegisteredUser, registeredUser } from "@utils/tests/mocks";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import post from "@utils/tests/post";
import type { APIContext } from "@types";
import type { ForgotPasswordData } from "types/auth/forgotPassword";

jest.mock("@services/mail/forgotPassword", () => {
  return jest.fn().mockName("forgotPasswordMail");
});

describe("Forgot password", () => {
  let server: ApolloServer<APIContext>, url: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    await testUsers(db);
  });

  afterAll(async () => {
    await db.query(
      "Truncate TABLE password_reset, users RESTART IDENTITY CASCADE"
    );

    await Promise.all([server.stop(), db.end()]);
  });

  describe("Validate user input", () => {
    it.each(emailValidationsTestCases)("%s", async (_, email, errorMsg) => {
      const payload = { query: FORGOT_PASSWORD, variables: { email } };

      const { data } = await post<ForgotPasswordData>(url, payload);

      expect(forgotPasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.forgotPassword).toStrictEqual({
        __typename: "EmailValidationError",
        emailError: errorMsg,
        status: "ERROR",
      });
    });
  });

  describe("Verify e-mail address", () => {
    it("Should return an error response if the e-mail address is unknown", async () => {
      const variables = { email: "example_mail@examplemail.com" };
      const payload = { query: FORGOT_PASSWORD, variables };

      const { data } = await post<ForgotPasswordData>(url, payload);

      expect(forgotPasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.forgotPassword).toStrictEqual({
        __typename: "ForbiddenError",
        message: "Unable to reset user password",
        status: "ERROR",
      });
    });

    it("Should return an error response if the email is for an unregistered account", async () => {
      const variables = { email: unRegisteredUser.email };
      const payload = { query: FORGOT_PASSWORD, variables };

      const { data } = await post<ForgotPasswordData>(url, payload);

      expect(forgotPasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.forgotPassword).toStrictEqual({
        __typename: "ForbiddenError",
        message: "Unable to reset user password",
        status: "ERROR",
      });
    });
  });

  describe("Generate password reset link", () => {
    it("Should send a confirmation mail with the generated password reset link", async () => {
      const variables = { email: registeredUser.email };
      const payload = { query: FORGOT_PASSWORD, variables };

      const { data } = await post<ForgotPasswordData>(url, payload);

      expect(forgotPasswordMail).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.forgotPassword).toStrictEqual({
        __typename: "Response",
        message: `A password reset link has been sent to the email address provided`,
        status: "SUCCESS",
      });
    });

    it("Should invalidate the generated password reset link if the confirmation mail fails to send", async () => {
      const variables = { email: registeredUser.email };
      const payload = { query: FORGOT_PASSWORD, variables };
      const mock = forgotPasswordMail as jest.MockedFunction<() => never>;

      mock.mockImplementation(() => {
        throw new MailError("Unable to send forgot password mail");
      });

      const { data } = await post<ForgotPasswordData>(url, payload);

      expect(forgotPasswordMail).toHaveBeenCalledTimes(1);
      expect(forgotPasswordMail).toThrow("Unable to send forgot password mail");
      expect(forgotPasswordMail).toThrow(MailError);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.forgotPassword).toStrictEqual({
        __typename: "ServerError",
        message: `An error has occurred in trying to set up your password reset. Please try again later`,
        status: "ERROR",
      });
    });
  });
});
