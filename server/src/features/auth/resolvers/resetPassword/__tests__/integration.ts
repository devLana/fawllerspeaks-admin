import { describe, test, expect, jest, afterAll } from "@jest/globals";

import resetPassword from "..";

import resetPasswordMail from "../utils/resetPasswordMail";
import { validations } from "../utils/resetPassword.testUtils";
import { MailError } from "@utils";
import { mockContext, info, spyDb } from "@tests";

const email = "test.email@example.com";
const args = {
  token: "token",
  password: "@23passWord#",
  confirmPassword: "@23passWord#",
};

jest.useFakeTimers();
jest.spyOn(global, "clearTimeout");

jest.mock("../utils/resetPasswordMail", () => {
  return jest.fn().mockName("resetPasswordMail");
});

describe("Test reset password resolver", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("Validate user input", () => {
    test.each(validations(undefined))(
      "Return an error object for %s",
      async (_, data, errors) => {
        const result = await resetPassword({}, data, mockContext, info);

        expect(resetPasswordMail).not.toHaveBeenCalled();

        expect(result).toHaveProperty("tokenError", errors.tokenError);
        expect(result).toHaveProperty("passwordError", errors.passwordError);
        expect(result).toHaveProperty(
          "confirmPasswordError",
          errors.confirmPasswordError
        );
        expect(result).toHaveProperty("status", "ERROR");
      }
    );
  });

  describe("Verify provided e-mail address", () => {
    test("Returns error on unknown reset token", async () => {
      const dbSpy = spyDb({ rows: [] });
      const result = await resetPassword({}, args, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(1);
      expect(dbSpy).toHaveReturnedWith({ rows: [] });

      expect(clearTimeout).not.toHaveBeenCalled();
      expect(resetPasswordMail).not.toHaveBeenCalled();

      expect(result).toHaveProperty("message", "Unable to reset password");
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Returns error on unregistered account", async () => {
      const mockData = [{ isRegistered: false, timerId: 100 }];
      const dbSpy = spyDb({ rows: mockData });
      dbSpy.mockReturnValueOnce({ rows: [] });

      const result = await resetPassword({}, args, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(2);
      expect(dbSpy).toHaveNthReturnedWith(1, { rows: mockData });
      expect(dbSpy).toHaveNthReturnedWith(2, { rows: [] });

      expect(clearTimeout).toHaveBeenCalledTimes(1);
      expect(clearTimeout).toHaveBeenCalledWith(100);

      expect(resetPasswordMail).not.toHaveBeenCalled();

      expect(result).toHaveProperty("message", "Unable to reset password");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify provided password reset token", () => {
    test("Successfully verifies password reset token and resets user password", async () => {
      const mockData = [{ isRegistered: true, timerId: 100, email }];
      const dbSpy = spyDb({ rows: mockData }).mockReturnValueOnce({ rows: [] });

      const result = await resetPassword({}, args, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(2);
      expect(dbSpy).toHaveNthReturnedWith(1, { rows: mockData });
      expect(dbSpy).toHaveNthReturnedWith(2, { rows: [] });

      expect(clearTimeout).toHaveBeenCalledTimes(1);
      expect(clearTimeout).toHaveBeenCalledWith(100);

      expect(resetPasswordMail).toHaveBeenCalledTimes(1);
      expect(resetPasswordMail).toHaveBeenCalledWith(email);

      expect(result).toHaveProperty("message", "Your password has been reset");
      expect(result).toHaveProperty("status", "SUCCESS");
    });

    test("Should return a warning if reset password mail throws", async () => {
      const msg = "Unable to send mail";
      const mockData = [{ isRegistered: true, timerId: 100, email }];
      const dbSpy = spyDb({ rows: mockData });
      dbSpy.mockReturnValueOnce({ rows: [] });
      const mock = resetPasswordMail as jest.MockedFunction<() => never>;
      mock.mockImplementation(() => {
        throw new MailError(msg);
      });

      const result = await resetPassword({}, args, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(2);
      expect(dbSpy).toHaveNthReturnedWith(1, { rows: mockData });
      expect(dbSpy).toHaveNthReturnedWith(2, { rows: [] });

      expect(clearTimeout).toHaveBeenCalledTimes(1);
      expect(clearTimeout).toHaveBeenCalledWith(100);

      expect(resetPasswordMail).toHaveBeenCalledTimes(1);
      expect(resetPasswordMail).toThrow(msg);
      expect(resetPasswordMail).toThrow(MailError);

      expect(result).toHaveProperty("message", msg);
      expect(result).toHaveProperty("status", "WARN");
    });
  });
});
