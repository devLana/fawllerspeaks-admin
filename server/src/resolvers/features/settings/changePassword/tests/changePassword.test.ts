import { it, expect, describe, beforeAll, afterAll, jest } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import { changePasswordMail } from "@services/mail/changePassword";
import { MailError } from "@lib/Errors";
import * as mocks from "./changePassword.testUtils";
import { CHANGE_PASSWORD } from "@utils/tests/gqlQueries/settingsTestQueries";
import { authUsers } from "@utils/tests/createTestUsers/authUsers";
import { loginTestUser } from "@utils/tests/loginTestUser";
import { post } from "@utils/tests/post";
import { testSession } from "@utils/tests/testSession";
import type { APIContext } from "@appTypes";
import type { ChangePasswordData as Data } from "@appTypes/settings/changePassword";

jest.mock("@services/mail/changePassword", () => {
  return {
    __esModule: true,
    changePasswordMail: jest.fn().mockName("changePasswordMail"),
  };
});

describe("Change password", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredJWT: string, registeredCookie: string;
  let unRegisteredJWT: string, unregisteredCookie: string;
  let newRegisteredJWT: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const users = await authUsers(db);

    [
      registeredJWT,
      unRegisteredJWT,
      newRegisteredJWT,
      registeredCookie,
      unregisteredCookie,
    ] = await Promise.all([
      loginTestUser(users.registeredUser.userUUID),
      loginTestUser(users.unregisteredUser.userUUID),
      loginTestUser(users.newRegisteredUser.userUUID),
      testSession(db, users.registeredUser.userId),
      testSession(db, users.unregisteredUser.userId),
    ]);
  });

  afterAll(async () => {
    await db.query("TRUNCATE TABLE sessions, users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify user authentication", () => {
    it("User is not logged in, Send an error response", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: mocks.authCheck };

      const { data, responseHeaders } = await post<Data>(url, payload);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to change password",
        status: "ERROR",
      });
      expect(changePasswordMail).not.toHaveBeenCalled();
    });

    it("Expect an error response if the request has no authentication cookie", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: mocks.authCheck };
      const options = { authorization: `Bearer ${unRegisteredJWT}` };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to change password",
        status: "ERROR",
      });
      expect(changePasswordMail).not.toHaveBeenCalled();
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations)("%s", async (_, variables, errors) => {
      const cookie = unregisteredCookie;
      const payload = { query: CHANGE_PASSWORD, variables };
      const options = { authorization: `Bearer ${unRegisteredJWT}`, cookie };

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "ChangePasswordValidationError",
        ...errors,
        status: "ERROR",
      });
      expect(changePasswordMail).not.toHaveBeenCalled();
    });
  });

  describe("Verify user session cookie", () => {
    it("Expect an error response if the session cookie could not be found", async () => {
      const cookie = "auth=475ee532719198d31640ef1ed69ce2c2c7987e";
      const payload = { query: CHANGE_PASSWORD, variables: mocks.errorInput };
      const options = { authorization: `Bearer ${unRegisteredJWT}`, cookie };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to change password",
        status: "ERROR",
      });
      expect(changePasswordMail).not.toHaveBeenCalled();
    });

    it("Expect an error response if the logged in user somehow does not have an active session", async () => {
      const payload = { query: CHANGE_PASSWORD, variables: mocks.validInput1 };
      const options = { authorization: `Bearer ${newRegisteredJWT}` };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to change password",
        status: "ERROR",
      });
      expect(changePasswordMail).not.toHaveBeenCalled();
    });
  });

  describe("Verify user registration status", () => {
    it("Should send an error response if the user is unregistered", async () => {
      const cookie = unregisteredCookie;
      const payload = { query: CHANGE_PASSWORD, variables: mocks.errorInput };
      const options = { authorization: `Bearer ${unRegisteredJWT}`, cookie };

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "RegistrationError",
        message: "Unable to change password",
        status: "ERROR",
      });
      expect(changePasswordMail).not.toHaveBeenCalled();
    });
  });

  describe("Verify user's current password", () => {
    it("Should send an error response if the current password does not match the user's password", async () => {
      const cookie = registeredCookie;
      const payload = { query: CHANGE_PASSWORD, variables: mocks.errorInput };
      const options = { authorization: `Bearer ${registeredJWT}`, cookie };

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "ForbiddenError",
        message: "Unable to change password",
        status: "ERROR",
      });
      expect(changePasswordMail).not.toHaveBeenCalled();
    });
  });

  describe("Change user password", () => {
    it("Should change the user's password and send a confirmation mail", async () => {
      const cookie = registeredCookie;
      const options = { authorization: `Bearer ${registeredJWT}`, cookie };
      const payload = { query: CHANGE_PASSWORD, variables: mocks.validInput1 };

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "Response",
        message: "Password changed",
        status: "SUCCESS",
      });
      expect(changePasswordMail).toHaveBeenCalledTimes(1);
    });

    it("Should change the user's password even if the confirmation mail fails to send", async () => {
      const mock = jest.mocked(changePasswordMail);
      const cookie = registeredCookie;
      const options = { authorization: `Bearer ${registeredJWT}`, cookie };
      const payload = { query: CHANGE_PASSWORD, variables: mocks.validInput2 };

      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const { data } = await post<Data>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.changePassword).toStrictEqual({
        __typename: "Response",
        message: "Password changed",
        status: "SUCCESS",
      });
      expect(changePasswordMail).toHaveBeenCalledTimes(1);
      expect(changePasswordMail).toThrow("Unable to send mail");
      expect(changePasswordMail).toThrow(MailError);
    });
  });
});
