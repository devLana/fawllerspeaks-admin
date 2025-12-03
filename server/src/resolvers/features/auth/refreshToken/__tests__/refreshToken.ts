import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import sessionMail from "@services/mail/session";
import { db } from "@services/db";

import { MailError } from "@lib/Errors";
import {
  registeredUser as registeredTestUser,
  unRegisteredUser as unRegisteredTestUser,
} from "@utils/tests/mocks";
import { REFRESH_TOKEN } from "@utils/tests/gqlQueries/authTestQueries";
import authUsers from "@utils/tests/createTestUsers/authUsers";
import testSession from "@utils/tests/testSession";
import { JWT_REGEX } from "@utils/tests/constants";
import post from "@utils/tests/post";

import type { APIContext } from "@types";
import type { RefreshData, RefreshMockFn } from "types/auth/refreshToken";

jest.mock("@services/mail/session", () => {
  return jest.fn().mockName("sessionMail");
});

describe.skip("RefreshData Token", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredCookies: string, newRegisteredSessionId: string;
  let unregisteredSessionId: string, unregisteredCookies: string;
  let registeredSessionId: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { unregisteredUser, registeredUser, newRegisteredUser } =
      await authUsers(db);

    [
      { sessionId: newRegisteredSessionId },
      { sessionId: registeredSessionId, cookies: registeredCookies },
      { sessionId: unregisteredSessionId, cookies: unregisteredCookies },
    ] = await Promise.all([
      testSession(db, newRegisteredUser.userId, newRegisteredUser.userUUID),
      testSession(db, registeredUser.userId, registeredUser.userUUID),
      testSession(db, unregisteredUser.userId, unregisteredUser.userUUID, "50"),
    ]);
  });

  afterAll(async () => {
    await db.query("Truncate TABLE sessions, users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Validate session id string", () => {
    it.each([
      [
        "Should return an error response if the session id is an empty string",
        "",
      ],
      [
        "Should return an error response if the session id is an empty whitespace string",
        "      ",
      ],
    ])("%s", async (_, id) => {
      const payload = { query: REFRESH_TOKEN, variables: { sessionId: id } };

      const { data } = await post<RefreshData>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.refreshToken).toStrictEqual({
        __typename: "SessionIdValidationError",
        sessionIdError: "Invalid session id",
        status: "ERROR",
      });
    });
  });

  describe("Validate cookie header", () => {
    it("No cookies in the request's cookie header, Should respond with an error response", async () => {
      const variables = { sessionId: registeredSessionId };
      const payload = { query: REFRESH_TOKEN, variables };

      const { data } = await post<RefreshData>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.refreshToken).toStrictEqual({
        __typename: "AuthCookieError",
        message: "Unable to refresh token",
        status: "ERROR",
      });
    });

    it("Should return an error response if the request header has a missing cookie", async () => {
      const cookie = registeredCookies.split(";").splice(1, 1).join(";");
      const variables = { sessionId: registeredSessionId };
      const payload = { query: REFRESH_TOKEN, variables };

      const { data } = await post<RefreshData>(url, payload, { cookie });

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.refreshToken).toStrictEqual({
        __typename: "ForbiddenError",
        message: "Unable to refresh token",
        status: "ERROR",
      });
    });
  });

  describe("Verify cookie refresh token", () => {
    describe("Expired refresh token", () => {
      it("Session id is unknown, Return an error response", async () => {
        const variables = { sessionId: "unknown_session_id" };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: unregisteredCookies };

        const { data } = await post<RefreshData>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "UnknownError",
          message: "Unable to refresh token",
          status: "ERROR",
        });
      });

      it("Current session was not assigned to the user of the cookie refresh token, Return an error response", async () => {
        const variables = { sessionId: registeredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: unregisteredCookies };

        const { data } = await post<RefreshData>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "UserSessionError",
          message: "Unable to refresh token",
          status: "ERROR",
        });
      });

      it("Should refresh tokens, renew expired refresh token and send a new access token", async () => {
        const variables = { sessionId: unregisteredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: unregisteredCookies };

        const { data } = await post<RefreshData>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "AccessToken",
          accessToken: expect.stringMatching(JWT_REGEX),
          status: "SUCCESS",
        });
      });

      it("Session refresh token does not match the cookie refresh token and session mail failed to send, Return an error response", async () => {
        const mockSessionMail = sessionMail as RefreshMockFn;
        mockSessionMail.mockImplementation(() => {
          throw new MailError("Unable to send session mail");
        });

        const variables = { sessionId: unregisteredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: unregisteredCookies };

        const { data } = await post<RefreshData>(url, payload, options);

        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(unRegisteredTestUser.email);
        expect(sessionMail).toThrow(MailError);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "NotAllowedError",
          message: "Unable to refresh token",
          status: "ERROR",
        });
      });
    });

    describe("RefreshData token is valid and not expired", () => {
      it("Session id is unknown, Return an error response", async () => {
        const variables = { sessionId: "unknown_session_id" };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<RefreshData>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "UnknownError",
          message: "Unable to refresh token",
          status: "ERROR",
        });
      });

      it("Current session was not assigned to the user of the cookie refresh token, Return an error response", async () => {
        const variables = { sessionId: newRegisteredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<RefreshData>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "UserSessionError",
          message: "Unable to refresh token",
          status: "ERROR",
        });
      });

      it("Should refresh tokens, renew refresh token and send a new access token", async () => {
        const variables = { sessionId: registeredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<RefreshData>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "AccessToken",
          accessToken: expect.stringMatching(JWT_REGEX),
          status: "SUCCESS",
        });
      });

      it("Session refresh token does not match the cookie refresh token, Return an error response and send a notification mail", async () => {
        const variables = { sessionId: registeredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<RefreshData>(url, payload, options);

        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(registeredTestUser.email);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "NotAllowedError",
          message: "Unable to refresh token",
          status: "ERROR",
        });
      });
    });
  });
});
