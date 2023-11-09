/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

import { response } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import resolver from "..";
import { verify } from "@lib/tokenPromise";

import {
  clearCookies,
  setCookies,
  sessionMail,
  JWT_REGEX,
} from "@features/auth/utils";
import {
  authCookies,
  cookies,
  data,
  dateCreated,
  email,
  loggedInUserId,
  mockObj,
  obj,
  sessionId,
  validations,
} from "../utils/verifySession.testUtils";
import { MailError } from "@utils";
import { mockContext, info, spyDb } from "@tests";

type Module = typeof import("");

jest.mock("@lib/tokenPromise", () => {
  const mod = jest.requireActual<Module>("@lib/tokenPromise");
  return { __esModule: true, ...mod, verify: jest.fn().mockName("verify") };
});

jest.mock("@features/auth/utils", () => {
  const actualModule = jest.requireActual<Module>("@features/auth/utils");

  return {
    __esModule: true,
    ...actualModule,
    clearCookies: jest.fn().mockName("clearCookies"),
    sessionMail: jest.fn().mockName("sessionMail"),
    setCookies: jest.fn().mockName("setCookies"),
  };
});

describe("Test verify session resolver", () => {
  beforeEach(() => {
    mockContext.req.cookies = cookies;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Validate session id string", () => {
    test.each(validations)("%s", async (_, id) => {
      const result = await resolver({}, { sessionId: id }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();
      expect(result).toHaveProperty("sessionIdError", "Invalid session id");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate cookie request header", () => {
    test("Should return an error response if the request cookie header has no cookies", async () => {
      mockContext.req.cookies = {};

      const result = await resolver({}, { sessionId }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Unable to verify session");
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Should return an error response if the request cookie header has a missing cookie", async () => {
      mockContext.req.cookies = { auth: "auth", token: "token" };

      const result = await resolver({}, { sessionId }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Unable to verify session");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify cookie refresh token", () => {
    const verifyMock = verify as jest.MockedFunction<() => unknown>;
    const mockMailFn = sessionMail as jest.MockedFunction<() => never>;

    describe("Invalid refresh token", () => {
      test("Verification throws a JsonWebTokenError, Should return an error response", async () => {
        verifyMock.mockImplementation(() => {
          throw new JsonWebTokenError("Invalid refresh token string");
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(clearCookies).not.toHaveBeenCalled();
        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toThrow(JsonWebTokenError);
        expect(verify).toThrow("Invalid refresh token string");
        expect(result).toHaveProperty("message", "Unable to verify session");
        expect(result).toHaveProperty("status", "ERROR");
      });
    });

    describe("Expired refresh token", () => {
      test("Should return an error response if the session id is unknown", async () => {
        const spy = spyDb({ rows: [] });

        verifyMock.mockImplementation(() => {
          throw new TokenExpiredError("Expired refresh token", new Date());
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(clearCookies).not.toHaveBeenCalled();
        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toThrow(TokenExpiredError);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveReturnedWith({ rows: [] });
        expect(result).toHaveProperty("message", "Unable to verify session");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("The provided session was not assigned to the user of the cookie refresh token, Return an error response and send a mail notification", async () => {
        const mockData = [{ userId: "loggedInUserId", email }];
        const spy = spyDb({ rows: mockData }).mockReturnValueOnce({ rows: [] });

        mockContext.req.cookies = authCookies;
        verifyMock.mockImplementation(() => {
          throw new TokenExpiredError("Expired refresh token", new Date());
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toThrow(TokenExpiredError);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: mockData });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(email);
        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);
        expect(result).toHaveProperty("message", "Unable to verify session");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("Should return an error response if the provided session was not assigned to the user of the cookie refresh token and the mail notification failed to send", async () => {
        const mockData = [{ userId: "loggedInUserId", email }];
        const spy = spyDb({ rows: mockData }).mockReturnValueOnce({ rows: [] });

        mockContext.req.cookies = authCookies;
        verifyMock.mockImplementation(() => {
          throw new TokenExpiredError("Expired refresh token", new Date());
        });

        mockMailFn.mockImplementation(() => {
          throw new MailError("Unable to send session mail");
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toThrow(TokenExpiredError);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: mockData });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(email);
        expect(sessionMail).toThrow(MailError);
        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);
        expect(result).toHaveProperty("message", "Unable to verify session");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("Verify user session, Sign new access token and send user details ", async () => {
        const mockData = [{ ...obj }];
        const spy = spyDb({ rows: mockData }).mockReturnValue({ rows: [] });

        mockContext.req.cookies = authCookies;
        verifyMock.mockImplementation(() => {
          throw new TokenExpiredError("Expired refresh token", new Date());
        });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toThrow(TokenExpiredError);
        expect(setCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).not.toHaveBeenCalled();
        expect(sessionMail).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: mockData });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(result).toHaveProperty("user");
        expect(result).toHaveProperty("user.email", data.email);
        expect(result).toHaveProperty("user.id", obj.userId);
        expect(result).toHaveProperty("user.firstName", data.firstName);
        expect(result).toHaveProperty("user.lastName", data.lastName);
        expect(result).toHaveProperty("user.image", data.image);
        expect(result).toHaveProperty("user.isRegistered", obj.isRegistered);
        expect(result).toHaveProperty("user.dateCreated", dateCreated);
        expect(result).toHaveProperty(
          "accessToken",
          expect.stringMatching(JWT_REGEX)
        );
        expect(result).toHaveProperty("status", "SUCCESS");
      });
    });

    describe("Valid and not expired refresh token", () => {
      test("Should return an error response if the session id is unknown", async () => {
        const spy = spyDb({ rows: [] });

        verifyMock.mockReturnValueOnce({ sub: loggedInUserId });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toHaveReturnedWith({ sub: loggedInUserId });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveReturnedWith({ rows: [] });
        expect(clearCookies).not.toHaveBeenCalled();
        expect(result).toHaveProperty("message", "Unable to verify session");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("The provided session was not assigned to the user of the cookie refresh token, Return an error response and send a mail notification", async () => {
        verifyMock.mockReturnValue({ sub: loggedInUserId });

        const mock = [{ userId: "loggedInUserId", email }];
        const spy = spyDb({ rows: mock }).mockReturnValueOnce({ rows: [] });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toHaveReturnedWith({ sub: loggedInUserId });
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: mock });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(email);
        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);
        expect(result).toHaveProperty("message", "Unable to verify session");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("Should return an error response if the provided session was not assigned to the user of the cookie refresh token and the notification mail failed to send", async () => {
        verifyMock.mockReturnValue({ sub: loggedInUserId });

        mockMailFn.mockImplementation(() => {
          throw new MailError("Unable to send session mail");
        });

        const mock = [{ userId: "loggedInUserId", email }];
        const spy = spyDb({ rows: mock }).mockReturnValueOnce({ rows: [] });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toHaveReturnedWith({ sub: loggedInUserId });
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: mock });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(sessionMail).toHaveBeenCalledTimes(1);
        expect(sessionMail).toHaveBeenCalledWith(email);
        expect(sessionMail).toThrow(MailError);
        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);
        expect(result).toHaveProperty("message", "Unable to verify session");
        expect(result).toHaveProperty("status", "ERROR");
      });

      test("Verify user session, Sign a new access token and send user details", async () => {
        verifyMock.mockReturnValueOnce({ sub: loggedInUserId });

        const spy = spyDb({ rows: [mockObj] }).mockReturnValue({ rows: [] });

        const result = await resolver({}, { sessionId }, mockContext, info);

        expect(verify).toHaveBeenCalledTimes(1);
        expect(verify).toHaveReturnedWith({ sub: loggedInUserId });
        expect(setCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).not.toHaveBeenCalled();
        expect(sessionMail).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveNthReturnedWith(1, { rows: [mockObj] });
        expect(spy).toHaveNthReturnedWith(2, { rows: [] });
        expect(result).toHaveProperty("user");
        expect(result).toHaveProperty("user.email", data.email);
        expect(result).toHaveProperty("user.id", loggedInUserId);
        expect(result).toHaveProperty("user.firstName", data.firstName);
        expect(result).toHaveProperty("user.lastName", data.lastName);
        expect(result).toHaveProperty("user.image", data.image);
        expect(result).toHaveProperty("user.isRegistered", true);
        expect(result).toHaveProperty("user.dateCreated", dateCreated);
        expect(result).toHaveProperty(
          "accessToken",
          expect.stringMatching(JWT_REGEX)
        );
        expect(result).toHaveProperty("status", "SUCCESS");
      });
    });
  });
});
