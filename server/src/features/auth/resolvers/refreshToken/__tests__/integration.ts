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
  cookies,
  expiredJwt,
  jwToken,
  loggedInUserId,
  sessionId,
  token,
  validJwt,
  validateCookie,
  validateSession,
} from "../utils";
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
    mockContext.user = loggedInUserId;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Verify user authentication", () => {
    test("Return an error response if user is logged out", async () => {
      mockContext.user = null;

      const result = await resolver({}, { sessionId: "" }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();
      expect(setCookies).not.toHaveBeenCalled();
      expect(sessionMail).not.toHaveBeenCalled();

      expect(result).toHaveProperty("message", "Unable to refresh token");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate session id string", () => {
    test.each(validateSession)(
      "Return an error response if session id is an %s string",
      async (_, id) => {
        const result = await resolver({}, { sessionId: id }, mockContext, info);

        expect(clearCookies).not.toHaveBeenCalled();
        expect(setCookies).not.toHaveBeenCalled();
        expect(sessionMail).not.toHaveBeenCalled();

        expect(result).toHaveProperty("sessionIdError", "Invalid session id");
        expect(result).toHaveProperty("status", "ERROR");
      }
    );
  });

  describe("Validate request cookie", () => {
    test.each(validateCookie)(
      "Return an error response if the request cookie %s",
      async (_, authCookies) => {
        mockContext.req.cookies = authCookies;

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(sessionMail).not.toHaveBeenCalled();
        expect(setCookies).not.toHaveBeenCalled();

        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);

        expect(result).toHaveProperty("message", "Unable to refresh token");
        expect(result).toHaveProperty("status", "ERROR");
      }
    );
  });

  describe("Verify cookie refresh token", () => {
    describe("Invalid refresh token", () => {
      test("Return an error response if token verification throws a JsonWebTokenError", async () => {
        mockVerify.mockImplementation(() => {
          throw new JsonWebTokenError("Invalid refresh token string");
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(sessionMail).not.toHaveBeenCalled();
        expect(setCookies).not.toHaveBeenCalled();

        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toThrow(JsonWebTokenError);
        expect(verify).toThrow("Invalid refresh token string");

        expect(result).toHaveProperty("message", "Unable to refresh token");
        expect(result).toHaveProperty("status", "ERROR");
      });
    });

    describe("Expired refresh token", () => {
      test.each(expiredJwt)(
        "Return an error response if session id %s",
        async (_, data) => {
          const spy = spyDb({ rows: data });

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
          expect(spy).toHaveReturnedWith({ rows: data });

          expect(result).toHaveProperty("message", "Unable to refresh token");
          expect(result).toHaveProperty("status", "ERROR");
        }
      );

      test("Session refresh token does not match cookie refresh token, Return an error response and send a notification mail", async () => {
        const email = "test@mail.com";
        const data = [{ refreshToken: token, user: loggedInUserId, email }];

        const spy = spyDb({ rows: data }).mockReturnValueOnce({ rows: [] });

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

      test("Return an error response if session refresh token does not match cookie refresh token and session mail failed to send", async () => {
        const email = "test@mail.com";
        const data = [{ refreshToken: token, user: loggedInUserId, email }];
        const spy = spyDb({ rows: data }).mockReturnValueOnce({ rows: [] });

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

      test("Refresh tokens, Renew expired refresh token and send new access token", async () => {
        const email = "test@mail.com";
        const data = [{ refreshToken: jwToken, user: loggedInUserId, email }];

        const spy = spyDb({ rows: data });
        spy.mockReturnValueOnce({ rows: [] });

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
      test("Return an error response if refresh token was not signed for the current user", async () => {
        const spy = spyDb({ rows: [] });

        mockVerify.mockReturnValueOnce({ sub: "notLoggedInUserId" });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveReturnedWith({ rows: [] });

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toHaveReturnedWith({ sub: "notLoggedInUserId" });

        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);

        expect(sessionMail).not.toHaveBeenCalled();
        expect(setCookies).not.toHaveBeenCalled();

        expect(result).toHaveProperty("message", "Unable to refresh token");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test.each(validJwt)("Return an error response if %s", async (_, data) => {
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

      test("Return an error response if session refresh token does not match the cookie refresh token and notification mail failed to send", async () => {
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

      test("Refresh tokens, Renew refresh token and send new access token", async () => {
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
