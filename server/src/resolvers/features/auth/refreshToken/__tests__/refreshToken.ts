import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { sessionMail } from "@services/mail/session";
import { db } from "@services/db";
import { MailError } from "@lib/Errors";
import { unRegisteredUser } from "@utils/tests/mocks";
import { REFRESH_TOKEN as GQL } from "@utils/tests/gqlQueries/authTestQueries";
import { JWT_REGEX } from "@utils/tests/constants";
import { authUsers } from "@utils/tests/createTestUsers/authUsers";
import { testSession } from "@utils/tests/testSession";
import { post } from "@utils/tests/post";
import { loginTestUser } from "@utils/tests/loginTestUser";
import type { APIContext } from "@appTypes";
import type { RefreshData as Data } from "@appTypes/auth/refreshToken";

jest.mock("@services/mail/session");

describe("RefreshData Token", () => {
  let server: ApolloServer<APIContext>, url: string, unregisteredJwt: string;
  let newRegisteredJwt: string, registeredJwt: string;
  let unregisteredCookie1: string, unregisteredCookie2: string;
  let newRegisteredCookie: string, registeredCookie: string;

  beforeAll(async () => {
    const users = await authUsers(db);
    ({ server, url } = await startServer(0));

    [
      unregisteredJwt,
      newRegisteredJwt,
      registeredJwt,
      unregisteredCookie1,
      unregisteredCookie2,
      newRegisteredCookie,
      registeredCookie,
    ] = await Promise.all([
      loginTestUser(users.unregisteredUser.userUUID),
      loginTestUser(users.newRegisteredUser.userUUID),
      loginTestUser(users.registeredUser.userUUID),
      testSession(db, users.unregisteredUser.userId, { isRevoked: true }),
      testSession(db, users.unregisteredUser.userId, { isRevoked: true }),
      testSession(db, users.newRegisteredUser.userId, { isExpired: true }),
      testSession(db, users.registeredUser.userId),
    ]);
  });

  afterAll(async () => {
    await db.query("Truncate TABLE sessions, users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("Verify authentication", () => {
    it("Expect an error response if the user could not be authenticated", async () => {
      const { data, responseHeaders } = await post<Data>(url, { query: GQL });

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.refreshToken).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to refresh token",
        status: "ERROR",
      });
    });

    it("Expect an error response if the request has no session cookie", async () => {
      const payload = { query: GQL };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.refreshToken).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to refresh token",
        status: "ERROR",
      });
    });
  });

  describe("Verify session cookie", () => {
    it("Expect an error response if the refresh token could not be found", async () => {
      const cookie = "auth=475ee532719198d31640ef1ed69ce2c2c7987e";
      const payload = { query: GQL };
      const options = { cookie, authorization: `Bearer ${unregisteredJwt}` };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.refreshToken).toStrictEqual({
        __typename: "UnauthorizedError",
        message: "Unable to refresh token",
        status: "ERROR",
      });
    });

    it("Expect an error response if the user tries to refresh another user's session", async () => {
      const mockSessionMail = jest.mocked(sessionMail).mockName("sessionMail");
      const cookie = unregisteredCookie1;
      const payload = { query: GQL };
      const options = { cookie, authorization: `Bearer ${newRegisteredJwt}` };

      mockSessionMail.mockImplementation(() => {
        throw new MailError("Unable to send session mail");
      });

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.refreshToken).toStrictEqual({
        __typename: "ForbiddenError",
        message: "Unable to refresh token",
        status: "ERROR",
      });
      expect(sessionMail).toHaveBeenCalledTimes(1);
      expect(sessionMail).toHaveBeenCalledWith(unRegisteredUser.email);
      expect(sessionMail).toThrow(MailError);
    });

    it("Expect an error response if the session has been revoked", async () => {
      const cookie = unregisteredCookie2;
      const payload = { query: GQL };
      const options = { cookie, authorization: `Bearer ${unregisteredJwt}` };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.refreshToken).toStrictEqual({
        __typename: "ForbiddenError",
        message: "Unable to refresh token",
        status: "ERROR",
      });
    });

    it("Expect an error response if the session has expired", async () => {
      const cookie = newRegisteredCookie;
      const payload = { query: GQL };
      const options = { cookie, authorization: `Bearer ${newRegisteredJwt}` };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.refreshToken).toStrictEqual({
        __typename: "ForbiddenError",
        message: "Unable to refresh token",
        status: "ERROR",
      });
    });
  });

  describe("Refresh token success", () => {
    it("Should authenticate the user and sign new authentication tokens", async () => {
      const cookie = registeredCookie;
      const payload = { query: GQL };
      const options = { cookie, authorization: `Bearer ${registeredJwt}` };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/^auth/);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.refreshToken).toStrictEqual({
        __typename: "RefreshData",
        accessToken: expect.stringMatching(JWT_REGEX),
        status: "SUCCESS",
      });
    });
  });
});
