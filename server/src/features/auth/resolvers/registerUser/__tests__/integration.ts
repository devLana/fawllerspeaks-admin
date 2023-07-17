/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  describe,
  test,
  expect,
  beforeEach,
  jest,
  afterEach,
} from "@jest/globals";
import { response } from "express";

import resolver from "..";
import { clearCookies } from "@features/auth/utils";

import {
  args,
  cookies,
  mockDate,
  registerMock,
  validateCookie,
  validations,
  verifyUser,
} from "../registerUserTestUtils";
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

describe("Test register user resolver", () => {
  beforeEach(() => {
    mockContext.user = "id_of_this_user";
    mockContext.req.cookies = cookies;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Verify user authentication", () => {
    test("Return an error response if user is not logged in", async () => {
      mockContext.user = null;

      const data = await resolver({}, { userInput: args }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();
      expect(data).toHaveProperty("message", "Unable to register user");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    test.each(validations(undefined))("%s", async (_, userInput, errors) => {
      const data = await resolver({}, { userInput }, mockContext, info);

      expect(data).toHaveProperty("firstNameError", errors.firstNameError);
      expect(data).toHaveProperty("lastNameError", errors.lastNameError);
      expect(data).toHaveProperty("passwordError", errors.passwordError);
      expect(data).toHaveProperty(
        "confirmPasswordError",
        errors.confirmPasswordError
      );
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate cookie header", () => {
    test.each(validateCookie)("%s", async (_, authCookies) => {
      mockContext.req.cookies = authCookies;

      const data = await resolver({}, { userInput: args }, mockContext, info);

      expect(clearCookies).not.toHaveBeenCalled();

      expect(data).toHaveProperty("message", "Unable to register user");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    test.each(verifyUser)(
      "Return an error response if user %s",
      async (_, mock) => {
        const dbSpy = spyDb({ rows: mock });

        const data = await resolver({}, { userInput: args }, mockContext, info);

        expect(clearCookies).toHaveBeenCalledTimes(1);
        expect(clearCookies).toHaveBeenCalledWith(response);

        expect(dbSpy).toHaveBeenCalledTimes(1);
        expect(dbSpy).toHaveReturnedWith({ rows: mock });

        expect(data).toHaveProperty("message", "Unable to register user");
        expect(data).toHaveProperty("status", "ERROR");
      }
    );
  });

  describe("Verify user registration status", () => {
    test("User is already registered, Return an error response", async () => {
      const mock1 = [{ isRegistered: true, sessionId: "Sessi0n_ID" }];
      const dbSpy = spyDb({ rows: mock1 });

      const data = await resolver({}, { userInput: args }, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(1);
      expect(dbSpy).toHaveReturnedWith({ rows: mock1 });

      expect(data).toHaveProperty("message", "User is already registered");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Register user success", () => {
    test("Register an unregistered user, Respond with all user details", async () => {
      const dbSpy = spyDb({ rows: registerMock });
      dbSpy.mockReturnValueOnce({ rows: [] });

      mockContext.req.headers.authorization = "Bearer Jayson_web__T0k3n";

      const data = await resolver({}, { userInput: args }, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(2);
      expect(dbSpy).toHaveNthReturnedWith(1, { rows: registerMock });
      expect(dbSpy).toHaveNthReturnedWith(2, { rows: [] });

      expect(data).toHaveProperty("user.id", "id_of_this_user");
      expect(data).toHaveProperty("user.email", "test@mail.com");
      expect(data).toHaveProperty("user.firstName", args.firstName);
      expect(data).toHaveProperty("user.lastName", args.lastName);
      expect(data).toHaveProperty("user.image", null);
      expect(data).toHaveProperty("user.isRegistered", true);
      expect(data).toHaveProperty("user.dateCreated", mockDate);
      expect(data).toHaveProperty("user.accessToken", "Jayson_web__T0k3n");
      expect(data).toHaveProperty("user.sessionId", "Session_Id");
      expect(data).toHaveProperty("status", "SUCCESS");
    });
  });
});
