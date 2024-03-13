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

import { clearCookies } from "@features/auth/utils/cookies";
import { validations } from "../utils/logout.testUtils";
import spyDb from "@tests/spyDb";
import { mockContext, info } from "@tests/resolverArguments";

type Module = typeof import("@features/auth/utils/cookies");

jest.mock("@features/auth/utils/cookies", () => {
  const mod = jest.requireActual<Module>("@features/auth/utils/cookies");
  return {
    __esModule: true,
    ...mod,
    clearCookies: jest.fn().mockName("clearCookies"),
  };
});

const cookies = { auth: "auth", sig: "sig", token: "token" };
const sessionId = "session_id_string";

describe("Test logout resolver", () => {
  beforeEach(() => {
    mockContext.req.cookies = {};
    mockContext.user = "new_user_id";
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("Verify user authentication", () => {
    test("Should return an error response if the user is not logged in", async () => {
      mockContext.user = null;

      const result = await logout({}, { sessionId }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Unable to logout");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate session id string", () => {
    test.each(validations)("%s", async (_, id) => {
      const result = await logout({}, { sessionId: id }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();

      expect(result).toHaveProperty("sessionIdError", "Invalid session id");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Request is made with an empty cookie header", () => {
    test("Should return an error response if the user session could not be found", async () => {
      const spy = spyDb({ rows: [] });
      const result = await logout({}, { sessionId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: [] });
      expect(result).toHaveProperty("message", "Unable to logout");
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Should return an error response if the session was not assigned to the logged in user", async () => {
      const spy = spyDb({ rows: [{ user: "not_user_id" }] });
      const result = await logout({}, { sessionId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ user: "not_user_id" }] });
      expect(result).toHaveProperty("message", "Unable to logout");
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Should delete the current session and log the user out", async () => {
      const spy = spyDb({ rows: [{ user: "new_user_id" }] });
      spy.mockReturnValueOnce({ rows: [] });
      const result = await logout({}, { sessionId }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ user: "new_user_id" }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(result).toHaveProperty("message", "User logged out");
      expect(result).toHaveProperty("status", "WARN");
    });
  });

  describe("Validate request cookie", () => {
    test("Should return an error response if the request has a missing cookie", async () => {
      mockContext.req.cookies = { auth: "auth", sig: "sig" };

      const result = await logout({}, { sessionId }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();

      expect(result).toHaveProperty("message", "Unable to logout");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user session", () => {
    test("Should return an error response if the session id is unknown", async () => {
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
    test("Should log the user out and delete the current session", async () => {
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
