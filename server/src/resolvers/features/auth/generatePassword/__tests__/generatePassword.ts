import { it, expect, describe, jest, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import generatePasswordMail from "@services/mail/generatePassword";
import { db } from "@services/db";
import { MailError } from "@lib/Errors";
import { emailValidationsTestCases } from "@utils/tests/emailValidationTestCases";
import { GENERATE_PASSWORD } from "@utils/tests/gqlQueries/authTestQueries";
import { unRegisteredUser, registeredUser } from "@utils/tests/mocks";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import post from "@utils/tests/post";
import type { APIContext } from "@types";
import type { GeneratePasswordData as DATA } from "types/auth/generatePassword";

jest.mock("@services/mail/generatePassword", () => {
  return jest.fn().mockName("generatePasswordMail");
});

describe("Generate password", () => {
  const msg = "A confirmation mail will be sent to the email address provided";
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
    it.each(emailValidationsTestCases)("%s", async (_, email, errorMsg) => {
      const payload = { query: GENERATE_PASSWORD, variables: { email } };

      const { data } = await post<DATA>(url, payload);

      expect(generatePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.generatePassword).toStrictEqual({
        __typename: "EmailValidationError",
        emailError: errorMsg,
        status: "ERROR",
      });
    });
  });

  describe("Verify e-mail address", () => {
    it.each([
      [
        "Should return an error response for an unknown e-mail address",
        "example_mail@examplemail.com",
      ],
      [
        "Should return an error response if the provided e-mail is for a registered account",
        registeredUser.email,
      ],
    ])("%s", async (_, email) => {
      const payload = { query: GENERATE_PASSWORD, variables: { email } };

      const { data } = await post<DATA>(url, payload);

      expect(generatePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data?.generatePassword).toStrictEqual({
        __typename: "ForbiddenError",
        message: msg,
        status: "ERROR",
      });
    });
  });

  describe("Generate new password", () => {
    it("Should send a confirmation mail with the generated password", async () => {
      const variables = { email: unRegisteredUser.email };
      const payload = { query: GENERATE_PASSWORD, variables };

      const { data } = await post<DATA>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(generatePasswordMail).toHaveBeenCalledTimes(1);
      expect(data.data?.generatePassword).toStrictEqual({
        __typename: "Response",
        message: `Default password generated. ${msg}`,
        status: "SUCCESS",
      });
    });

    it("Should return an error response if the confirmation mail fails to send", async () => {
      const variables = { email: unRegisteredUser.email };
      const payload = { query: GENERATE_PASSWORD, variables };
      const MSG = `An error has occurred in generating a new default password. Please try again later`;
      const mock = generatePasswordMail as jest.MockedFunction<() => never>;
      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const { data } = await post<DATA>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(generatePasswordMail).toHaveBeenCalledTimes(1);
      expect(generatePasswordMail).toThrow("Unable to send mail");
      expect(generatePasswordMail).toThrow(MailError);
      expect(data.data?.generatePassword).toStrictEqual({
        __typename: "ServerError",
        message: MSG,
        status: "ERROR",
      });
    });
  });
});
