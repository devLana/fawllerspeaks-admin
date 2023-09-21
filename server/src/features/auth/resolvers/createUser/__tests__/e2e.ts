import {
  describe,
  test,
  expect,
  jest,
  beforeAll,
  afterAll,
} from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import createUserMail from "../utils/createUserMail";
import { gqlValidations, validations } from "../utils/createUser.testUtils";
import { MailError } from "@utils";
import { CREATE_USER, post } from "@tests";

import type { APIContext, TestData } from "@types";
import { Status } from "@resolverTypes";

type CreateUser = TestData<{ createUser: Record<string, unknown> }>;

jest.mock("../utils/createUserMail", () => {
  return jest.fn().mockName("createUserMail");
});

describe("Create user - E2E", () => {
  const msg = "A confirmation mail has been sent to the email address provided";
  let server: ApolloServer<APIContext>, url: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
  });

  afterAll(async () => {
    const clearUsers = db.query(`DELETE FROM users`);
    const stop = server.stop();
    await Promise.all([clearUsers, stop]);
    await db.end();
  });

  describe("Validate email input", () => {
    test.each(gqlValidations)(
      "Should throw a graphql validation error for %s email value",
      async (_, email) => {
        const payload = { query: CREATE_USER, variables: { email } };

        const { data } = await post<CreateUser>(url, payload);

        expect(createUserMail).not.toHaveBeenCalled();
        expect(data.data).toBeUndefined();
        expect(data.errors).toBeDefined();
      }
    );

    test.each(validations)(
      "E-mail validation fails, Return an error for %s e-mail string",
      async (_, email, errorMsg) => {
        const payload = { query: CREATE_USER, variables: { email } };

        const { data } = await post<CreateUser>(url, payload);

        expect(createUserMail).not.toHaveBeenCalled();
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.createUser).toStrictEqual({
          __typename: "EmailValidationError",
          emailError: errorMsg,
          status: Status.Error,
        });
      }
    );
  });

  describe("Create new user", () => {
    test("Send a confirmation mail if a new user is created", async () => {
      const variables = { email: "lana_mail@example.org" };
      const payload = { query: CREATE_USER, variables };

      const { data } = await post<CreateUser>(url, payload);

      expect(createUserMail).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createUser).toStrictEqual({
        __typename: "Response",
        message: msg,
        status: Status.Success,
      });
    });

    test("Return an error if a user with the provided e-mail already exists", async () => {
      const variables = { email: "lana_mail@example.org" };
      const payload = { query: CREATE_USER, variables };

      const { data } = await post<CreateUser>(url, payload);

      expect(createUserMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createUser).toStrictEqual({
        __typename: "NotAllowedError",
        message: msg,
        status: Status.Error,
      });
    });

    test("Return an error if the confirmation mail fails to send", async () => {
      const variables = { email: "lanas_mail@example.org" };
      const payload = { query: CREATE_USER, variables };
      const mock = createUserMail as jest.MockedFunction<() => never>;
      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const { data } = await post<CreateUser>(url, payload);

      expect(createUserMail).toHaveBeenCalledTimes(1);
      expect(createUserMail).toThrow("Unable to send mail");
      expect(createUserMail).toThrow(MailError);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createUser).toStrictEqual({
        __typename: "ServerError",
        message: "Unable to send mail",
        status: Status.Error,
      });
    });
  });
});
