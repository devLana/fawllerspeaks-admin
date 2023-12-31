/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  test,
  expect,
  describe,
  jest,
  afterEach,
  beforeAll,
} from "@jest/globals";
import bcrypt from "bcrypt";

import login from "..";

import {
  args,
  cookies,
  dateCreated,
  mockUser,
  validations,
} from "../utils/login.testUtils";
import { setCookies, JWT_REGEX, SESSION_ID_REGEX } from "@features/auth/utils";
import { mockContext, info, spyDb } from "@tests";

type Module = typeof import("@features/auth/utils");

jest.mock("@features/auth/utils", () => {
  const actualModule = jest.requireActual<Module>("@features/auth/utils");
  return {
    __esModule: true,
    ...actualModule,
    setCookies: jest.fn().mockName("setCookies"),
  };
});

describe("Test login resolver", () => {
  beforeAll(() => {
    mockContext.req.cookies = {};
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Validate user input", () => {
    test.each(validations(undefined))("%s", async (_, data, errors) => {
      const result = await login({}, data, mockContext, info);

      expect(setCookies).not.toHaveBeenCalled();

      expect(result).toHaveProperty("emailError", errors[0]);
      expect(result).toHaveProperty("passwordError", errors[1]);
      expect(result).toHaveProperty("sessionIdError", errors[2]);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify e-mail and password", () => {
    test("Should return an error response if the e-mail address is unknown", async () => {
      const dbSpy = spyDb({ rows: [] });

      const result = await login({}, args, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(1);
      expect(dbSpy).toHaveReturnedWith({ rows: [] });
      expect(setCookies).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Invalid email or password");
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Should return an error response if the login credentials do not match", async () => {
      const hash = await bcrypt.hash("noT_password123", 10);
      const user = { userPassword: hash, userId: "user id" };
      const dbSpy = spyDb({ rows: [user] });

      const result = await login({}, args, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(1);
      expect(dbSpy).toHaveReturnedWith({ rows: [user] });
      expect(setCookies).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Invalid email or password");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("User is already logged in and has an active session", () => {
    afterEach(() => {
      mockContext.req.cookies = {};
    });

    test("Should use cookies to delete session from db, Return an error response if the e-mail address is unknown", async () => {
      mockContext.req.cookies = cookies;

      const dbSpy = spyDb({ rows: [] }).mockReturnValueOnce({ rows: [] });

      const result = await login({}, args, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(2);
      expect(dbSpy).toHaveNthReturnedWith(1, { rows: [] });
      expect(dbSpy).toHaveNthReturnedWith(2, { rows: [] });
      expect(setCookies).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Invalid email or password");
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Should use the session id to delete session from db, Return an error response if the login credentials do not match", async () => {
      const hash = await bcrypt.hash("noT_password123", 10);
      const user = { userPassword: hash, userId: "user id" };
      const dbSpy = spyDb({ rows: [] }).mockReturnValueOnce({ rows: [user] });
      const input = { ...args, sessionId: "session_id" };

      const result = await login({}, input, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(2);
      expect(dbSpy).toHaveNthReturnedWith(1, { rows: [] });
      expect(dbSpy).toHaveNthReturnedWith(2, { rows: [user] });
      expect(setCookies).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Invalid email or password");
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Should delete session from db, Log the user in again", async () => {
      const hash = await bcrypt.hash(args.password, 10);
      const user = { ...mockUser, userPassword: hash };
      const spy = spyDb({ rows: [] });
      spy.mockReturnValueOnce({ rows: [user] });
      spy.mockReturnValueOnce({ rows: [] });

      mockContext.req.cookies = cookies;

      const result = await login({}, args, mockContext, info);

      expect(spy).toBeCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: [] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [user] });
      expect(spy).toHaveNthReturnedWith(3, { rows: [] });
      expect(setCookies).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("user.email", user.userEmail);
      expect(result).toHaveProperty("user.id", user.userId);
      expect(result).toHaveProperty("user.firstName", user.firstName);
      expect(result).toHaveProperty("user.lastName", user.lastName);
      expect(result).toHaveProperty("user.image", user.image);
      expect(result).toHaveProperty("user.isRegistered", user.isRegistered);
      expect(result).toHaveProperty("user.dateCreated", dateCreated);
      expect(result).toHaveProperty(
        "accessToken",
        expect.stringMatching(JWT_REGEX)
      );
      expect(result).toHaveProperty(
        "sessionId",
        expect.stringMatching(SESSION_ID_REGEX)
      );
      expect(result).toHaveProperty("status", "SUCCESS");
    });
  });

  describe("Successfully log in user", () => {
    test("Should log the user in and return user details", async () => {
      const hash = await bcrypt.hash(args.password, 10);
      const user = { ...mockUser, userPassword: hash };

      const spy = spyDb({ rows: [user] }).mockReturnValueOnce({ rows: [] });

      const result = await login({}, args, mockContext, info);

      expect(spy).toBeCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [user] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(setCookies).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("user.email", user.userEmail);
      expect(result).toHaveProperty("user.id", user.userId);
      expect(result).toHaveProperty("user.firstName", user.firstName);
      expect(result).toHaveProperty("user.lastName", user.lastName);
      expect(result).toHaveProperty("user.image", user.image);
      expect(result).toHaveProperty("user.isRegistered", user.isRegistered);
      expect(result).toHaveProperty("user.dateCreated", dateCreated);
      expect(result).toHaveProperty(
        "accessToken",
        expect.stringMatching(JWT_REGEX)
      );
      expect(result).toHaveProperty(
        "sessionId",
        expect.stringMatching(SESSION_ID_REGEX)
      );
      expect(result).toHaveProperty("status", "SUCCESS");
    });
  });
});
