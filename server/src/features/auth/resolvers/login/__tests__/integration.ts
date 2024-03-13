/* eslint-disable @typescript-eslint/consistent-type-imports */
import { test, expect, describe, jest, afterEach } from "@jest/globals";
import bcrypt from "bcrypt";

import login from "..";

import {
  args,
  dateCreated,
  mockUser,
  validations,
} from "../utils/login.testUtils";
import { setCookies } from "@features/auth/utils/cookies";
import { JWT_REGEX, SESSION_ID_REGEX } from "@tests/constants";
import { mockContext, info } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";

type Module = typeof import("@features/auth/utils/cookies");

jest.mock("@utils/deleteSession");

jest.mock("@features/auth/utils/cookies", () => {
  const mod = jest.requireActual<Module>("@features/auth/utils/cookies");
  return {
    __esModule: true,
    ...mod,
    setCookies: jest.fn().mockName("setCookies"),
  };
});

describe("Test login resolver", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Validate user input", () => {
    test.each(validations(undefined))("%s", async (_, data, errors) => {
      const result = await login({}, data, mockContext, info);

      expect(setCookies).not.toHaveBeenCalled();

      expect(result).toHaveProperty("emailError", errors[0]);
      expect(result).toHaveProperty("passwordError", errors[1]);
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
