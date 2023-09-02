import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@lib/db";

import {
  gqlValidations,
  validations,
  verifyE2eCookie,
} from "../utils/logoutTestUtils";
import { LOGOUT, testUsers, loginTestUser, post, testSession } from "@tests";

import type { APIContext, DbTestUser, TestData } from "@types";
import { Status } from "@resolverTypes";

type Logout = TestData<{ logout: Record<string, unknown> }>;

describe("Logout - E2E", () => {
  let server: ApolloServer<APIContext>, url: string, user: DbTestUser;
  let jwt: string, sessionId: string, cookies: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    ({ unregisteredUser: user } = await testUsers(db));

    const userToken = loginTestUser(user.userId);
    const userSession = testSession(db, user.userId);
    const [token, session] = await Promise.all([userToken, userSession]);

    jwt = token;
    ({ sessionId, cookies } = session);
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
    it.each(gqlValidations)(
      "Should throw a graphql validation error for %s session id value",
      async (_, id) => {
        const payload = { query: LOGOUT, variables: { sessionId: id } };
        const options = { authorization: `Bearer ${jwt}` };

        const { data } = await post<Logout>(url, payload, options);

        expect(data.data).toBeUndefined();
        expect(data.errors).toBeDefined();
      }
    );

    it.each(validations)(
      "Return an error response if session id is an %s string",
      async (_, id) => {
        const payload = { query: LOGOUT, variables: { sessionId: id } };
        const options = { authorization: `Bearer ${jwt}` };

        const { data } = await post<Logout>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.logout).toStrictEqual({
          __typename: "SessionIdValidationError",
          sessionIdError: "Invalid session id",
          status: Status.Error,
        });
      }
    );
  });

  describe("Verify cookie header", () => {
    it.each(verifyE2eCookie)(
      "Return an error response if request header has one or more %s",
      async (_, cookieStr) => {
        const payload = { query: LOGOUT, variables: { sessionId } };
        const options = { authorization: `Bearer ${jwt}`, cookie: cookieStr };

        const { data } = await post<Logout>(url, payload, options);

        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
        expect(data.data?.logout).toStrictEqual({
          __typename: "NotAllowedError",
          message: "Unable to logout",
          status: Status.Error,
        });
      }
    );
  });

  describe("Verify user session", () => {
    it("Should return an error response if user session could not be verified", async () => {
      const payload = { query: LOGOUT, variables: { sessionId: "wrong_id" } };
      const options = { authorization: `Bearer ${jwt}`, cookie: cookies };

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
      const payload = { query: LOGOUT, variables: { sessionId } };
      const options = { authorization: `Bearer ${jwt}`, cookie: cookies };

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
