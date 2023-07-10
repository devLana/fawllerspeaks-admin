import type { ApolloServer } from "@apollo/server";

import {
  test,
  expect,
  describe,
  jest,
  beforeAll,
  afterAll,
} from "@jest/globals";

import generatePasswordMail from "../generatePasswordMail";
import { startServer } from "@server";
import { db } from "@services/db";

import {
  gqlValidations,
  validations,
  verifyMailE2E,
} from "../generatePasswordTestUtils";
import { MailError } from "@utils";
import { unRegisteredUser, post, GENERATE_PASSWORD, testUsers } from "@tests";

import type { APIContext, TestData } from "@types";
import { Status } from "@resolverTypes";

type GeneratePassword = TestData<{ generatePassword: Record<string, unknown> }>;

jest.mock("../generatePasswordMail", () => {
  return jest.fn().mockName("generatePasswordMail");
});

describe("Generate password - E2E", () => {
  const msg = "A confirmation mail will be sent to the email address provided";
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
      "Should throw graphql validation error for %s email value",
      async (_, email) => {
        const payload = { query: GENERATE_PASSWORD, variables: { email } };

        const { data } = await post<GeneratePassword>(url, payload);

        expect(generatePasswordMail).not.toHaveBeenCalled();

        expect(data.errors).toBeDefined();
        expect(data.data).toBeUndefined();
      }
    );

    test.each(validations)(
      "Returns error for %s email string",
      async (_, email, errorMsg) => {
        const payload = { query: GENERATE_PASSWORD, variables: { email } };

        const { data } = await post<GeneratePassword>(url, payload);

        expect(generatePasswordMail).not.toHaveBeenCalled();

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.generatePassword).toStrictEqual({
          __typename: "EmailValidationError",
          emailError: errorMsg,
          status: Status.Error,
        });
      }
    );
  });

  describe("Verify e-mail address", () => {
    test.each(verifyMailE2E)(
      "Returns error for %s",
      async (_, email, typename) => {
        const payload = { query: GENERATE_PASSWORD, variables: { email } };

        const { data } = await post<GeneratePassword>(url, payload);

        expect(generatePasswordMail).not.toHaveBeenCalled();

        expect(data.errors).toBeUndefined();
        expect(data.data?.generatePassword).toStrictEqual({
          __typename: typename,
          message: msg,
          status: Status.Error,
        });
      }
    );
  });

  describe("Generate new password", () => {
    test("Send confirmation mail with generated password", async () => {
      const variables = { email: unRegisteredUser.email };
      const payload = { query: GENERATE_PASSWORD, variables };

      const { data } = await post<GeneratePassword>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(generatePasswordMail).toHaveBeenCalledTimes(1);

      expect(data.data?.generatePassword).toStrictEqual({
        __typename: "Response",
        message: msg,
        status: Status.Success,
      });
    });

    test("Should return error if sending mail fails", async () => {
      const variables = { email: unRegisteredUser.email };
      const payload = { query: GENERATE_PASSWORD, variables };

      const mock = generatePasswordMail as jest.MockedFunction<() => never>;
      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const { data } = await post<GeneratePassword>(url, payload);

      expect(data.errors).toBeUndefined();

      expect(generatePasswordMail).toHaveBeenCalledTimes(1);
      expect(generatePasswordMail).toThrow("Unable to send mail");
      expect(generatePasswordMail).toThrow(MailError);

      expect(data.data?.generatePassword).toStrictEqual({
        __typename: "ServerError",
        message: "Unable to send mail",
        status: Status.Error,
      });
    });
  });
});
