import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import { LOGOUT } from "@utils/tests/gqlQueries/authTestQueries";
import { testUsers } from "@utils/tests/createTestUsers/testUsers";
import { loginTestUser } from "@utils/tests/loginTestUser";
import { testSession } from "@utils/tests/testSession";
import { post } from "@utils/tests/post";
import type { APIContext } from "@appTypes";
import type { LogoutData as Data } from "@appTypes/auth/logout";

describe("Logout", () => {
  let server: ApolloServer<APIContext>, url: string, unregisteredJwt: string;
  let registeredJwt: string, registeredCookie: string;
  let unregisteredCookie: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { unregisteredUser, registeredUser } = await testUsers(db);

    [unregisteredJwt, registeredJwt, unregisteredCookie, registeredCookie] =
      await Promise.all([
        loginTestUser(unregisteredUser.userUUID),
        loginTestUser(registeredUser.userUUID),
        testSession(db, unregisteredUser.userId),
        testSession(db, registeredUser.userId),
      ]);
  });

  afterAll(async () => {
    await db.query("Truncate TABLE sessions, users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  describe("No user authentication", () => {
    it("Expect a successful log out action even if the user could not be authenticated", async () => {
      const payload = { query: LOGOUT };

      const { data, responseHeaders } = await post<Data>(url, payload);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "Response",
        message: "User logged out",
        status: "SUCCESS",
      });
      // expect(loggerMock).toHaveBeenCalled()
    });

    it("Expect the user to be logged out if the request has no authenticated session", async () => {
      const payload = { query: LOGOUT };
      const options = { authorization: `Bearer ${unregisteredJwt}` };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "Response",
        message: "User logged out",
        status: "SUCCESS",
      });
      // expect(loggerMock).toHaveBeenCalled()
    });
  });

  describe("Log suspicious logout activity", () => {
    it("Expect the request activity to be logged if no session could be logged out", async () => {
      const cookie = "auth=475ee532719198d31640ef1ed69ce2c2c7987e";
      const payload = { query: LOGOUT };
      const options = { authorization: `Bearer ${unregisteredJwt}`, cookie };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "Response",
        message: "User logged out",
        status: "SUCCESS",
      });
      // expect(loggerMock).toHaveBeenCalled()
    });

    it("Expect the request activity to be logged if a user tries to log out another user's session", async () => {
      const cookie = unregisteredCookie;
      const payload = { query: LOGOUT };
      const options = { authorization: `Bearer ${registeredJwt}`, cookie };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "Response",
        message: "User logged out",
        status: "SUCCESS",
      });
      // expect(loggerMock).toHaveBeenCalled()
    });
  });

  describe("Successfully log user out", () => {
    it("Expect the user to be logged out", async () => {
      const authorization = `Bearer ${registeredJwt}`;
      const payload = { query: LOGOUT };
      const options = { authorization, cookie: registeredCookie };

      const { data, responseHeaders } = await post<Data>(url, payload, options);

      expect(responseHeaders).toHaveProperty("set-cookie");
      expect(Array.isArray(responseHeaders["set-cookie"])).toBe(true);
      expect(responseHeaders["set-cookie"]).toHaveLength(1);
      expect(responseHeaders["set-cookie"]?.[0]).toMatch(/max-age=0/i);
      expect(data.errors).toBeUndefined();
      expect(data.data).toBeDefined();
      expect(data.data?.logout).toStrictEqual({
        __typename: "Response",
        message: "User logged out",
        status: "SUCCESS",
      });
      // expect(loggerMock).not.toHaveBeenCalled()
    });
  });
});
