/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { response } from "express";

import resolver from "..";
import { verify } from "@lib/tokenPromise";

import {
  clearCookies,
  sessionMail,
  setCookies,
  JWT_REGEX,
} from "@features/auth/utils";
import {
  authCookies,
  authToken,
  authUserId,
  cookies,
  jwToken,
  loggedInUserId,
  sessionId,
  token,
  validJwt,
  validateSession,
} from "../utils/refreshToken.testUtils";
import { MailError } from "@utils";
import { mockContext, info, spyDb } from "@tests";

type Module = typeof import("");

jest.mock("@lib/tokenPromise", () => {
  const mod = jest.requireActual<Module>("@lib/tokenPromise");
  return { __esModule: true, ...mod, verify: jest.fn().mockName("verify") };
});

jest.mock("@features/auth/utils", () => {
  const mod = jest.requireActual<Module>("@features/auth/utils");
  return {
    __esModule: true,
    ...mod,
    clearCookies: jest.fn().mockName("clearCookies"),
    sessionMail: jest.fn().mockName("sessionMail"),
    setCookies: jest.fn().mockName("setCookies"),
  };
});

const mockVerify = verify as jest.MockedFunction<() => unknown>;
const mockSessionMail = sessionMail as jest.MockedFunction<() => unknown>;

describe("Test refresh token resolver", () => {
  beforeEach(() => {
    mockContext.req.cookies = cookies;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Validate session id string", () => {
    test.each(validateSession)("%s", async (_, id) => {
      const result = await resolver({}, { sessionId: id }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();
      expect(setCookies).not.toHaveBeenCalled();
      expect(sessionMail).not.toHaveBeenCalled();
      expect(result).toHaveProperty("sessionIdError", "Invalid session id");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate request cookie header", () => {
    test("Should Should return an error response if the request has no cookies", async () => {
      mockContext.req.cookies = {};

      const result = await resolver({}, { sessionId }, mockContext, info);

      expect(sessionMail).not.toHaveBeenCalled();
      expect(setCookies).not.toHaveBeenCalled();
      expect(clearCookies).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Unable to refresh token");
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Should Should return an error response if the request has missing cookie fields", async () => {
      mockContext.req.cookies = { auth: "auth", sig: "sig" };

      const result = await resolver({}, { sessionId }, mockContext, info);

      expect(sessionMail).not.toHaveBeenCalled();
      expect(setCookies).not.toHaveBeenCalled();
      expect(clearCookies).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Unable to refresh token");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify cookie refresh token", () => {
    describe("Invalid refresh token", () => {
      test("Should return an error response if token verification throws a JsonWebTokenError", async () => {
        mockVerify.mockImplementation(() => {
          throw new JsonWebTokenError("Invalid refresh token string");
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(sessionMail).not.toHaveBeenCalled();
        expect(setCookies).not.toHaveBeenCalled();
        expect(clearCookies).not.toHaveBeenCalled();
        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toThrow(JsonWebTokenError);
        expect(verify).toThrow("Invalid refresh token string");
        expect(result).toHaveProperty("message", "Unable to refresh token");
        expect(result).toHaveProperty("status", "ERROR");
      });
    });

    describe("Expired refresh token", () => {
      test("Should return an error response if the session id is unknown", async () => {
        const spy = spyDb({ rows: [] });

        mockVerify.mockImplementation(() => {
          throw new TokenExpiredError("Expired refresh token", new Date());
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(clearCookies).not.toHaveBeenCalled();
        expect(setCookies).not.toHaveBeenCalled();
        expect(sessionMail).not.toHaveBeenCalled();
        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toThrow(TokenExpiredError);
        expect(verify).toThrow("Expired refresh token");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveReturnedWith({ rows: [] });
        expect(result).toHaveProperty("message", "Unable to refresh token");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("Current session was not assigned to the user of the cookie refresh token, Return an error response", async () => {
        const spy = spyDb({ rows: [{ user: loggedInUserId }] });

        mockContext.req.cookies = authCookies;
        mockVerify.mockImplementation(() => {
          throw new TokenExpiredError("Expired refresh token", new Date());
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(clearCookies).not.toHaveBeenCalled();
        expect(setCookies).not.toHaveBeenCalled();
        expect(sessionMail).not.toHaveBeenCalled();
        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toThrow(TokenExpiredError);
        expect(verify).toThrow("Expired refresh token");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveReturnedWith({ rows: [{ user: loggedInUserId }] });
        expect(result).toHaveProperty("message", "Unable to refresh token");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("Session refresh token does not match cookie refresh token, Return an error response and send a notification mail", async () => {
        const email = "test@mail.com";
        const data = [{ refreshToken: token, user: authUserId, email }];
        const spy = spyDb({ rows: data }).mockReturnValueOnce({ rows: [] });

        mockContext.req.cookies = authCookies;
        mockVerify.mockImplementation(() => {
          throw new TokenExpiredError("Expired refresh token", new Date());
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toThrow(TokenExpiredError);
        expect(verify).toThrow("Expired refresh token");
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: data });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(email);
        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);
        expect(setCookies).not.toHaveBeenCalled();
        expect(result).toHaveProperty("message", "Unable to refresh token");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("Session's refresh token does not match the cookie's refresh token and the session confirmation mail failed to send, Return an error response", async () => {
        const email = "test@mail.com";
        const data = [{ refreshToken: token, user: authUserId, email }];
        const spy = spyDb({ rows: data }).mockReturnValueOnce({ rows: [] });

        mockContext.req.cookies = authCookies;
        mockVerify.mockImplementation(() => {
          throw new TokenExpiredError("Expired refresh token", new Date());
        });

        mockSessionMail.mockImplementation(() => {
          throw new MailError("Unable to send session mail");
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toThrow(TokenExpiredError);
        expect(verify).toThrow("Expired refresh token");
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: data });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(email);
        expect(sessionMail).toThrow(MailError);
        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);
        expect(setCookies).not.toHaveBeenCalled();
        expect(result).toHaveProperty("message", "Unable to refresh token");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("Refresh tokens, Renew expired refresh token and send a new access token", async () => {
        const email = "test@mail.com";
        const data = [{ refreshToken: authToken, user: authUserId, email }];
        const spy = spyDb({ rows: data }).mockReturnValueOnce({ rows: [] });

        mockContext.req.cookies = authCookies;
        mockVerify.mockImplementation(() => {
          throw new TokenExpiredError("Expired refresh token", new Date());
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalled();
        expect(verify).toThrow("Expired refresh token");
        expect(verify).toThrow(TokenExpiredError);
        expect(setCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).not.toHaveBeenCalled();
        expect(sessionMail).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: data });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(result).toHaveProperty("status", "SUCCESS");
        expect(result).toHaveProperty(
          "accessToken",
          expect.stringMatching(JWT_REGEX)
        );
      });
    });

    describe("Valid and not expired refresh token", () => {
      test.each(validJwt)("%s", async (_, data) => {
        const spy = spyDb({ rows: data });

        mockVerify.mockReturnValueOnce({ sub: loggedInUserId });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toHaveReturnedWith({ sub: loggedInUserId });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveReturnedWith({ rows: data });
        expect(clearCookies).not.toHaveBeenCalled();
        expect(setCookies).not.toHaveBeenCalled();
        expect(sessionMail).not.toHaveBeenCalled();
        expect(result).toHaveProperty("message", "Unable to refresh token");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("Session refresh token does not match the cookie refresh token, Return an error response and send a notification mail", async () => {
        const email = "eample_mail@test.org";
        const data = [{ refreshToken: token, user: loggedInUserId, email }];
        const spy = spyDb({ rows: data }).mockReturnValue({ rows: [] });

        mockVerify.mockReturnValue({ sub: loggedInUserId });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalled();
        expect(verify).toHaveReturnedWith({ sub: loggedInUserId });
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: data });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(email);
        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);
        expect(setCookies).not.toHaveBeenCalled();
        expect(result).toHaveProperty("message", "Unable to refresh token");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("Session's refresh token does not match the cookie's refresh token and the session confirmation mail failed to send, Return an error response", async () => {
        const email = "eample_mail@test.org";
        const data = [{ refreshToken: token, user: loggedInUserId, email }];
        const spy = spyDb({ rows: data }).mockReturnValue({ rows: [] });

        mockVerify.mockReturnValue({ sub: loggedInUserId });
        mockSessionMail.mockImplementation(() => {
          throw new MailError("Unable to send session mail");
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalled();
        expect(verify).toHaveReturnedWith({ sub: loggedInUserId });

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: data });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(email);
        expect(sessionMail).toThrow(MailError);
        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);
        expect(setCookies).not.toHaveBeenCalled();
        expect(result).toHaveProperty("message", "Unable to refresh token");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("Refresh tokens, Renew refresh token and send a new access token", async () => {
        const email = "eample_mail@test.org";
        const data = [{ refreshToken: jwToken, user: loggedInUserId, email }];
        const spy = spyDb({ rows: data }).mockReturnValueOnce({ rows: [] });

        mockVerify.mockReturnValueOnce({ sub: loggedInUserId });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toHaveReturnedWith({ sub: loggedInUserId });
        expect(setCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).not.toHaveBeenCalled();
        expect(sessionMail).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: data });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(result).toHaveProperty("status", "SUCCESS");
        expect(result).toHaveProperty(
          "accessToken",
          expect.stringMatching(JWT_REGEX)
        );
      });
    });
  });
});
