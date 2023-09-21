/* eslint-disable @typescript-eslint/consistent-type-imports */
import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import { JWT_REGEX, sessionMail } from "@features/auth/utils";
import {
  cookieString,
  gqlValidations,
  validations,
  verifyE2eCookie,
} from "../utils/verifySession.testUtils";

import {
  VERIFY_SESSION,
  authUsers,
  post,
  registeredUser as registeredTestUser,
  testSession,
  unRegisteredUser as unRegisteredTestUser,
} from "@tests";

import { Status } from "@resolverTypes";
import type { APIContext, DbTestUser, TestData } from "@types";

type Verify = TestData<{ verifySession: Record<string, unknown> }>;
type Module = typeof import("@features/auth/utils");

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
  let registeredUser: DbTestUser, registeredSessionId: string;
  let registeredCookies: string, unregisteredUser: DbTestUser;
  let unregisteredSessionId: string, unregisteredCookies: string;
  let newRegisteredUser: DbTestUser, newRegisteredSessionId: string;
  let newRegisteredCookies: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    ({ unregisteredUser, registeredUser, newRegisteredUser } = await authUsers(
      db
    ));

    [
      { cookies: newRegisteredCookies, sessionId: newRegisteredSessionId },
      { sessionId: registeredSessionId, cookies: registeredCookies },
      { sessionId: unregisteredSessionId, cookies: unregisteredCookies },
    ] = await Promise.all([
      testSession(db, newRegisteredUser.userId, "50"),
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

  describe("Validate session id input", () => {
    it.each(gqlValidations)(
      "Should throw a graphql validation error for %s session id value",
      async (_, id) => {
        const payload = { query: VERIFY_SESSION, variables: { sessionId: id } };

        const { data } = await post<Verify>(url, payload);

        expect(data.errors).toBeDefined();
        expect(data.data).toBeUndefined();
      }
    );

    it.each(validations)(
      "Return an error response if session id is an %s string",
      async (_, id) => {
        const payload = { query: VERIFY_SESSION, variables: { sessionId: id } };

        const { data } = await post<Verify>(url, payload);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "SessionIdValidationError",
          sessionIdError: "Invalid session id",
          status: Status.Error,
        });
      }
    );
  });

  describe("Validate cookie request header", () => {
    it.each(verifyE2eCookie)(
      "Request header has one or more %s, Return a ForbiddenError response",
      async (_, str) => {
        const variables = { sessionId: "session_id" };
        const payload = { query: VERIFY_SESSION, variables };

        const { data } = await post<Verify>(url, payload, { cookie: str });

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "ForbiddenError",
          message: "Unable to verify session",
          status: Status.Error,
        });

        expect(sessionMail).not.toHaveBeenCalled();
      }
    );
  });

  describe("Verify cookie refresh token", () => {
    describe("Invalid refresh token", () => {
      it("Token verification throws a JsonWebTokenError, Return a ForbiddenError response", async () => {
        const variables = { sessionId: "session_id" };
        const payload = { query: VERIFY_SESSION, variables };
        const options = { cookie: cookieString };

        const { data } = await post<Verify>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "ForbiddenError",
          message: "Unable to verify session",
          status: Status.Error,
        });

        expect(sessionMail).not.toHaveBeenCalled();
      });
    });

    describe("Expired refresh token", () => {
      it("Session id is unknown, Return an UnknownError response ", async () => {
        const variables = { sessionId: "unknown_session_id" };
        const payload = { query: VERIFY_SESSION, variables };
        const options = { cookie: unregisteredCookies };

        const { data } = await post<Verify>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "UnknownError",
          message: "Unable to verify session",
          status: Status.Error,
        });
      });

      it("Should verify session, sign new access token and send user details", async () => {
        const variables = { sessionId: unregisteredSessionId };
        const payload = { query: VERIFY_SESSION, variables };
        const options = { cookie: unregisteredCookies };

        const { data } = await post<Verify>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "VerifiedSession",
          user: {
            __typename: "User",
            email: unRegisteredTestUser.email,
            id: unregisteredUser.userId,
            firstName: unRegisteredTestUser.firstName,
            lastName: unRegisteredTestUser.lastName,
            image: null,
            isRegistered: unRegisteredTestUser.registered,
            dateCreated: unregisteredUser.dateCreated,
          },
          accessToken: expect.stringMatching(JWT_REGEX),
          status: Status.Success,
        });
      });

      it("Session refresh token does not match cookie refresh token, Return a NotAllowedError and send a notification mail", async () => {
        const variables = { sessionId: unregisteredSessionId };
        const payload = { query: VERIFY_SESSION, variables };
        const options = { cookie: newRegisteredCookies };

        const { data } = await post<Verify>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "NotAllowedError",
          message: "Unable to verify session",
          status: Status.Error,
        });

        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(unRegisteredTestUser.email);
      });
    });

    describe("Valid and not expired refresh token", () => {
      it("Session id is unknown, Return an UnknownError response", async () => {
        const variables = { sessionId: "unknown_session_id" };
        const payload = { query: VERIFY_SESSION, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<Verify>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "UnknownError",
          message: "Unable to verify session",
          status: Status.Error,
        });
      });

      it("Session was not assigned to the logged in user, Return a UserSessionError", async () => {
        const variables = { sessionId: newRegisteredSessionId };
        const payload = { query: VERIFY_SESSION, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<Verify>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "UserSessionError",
          message: "Unable to verify session",
          status: Status.Error,
        });
      });

      it("Should verify session, Sign a new access token and send user details", async () => {
        const variables = { sessionId: registeredSessionId };
        const payload = { query: VERIFY_SESSION, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<Verify>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "VerifiedSession",
          user: {
            __typename: "User",
            email: registeredTestUser.email,
            id: registeredUser.userId,
            firstName: registeredTestUser.firstName,
            lastName: registeredTestUser.lastName,
            image: null,
            isRegistered: registeredTestUser.registered,
            dateCreated: registeredUser.dateCreated,
          },
          accessToken: expect.stringMatching(JWT_REGEX),
          status: Status.Success,
        });
      });
    });
  });
});
