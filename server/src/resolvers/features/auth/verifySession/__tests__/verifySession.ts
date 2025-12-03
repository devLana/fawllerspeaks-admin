import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { storageUrl } from "@services/supabase";
import sessionMail from "@services/mail/session";
import { db } from "@services/db";

import { JWT_REGEX } from "@utils/tests/constants";
import { VERIFY_SESSION } from "@utils/tests/gqlQueries/authTestQueries";
import authUsers from "@utils/tests/createTestUsers/authUsers";
import testSession from "@utils/tests/testSession";
import {
  registeredUser as registeredTestUser,
  newRegisteredUser as newTestUser,
  unRegisteredUser as unRegisteredTestUser,
} from "@utils/tests/mocks";
import post from "@utils/tests/post";

import type { APIContext } from "@types";
import type { DbTestUser } from "types/tests";
import type { Verify } from "types/auth/verifySession";

jest.mock("@services/mail/session", () => {
  return jest.fn().mockName("sessionMail");
});

describe.skip("Verify Session", () => {
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

    const { userId, userUUID } = newRegisteredUser;

    [
      { cookies: newRegisteredCookies, sessionId: newRegisteredSessionId },
      { sessionId: registeredSessionId, cookies: registeredCookies },
      { sessionId: unregisteredSessionId, cookies: unregisteredCookies },
    ] = await Promise.all([
      testSession(db, userId, userUUID, "50"),
      testSession(db, registeredUser.userId, registeredUser.userUUID),
      testSession(db, unregisteredUser.userId, unregisteredUser.userUUID, "50"),
    ]);
  });

  afterAll(async () => {
    await db.query("Truncate TABLE sessions, users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Validate session id input", () => {
    it.each([
      [
        "Should return a validation error response if the session id is an empty string",
        "",
      ],
      [
        "Should return a validation error response if the session id is an empty whitespace string",
        "    ",
      ],
    ])("%s", async (_, id) => {
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
            id: unregisteredUser.userUUID,
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
            id: registeredUser.userUUID,
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
