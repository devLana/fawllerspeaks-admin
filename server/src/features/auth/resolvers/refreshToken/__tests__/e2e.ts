/* eslint-disable @typescript-eslint/consistent-type-imports */
import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import { JWT_REGEX, sessionMail } from "@features/auth/utils";
import {
  cookiesStr,
  gqlValidations,
  validateSession,
  verifyE2eCookie,
} from "../utils/refreshTokenTestUtils";
import {
  REFRESH_TOKEN,
  authUsers,
  post,
  registeredUser as registeredTestUser,
  testSession,
  unRegisteredUser as unRegisteredTestUser,
} from "@tests";

import type { APIContext, TestData } from "@types";
import { Status } from "@resolverTypes";
import { MailError } from "@utils";

type Refresh = TestData<{ refreshToken: Record<string, unknown> }>;
type Module = typeof import("@features/auth/utils");
type MockFunction = jest.MockedFunction<() => unknown>;

jest.mock("@features/auth/utils", () => {
  const mod = jest.requireActual<Module>("@features/auth/utils");
  return {
    __esModule: true,
    ...mod,
    sessionMail: jest.fn().mockName("sessionMail"),
  };
});

describe("Refresh TOken - E2E", () => {
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
      testSession(db, newRegisteredUser.userId),
      testSession(db, registeredUser.userId),
      testSession(db, unregisteredUser.userId, "50"),
    ]);
  });

  afterAll(async () => {
    const clearSessions = db.query("DELETE FROM sessions");
    const stop = server.stop();
    await Promise.all([clearSessions, stop]);
    await db.query(`DELETE FROM users`);
    await db.end();
  });

  describe("Validate session id string", () => {
    it.each(gqlValidations)(
      "Should throw a graphql validation error for %s session id value",
      async (_, id) => {
        const payload = { query: REFRESH_TOKEN, variables: { sessionId: id } };

        const { data } = await post<Refresh>(url, payload);

        expect(data.errors).toBeDefined();
        expect(data.data).toBeUndefined();
      }
    );

    it.each(validateSession)(
      "Return an error response if session id is an %s string",
      async (_, id) => {
        const payload = { query: REFRESH_TOKEN, variables: { sessionId: id } };

        const { data } = await post<Refresh>(url, payload);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "SessionIdValidationError",
          sessionIdError: "Invalid session id",
          status: Status.Error,
        });
      }
    );
  });

  describe("Validate cookie header", () => {
    it.each(verifyE2eCookie)(
      "Return an error response if request header has one or more %s",
      async (_, cookie) => {
        const variables = { sessionId: registeredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };

        const { data } = await post<Refresh>(url, payload, { cookie });

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "ForbiddenError",
          message: "Unable to refresh token",
          status: Status.Error,
        });
      }
    );
  });

  describe("Verify cookie refresh token", () => {
    describe("Invalid refresh token", () => {
      it("Token verification throws a JsonWebTokenError, Return a ForbiddenError response ", async () => {
        const variables = { sessionId: registeredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: cookiesStr };

        const { data } = await post<Refresh>(url, payload, options);

        expect(sessionMail).not.toHaveBeenCalled();

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "ForbiddenError",
          message: "Unable to refresh token",
          status: Status.Error,
        });
      });
    });

    describe("Expired refresh token", () => {
      it("Session id is unknown, Return an UnknownError response ", async () => {
        const variables = { sessionId: "unknown_session_id" };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: unregisteredCookies };

        const { data } = await post<Refresh>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "UnknownError",
          message: "Unable to refresh token",
          status: Status.Error,
        });
      });

      it("Should refresh tokens, Renew expired refresh token and send new access token", async () => {
        const variables = { sessionId: unregisteredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: unregisteredCookies };

        const { data } = await post<Refresh>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "AccessToken",
          accessToken: expect.stringMatching(JWT_REGEX),
          status: Status.Success,
        });
      });

      it("Session refresh token does not match the cookie refresh token and session mail failed to send, Return a NotAllowedError response", async () => {
        const mockSessionMail = sessionMail as MockFunction;
        mockSessionMail.mockImplementation(() => {
          throw new MailError("Unable to send session mail");
        });

        const variables = { sessionId: unregisteredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: unregisteredCookies };

        const { data } = await post<Refresh>(url, payload, options);

        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(unRegisteredTestUser.email);
        expect(sessionMail).toThrow(MailError);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "NotAllowedError",
          message: "Unable to refresh token",
          status: Status.Error,
        });
      });
    });

    describe("Refresh token is valid and not expired", () => {
      it("Session id is unknown, Return an UnknownError response", async () => {
        const variables = { sessionId: "unknown_session_id" };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<Refresh>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "UnknownError",
          message: "Unable to refresh token",
          status: Status.Error,
        });
      });

      it("Session was not signed for the current user, Return a UserSessionError response", async () => {
        const variables = { sessionId: newRegisteredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<Refresh>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "UserSessionError",
          message: "Unable to refresh token",
          status: Status.Error,
        });
      });

      it("Should refresh tokens, Renew refresh token and send new access token", async () => {
        const variables = { sessionId: registeredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<Refresh>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "AccessToken",
          accessToken: expect.stringMatching(JWT_REGEX),
          status: Status.Success,
        });
      });

      it("Session refresh token does not match the cookie refresh token, Return a NotAllowedError response and send a notification mail", async () => {
        const variables = { sessionId: registeredSessionId };
        const payload = { query: REFRESH_TOKEN, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<Refresh>(url, payload, options);

        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(registeredTestUser.email);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.refreshToken).toStrictEqual({
          __typename: "NotAllowedError",
          message: "Unable to refresh token",
          status: Status.Error,
        });
      });
    });
  });
});
