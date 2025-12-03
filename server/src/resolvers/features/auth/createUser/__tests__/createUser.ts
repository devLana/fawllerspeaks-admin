import { describe, it, expect, jest, beforeAll, afterAll } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import createUserMail from "@services/mail/createUser";
import { MailError } from "@lib/Errors";
import { emailValidationsTestCases } from "@utils/tests/emailValidationTestCases";
import { CREATE_USER } from "@utils/tests/gqlQueries/authTestQueries";
import post from "@utils/tests/post";
import type { APIContext } from "@types";
import type { CreateUserData } from "types/auth/createUser";

jest.mock("@services/mail/createUser", () => {
  return jest.fn().mockName("createUserMail");
});

describe("Create user", () => {
  let server: ApolloServer<APIContext>, url: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
  });

  afterAll(async () => {
    await db.query("Truncate TABLE users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Validate email input", () => {
    it.each(emailValidationsTestCases)("%s", async (_, email, errorMsg) => {
      const payload = { query: CREATE_USER, variables: { email } };

      const { data } = await post<CreateUserData>(url, payload);

      expect(createUserMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createUser).toStrictEqual({
        __typename: "EmailValidationError",
        emailError: errorMsg,
        status: "ERROR",
      });
    });
  });

  describe("Create a new user", () => {
    it("Should create a new user and send a confirmation mail", async () => {
      const variables = { email: "lana_mail@example.org" };
      const payload = { query: CREATE_USER, variables };
      const msg = `New user created. A confirmation mail has been sent to their email address`;

      const { data } = await post<CreateUserData>(url, payload);

      expect(createUserMail).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createUser).toStrictEqual({
        __typename: "Response",
        message: msg,
        status: "SUCCESS",
      });
    });

    it("Should return an error response if a user with the provided e-mail already exists", async () => {
      const variables = { email: "lana_mail@example.org" };
      const payload = { query: CREATE_USER, variables };

      const { data } = await post<CreateUserData>(url, payload);

      expect(createUserMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createUser).toStrictEqual({
        __typename: "NotAllowedError",
        message: "The new user you are trying to create already exits",
        status: "ERROR",
      });
    });

    it("Should return an error response if the confirmation mail fails to send after creating a new user", async () => {
      const variables = { email: "lanas_mail@example.org" };
      const payload = { query: CREATE_USER, variables };
      const msg = `An error has occurred in trying to create the new user. please try again later`;
      const mock = createUserMail as jest.MockedFunction<() => never>;
      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const { data } = await post<CreateUserData>(url, payload);

      expect(createUserMail).toHaveBeenCalledTimes(1);
      expect(createUserMail).toThrow("Unable to send mail");
      expect(createUserMail).toThrow(MailError);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.createUser).toStrictEqual({
        __typename: "ServerError",
        message: msg,
        status: "ERROR",
      });
    });
  });
});
