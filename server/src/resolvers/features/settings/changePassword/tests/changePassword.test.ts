import { it, expect, describe, beforeAll, afterAll, jest } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import changePasswordMail from "@services/mail/changePassword";
import { MailError } from "@lib/Errors";
import * as mocks from "./changePassword.testUtils";
import { CHANGE_PASSWORD } from "@utils/tests/gqlQueries/settingsTestQueries";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import loginTestUser from "@utils/tests/loginTestUser";
import post from "@utils/tests/post";
import type { APIContext } from "@types";
import type { ChangePasswordData as Data } from "types/settings/changePassword";

jest.mock("@services/mail/changePassword", () => {
  return jest.fn().mockName("changePasswordMail");
});

describe("Change password", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredJWT: string, unRegisteredJWT: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { registeredUser: user, unregisteredUser } = await testUsers(db);

    const registered = loginTestUser(user.userUUID);
    const unRegistered = loginTestUser(unregisteredUser.userUUID);

    [registeredJWT, unRegisteredJWT] = await Promise.all([
      registered,
      unRegistered,
    ]);
  });

  afterAll(async () => {
    await db.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("User is not logged in, Send an error response", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: mocks.authCheck };

      const { data } = await post<Data>(url, payload);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to change password",
        status: "ERROR",
      });
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, variables, errors) => {
      const payload = { query: CHANGE_PASSWORD, variables: { ...variables } };
      const options = { authorization: `Bearer ${unRegisteredJWT}` };

      const { data } = await post<Data>(url, payload, options);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "ChangePasswordValidationError",
        ...errors,
        status: "ERROR",
      });
    });
  });

  describe("Verify user registration status", () => {
    it("Should send an error response if the user is unregistered", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: mocks.errorInput };
      const options = { authorization: `Bearer ${unRegisteredJWT}` };

      const { data } = await post<Data>(url, payload, options);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to change password",
        status: "ERROR",
      });
    });
  });

  describe("Verify user's current password", () => {
    it("Should send an error response if the current password does not match the user's password", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: mocks.errorInput };
      const options = { authorization: `Bearer ${registeredJWT}` };

      const { data } = await post<Data>(url, payload, options);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "NotAllowedError",
        message: "Unable to change password",
        status: "ERROR",
      });
    });
  });

  describe("Change user password", () => {
    it("Should change the user's password and send a confirmation mail", async () => {
      const options = { authorization: `Bearer ${registeredJWT}` };
      const payload = { query: CHANGE_PASSWORD, variables: mocks.validInput1 };

      const { data } = await post<Data>(url, payload, options);

      expect(changePasswordMail).toHaveBeenCalledTimes(1);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "Response",
        message: "Password changed",
        status: "SUCCESS",
      });
    });

    it("Confirmation mail fails to send, Revert all updates and send an error response", async () => {
      const mock = changePasswordMail as jest.MockedFunction<() => never>;
      const options = { authorization: `Bearer ${registeredJWT}` };
      const payload = { query: CHANGE_PASSWORD, variables: mocks.validInput2 };

      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const { data } = await post<Data>(url, payload, options);

      expect(changePasswordMail).toHaveBeenCalledTimes(1);
      expect(changePasswordMail).toThrow("Unable to send mail");
      expect(changePasswordMail).toThrow(MailError);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "Response",
        message: "Password changed",
        status: "SUCCESS",
      });
    });
  });
});
