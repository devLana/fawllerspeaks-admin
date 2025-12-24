import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { storageUrl } from "@services/supabase";
import { db } from "@services/db";
import { JWT_REGEX } from "@utils/tests/constants";
import { VERIFY_SESSION } from "@utils/tests/gqlQueries/authTestQueries";
import testSession from "@utils/tests/testSession";
import authUsers from "@utils/tests/createTestUsers/authUsers";
import { registeredUser as registeredTestUser } from "@utils/tests/mocks";
import post from "@utils/tests/post";
import type { APIContext } from "@types";
import type { DbTestUser } from "types/tests";
import type { Verify as GQL } from "types/auth/verifySession";

describe("Verify Session", () => {
  let server: ApolloServer<APIContext>, url: string;
  let registeredUser: DbTestUser, unregisteredCookie: string;
  let newRegisteredCookie: string, registeredCookie: string;

  beforeAll(async () => {
    const users = await authUsers(db);
    ({ server, url } = await startServer(0));
    ({ registeredUser } = users);

    [unregisteredCookie, newRegisteredCookie, registeredCookie] =
      await Promise.all([
        testSession(db, users.unregisteredUser.userId, { isRevoked: true }),
        testSession(db, users.newRegisteredUser.userId, { isExpired: true }),
        testSession(db, registeredUser.userId),
      ]);
  });

  afterAll(async () => {
    await db.query("Truncate TABLE sessions, users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Check request's cookie header", () => {
    it("Expect an error response if there is no authentication cookie", async () => {
      const payload = { query: VERIFY_SESSION };

      const { data, responseHeaders } = await post<GQL>(url, payload);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifySession).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to verify session",
        status: "ERROR",
      });
    });
  });

  describe("Verify the refresh token cookie", () => {
    it("Expect an error response if the refresh token could not be found", async () => {
      const payload = { query: VERIFY_SESSION };
      const options = { cookie: "auth=475ee532719198d31640ef1ed69ce2c2c7987e" };

      const { data, responseHeaders } = await post<GQL>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifySession).toStrictEqual({
        __typename: "AuthenticationError",
        message: "Unable to verify session",
        status: "ERROR",
      });
    });

    it("Expect an error response if the session cookie has been revoked", async () => {
      const options = { cookie: unregisteredCookie };
      const payload = { query: VERIFY_SESSION };

      const { data, responseHeaders } = await post<GQL>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifySession).toStrictEqual({
        __typename: "NotAllowedError",
        message: "Unable to verify session",
        status: "ERROR",
      });
    });

    it("Expect an error response if the session cookie has expired", async () => {
      const options = { cookie: newRegisteredCookie };
      const payload = { query: VERIFY_SESSION };

      const { data, responseHeaders } = await post<GQL>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifySession).toStrictEqual({
        __typename: "NotAllowedError",
        message: "Unable to verify session",
        status: "ERROR",
      });
    });
  });

  describe("Verify user session", () => {
    it("Should authenticate user, Sign a new access token and send user details", async () => {
      const payload = { query: VERIFY_SESSION };
      const options = { cookie: registeredCookie };

      const { data, responseHeaders } = await post<GQL>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/^auth/);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.verifySession).toStrictEqual({
        __typename: "SessionData",
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
