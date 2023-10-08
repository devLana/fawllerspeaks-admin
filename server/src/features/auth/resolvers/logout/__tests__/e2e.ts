import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import { gqlValidations, validations } from "../utils/logout.testUtils";
import { LOGOUT, testUsers, loginTestUser, post, testSession } from "@tests";

import { Status } from "@resolverTypes";
import type { APIContext, TestData } from "@types";

type Logout = TestData<{ logout: Record<string, unknown> }>;

describe("Logout - E2E", () => {
  let server: ApolloServer<APIContext>, url: string, unregisteredJwt: string;
  let unregisteredSessionId: string, registeredJwt: string;
  let registeredSessionId: string, registeredCookie: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { unregisteredUser, registeredUser } = await testUsers(db);

    const unregisteredToken = loginTestUser(unregisteredUser.userId);
    const registeredToken = loginTestUser(registeredUser.userId);
    const unregisteredSession = testSession(db, unregisteredUser.userId);
    const registeredSession = testSession(db, registeredUser.userId);

    [
      unregisteredJwt,
      registeredJwt,
      { sessionId: unregisteredSessionId },
      { sessionId: registeredSessionId, cookies: registeredCookie },
    ] = await Promise.all([
      unregisteredToken,
      registeredToken,
      unregisteredSession,
      registeredSession,
    ]);
  });

  afterAll(async () => {
    const clearSessions = db.query("DELETE FROM sessions");
    const stop = server.stop();
    await Promise.all([clearSessions, stop]);
    await db.query(`DELETE FROM users`);
    await db.end();
  });

  describe("Validate user authentication", () => {
    it("Return an error response if user is not logged in", async () => {
      const payload = { query: LOGOUT, variables: { sessionId: "" } };

      const { data } = await post<Logout>(url, payload);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to logout",
        status: Status.Error,
      });
    });
  });

  describe("Validate user session input", () => {
    it.each(gqlValidations)("%s", async (_, id) => {
      const payload = { query: LOGOUT, variables: { sessionId: id } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<Logout>(url, payload, options);

      expect(data.data).toBeUndefined();
      expect(data.errors).toBeDefined();
    });

    it.each(validations)("%s", async (_, id) => {
      const payload = { query: LOGOUT, variables: { sessionId: id } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<Logout>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "SessionIdValidationError",
        sessionIdError: "Invalid session id",
        status: Status.Error,
      });
    });
  });

  describe("Logout request is made with an empty cookie header", () => {
    it("Return an error response if the session id is unknown", async () => {
      const payload = { query: LOGOUT, variables: { sessionId: "wrong_id" } };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<Logout>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "UnknownError",
        message: "Unable to logout",
        status: Status.Error,
      });
    });

    it("Should return an error if the session was not assigned to the logged in user", async () => {
      const variables = { sessionId: unregisteredSessionId };
      const payload = { query: LOGOUT, variables };
      const options = { authorization: `Bearer ${registeredJwt}` };

      const { data } = await post<Logout>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "NotAllowedError",
        message: "Unable to logout",
        status: Status.Error,
      });
    });

    it("Delete session, Log user out", async () => {
      const variables = { sessionId: unregisteredSessionId };
      const payload = { query: LOGOUT, variables };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data } = await post<Logout>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "Response",
        message: "User logged out",
        status: Status.Warn,
      });
    });
  });

  describe("Validate request cookie", () => {
    it("Return an error response if request has a missing cookie", async () => {
      const cookie = registeredCookie.split(";").splice(1, 1).join(";");
      const variables = { sessionId: registeredSessionId };
      const payload = { query: LOGOUT, variables };
      const options = { authorization: `Bearer ${registeredJwt}`, cookie };

      const { data } = await post<Logout>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "NotAllowedError",
        message: "Unable to logout",
        status: Status.Error,
      });
    });
  });

  describe("Verify user session", () => {
    it("Should return an error response if user session could not be found", async () => {
      const payload = { query: LOGOUT, variables: { sessionId: "wrong_id" } };
      const jwt = `Bearer ${registeredJwt}`;
      const options = { authorization: jwt, cookie: registeredCookie };

      const { data } = await post<Logout>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "UnknownError",
        message: "Unable to logout",
        status: Status.Error,
      });
    });
  });

  describe("Successfully log user out", () => {
    it("Should log user out and delete user session from db", async () => {
      const variables = { sessionId: registeredSessionId };
      const jwt = `Bearer ${registeredJwt}`;
      const payload = { query: LOGOUT, variables };
      const options = { authorization: jwt, cookie: registeredCookie };

      const { data } = await post<Logout>(url, payload, options);

      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "Response",
        message: "User logged out",
        status: Status.Success,
      });
    });
  });
});
