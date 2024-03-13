import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import supabase from "@lib/supabase/supabaseClient";
import { startServer } from "@server";
import { db } from "@lib/db";

import { JWT_REGEX } from "@tests/constants";
import sessionMail from "@features/auth/utils/sessionMail";
import { gqlValidations, validations } from "../utils/verifySession.testUtils";

import {
  registeredUser as registeredTestUser,
  newRegisteredUser as newTestUser,
  unRegisteredUser as unRegisteredTestUser,
} from "@tests/mocks";
import { VERIFY_SESSION } from "@tests/gqlQueries/authTestQueries";
import authUsers from "@tests/createTestUsers/authUsers";
import post from "@tests/post";
import testSession from "@tests/testSession";

import type { APIContext, DbTestUser, TestData } from "@types";

type Verify = TestData<{ verifySession: Record<string, unknown> }>;

jest.mock("@features/auth/utils/sessionMail", () => {
  return jest.fn().mockName("sessionMail");
});

describe("Verify Session - E2E", () => {
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
    it.each(gqlValidations)("%s", async (_, id) => {
      const payload = { query: VERIFY_SESSION, variables: { sessionId: id } };

      const { data } = await post<Verify>(url, payload);

      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    it.each(validations)("%s", async (_, id) => {
      const payload = { query: VERIFY_SESSION, variables: { sessionId: id } };

      const { data } = await post<Verify>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifySession).toStrictEqual({
        __typename: "SessionIdValidationError",
        sessionIdError: "Invalid session id",
        status: "ERROR",
      });
    });
  });

  describe("Validate cookie request header", () => {
    it("Should return an error response if the request has no cookies", async () => {
      const variables = { sessionId: "session_id" };
      const payload = { query: VERIFY_SESSION, variables };

      const { data } = await post<Verify>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifySession).toStrictEqual({
        __typename: "AuthCookieError",
        message: "Unable to verify session",
        status: "ERROR",
      });

      expect(sessionMail).not.toHaveBeenCalled();
    });

    it("Request cookie header has a missing cookie, Return an error response", async () => {
      const cookie = registeredCookies.split(";").splice(1, 1).join(";");
      const variables = { sessionId: "session_id" };
      const payload = { query: VERIFY_SESSION, variables };

      const { data } = await post<Verify>(url, payload, { cookie });

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifySession).toStrictEqual({
        __typename: "ForbiddenError",
        message: "Unable to verify session",
        status: "ERROR",
      });
      expect(sessionMail).not.toHaveBeenCalled();
    });
  });

  describe("Verify cookie refresh token", () => {
    describe("Expired refresh token", () => {
      it("Session id is unknown, Return an error response", async () => {
        const variables = { sessionId: "unknown_session_id" };
        const payload = { query: VERIFY_SESSION, variables };
        const options = { cookie: unregisteredCookies };

        const { data } = await post<Verify>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "UnknownError",
          message: "Unable to verify session",
          status: "ERROR",
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
          status: "SUCCESS",
        });
      });

      it("The provided session was not assigned to the user of the cookie refresh token, Should return an error response and send a notification mail", async () => {
        const variables = { sessionId: unregisteredSessionId };
        const payload = { query: VERIFY_SESSION, variables };
        const options = { cookie: newRegisteredCookies };

        const { data } = await post<Verify>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "NotAllowedError",
          message: "Unable to verify session",
          status: "ERROR",
        });
        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(unRegisteredTestUser.email);
      });
    });

    describe("Valid and not expired refresh token", () => {
      it("Session id is unknown, Return an error response", async () => {
        const variables = { sessionId: "unknown_session_id" };
        const payload = { query: VERIFY_SESSION, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<Verify>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "UnknownError",
          message: "Unable to verify session",
          status: "ERROR",
        });
      });

      it("The provided session was not assigned to the user of the cookie refresh token, Return an error response", async () => {
        const variables = { sessionId: newRegisteredSessionId };
        const payload = { query: VERIFY_SESSION, variables };
        const options = { cookie: registeredCookies };

        const { data } = await post<Verify>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.verifySession).toStrictEqual({
          __typename: "NotAllowedError",
          message: "Unable to verify session",
          status: "ERROR",
        });
        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(newTestUser.email);
      });

      it("Should verify session, Sign a new access token and send user details", async () => {
        const variables = { sessionId: registeredSessionId };

        const { storageUrl } = supabase();
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
            image: `${storageUrl}${registeredTestUser.image}`,
            isRegistered: registeredTestUser.registered,
            dateCreated: registeredUser.dateCreated,
          },
          accessToken: expect.stringMatching(JWT_REGEX),
          status: "SUCCESS",
        });
      });
    });
  });
});
