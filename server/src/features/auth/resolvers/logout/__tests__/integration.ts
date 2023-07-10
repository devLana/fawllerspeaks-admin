/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterAll,
} from "@jest/globals";

import logout from "..";
import { clearCookies } from "@features/auth/utils";

import { validateCookie, validations } from "../logoutTestUtils";
import { mockContext, info, spyDb } from "@tests";

type Module = typeof import("@features/auth/utils");

jest.mock("@features/auth/utils", () => {
  const actualModule = jest.requireActual<Module>("@features/auth/utils");
  return {
    __esModule: true,
    ...actualModule,
    clearCookies: jest.fn().mockName("clearCookies"),
  };
});

const cookies = { auth: "auth", sig: "sig", token: "token" };
const sessionId = "session_id_string";

describe("Test logout resolver", () => {
  beforeEach(() => {
    mockContext.user = "user_user_id";
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("Verify user authentication", () => {
    test("Return an error if user is not logged in", async () => {
      mockContext.user = null;

      const result = await logout({}, { sessionId }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Unable to logout");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate session id string", () => {
    test.each(validations)(
      "Return an error if session id is an %s string",
      async (_, id) => {
        const result = await logout({}, { sessionId: id }, mockContext, info);

        expect(clearCookies).not.toHaveBeenCalled();

        expect(result).toHaveProperty("sessionIdError", "Invalid session id");
        expect(result).toHaveProperty("status", "ERROR");
      }
    );
  });

  describe("Validate refresh token cookies", () => {
    test.each(validateCookie)(
      "Return an error if request cookie is %s",
      async (_, authCookies) => {
        mockContext.req.cookies = authCookies;

        const result = await logout({}, { sessionId }, mockContext, info);

        expect(clearCookies).not.toHaveBeenCalled();

        expect(result).toHaveProperty("message", "Unable to logout");
        expect(result).toHaveProperty("status", "ERROR");
      }
    );
  });

  describe("Verify session id string", () => {
    test("Return an error if session id is unknown", async () => {
      mockContext.req.cookies = cookies;

      const spy = spyDb({ rows: [] });
      const result = await logout({}, { sessionId }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: [] });
      expect(result).toHaveProperty("message", "Unable to logout");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Successfully log user out", () => {
    test("Log user out and delete session", async () => {
      mockContext.req.cookies = cookies;

      const spy = spyDb({ rows: [{}] }).mockReturnValueOnce({ rows: [] });
      const result = await logout({}, { sessionId }, mockContext, info);

      expect(clearCookies).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{}] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(result).toHaveProperty("message", "User logged out");
      expect(result).toHaveProperty("status", "SUCCESS");
    });
  });
});
