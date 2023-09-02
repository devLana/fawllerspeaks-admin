import {
  describe,
  test,
  expect,
  jest,
  beforeAll,
  afterAll,
  afterEach,
} from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import forgotPasswordMail from "../utils/forgotPasswordMail";
import { gqlValidations, validations } from "../utils/forgotPasswordTestUtils";
import { MailError } from "@utils";
import {
  unRegisteredUser,
  registeredUser,
  post,
  FORGOT_PASSWORD,
  testUsers,
} from "@tests";

import { Status } from "@resolverTypes";
import type { APIContext, TestData } from "@types";

type ForgotPassword = TestData<{ forgotPassword: Record<string, unknown> }>;
type SetTimeOut = () => Pick<NodeJS.Timeout, typeof Symbol.toPrimitive>;
type Timeout = jest.Spied<SetTimeOut>;
type ClearTimeout = jest.Spied<() => void>;

jest.useFakeTimers({ legacyFakeTimers: true });

jest.mock("../utils/forgotPasswordMail", () => {
  return jest.fn().mockName("forgotPasswordMail");
});

const spy1 = jest.spyOn(global, "setTimeout") as unknown as Timeout;
spy1.mockReturnValue({ [Symbol.toPrimitive]: () => 100 });

const spy2 = jest.spyOn(global, "clearTimeout") as unknown as ClearTimeout;
spy2.mockReturnValue(undefined);

describe("Forgot password - E2E", () => {
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
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe("Validate user input", () => {
    test.each(gqlValidations)(
      "Should throw a graphql validation error for %s email value",
      async (_, email) => {
        const payload = { query: FORGOT_PASSWORD, variables: { email } };

        const { data } = await post<ForgotPassword>(url, payload);

        expect(forgotPasswordMail).not.toHaveBeenCalled();
        expect(data.errors).toBeDefined();
        expect(data.data).toBeUndefined();
      }
    );

    test.each(validations)(
      "Return an error for %s email string",
      async (_, email, errorMsg) => {
        const payload = { query: FORGOT_PASSWORD, variables: { email } };

        const { data } = await post<ForgotPassword>(url, payload);

        expect(forgotPasswordMail).not.toHaveBeenCalled();

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.forgotPassword).toStrictEqual({
          __typename: "EmailValidationError",
          emailError: errorMsg,
          status: Status.Error,
        });
      }
    );
  });

  describe("Verify e-mail address", () => {
    test("Return an error if e-mail address is unknown", async () => {
      const variables = { email: "example_mail@examplemail.com" };
      const payload = { query: FORGOT_PASSWORD, variables };

      const { data } = await post<ForgotPassword>(url, payload);

      expect(forgotPasswordMail).not.toHaveBeenCalled();

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.forgotPassword).toStrictEqual({
        __typename: "NotAllowedError",
        message: "Unable to reset the password for this user",
        status: Status.Error,
      });
    });

    test("Returns error for email with unregistered account", async () => {
      const variables = { email: unRegisteredUser.email };
      const payload = { query: FORGOT_PASSWORD, variables };

      const { data } = await post<ForgotPassword>(url, payload);

      expect(forgotPasswordMail).not.toHaveBeenCalled();

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.forgotPassword).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to reset password for unregistered user",
        status: Status.Error,
      });
    });
  });

  describe("Generate password reset link", () => {
    test("Send confirmation mail with the password reset link", async () => {
      const variables = { email: registeredUser.email };
      const payload = { query: FORGOT_PASSWORD, variables };

      const { data } = await post<ForgotPassword>(url, payload);

      jest.runAllTimers();

      expect(forgotPasswordMail).toHaveBeenCalledTimes(1);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.forgotPassword).toStrictEqual({
        __typename: "Response",
        message:
          "Your request is being processed and a mail will be sent to you shortly if that email address exists",
        status: Status.Success,
      });
    });

    test("Confirmation mail fails to send, Invalidate generated password reset link", async () => {
      const variables = { email: registeredUser.email };
      const payload = { query: FORGOT_PASSWORD, variables };

      const mock = forgotPasswordMail as jest.MockedFunction<() => never>;
      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const { data } = await post<ForgotPassword>(url, payload);

      jest.runAllTimers();

      expect(forgotPasswordMail).toHaveBeenCalledTimes(1);
      expect(forgotPasswordMail).toThrow("Unable to send mail");
      expect(forgotPasswordMail).toThrow(MailError);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.forgotPassword).toStrictEqual({
        __typename: "ServerError",
        message: "Unable to send mail",
        status: Status.Error,
      });
    });
  });
});
