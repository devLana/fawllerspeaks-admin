import {
  describe,
  test,
  expect,
  jest,
  afterEach,
  afterAll,
} from "@jest/globals";

import resolver from "..";

import forgotPasswordMail from "../utils/forgotPasswordMail";
import { validations } from "../utils/forgotPassword.testUtils";
import { MailError } from "@utils";
import { mockContext, info, spyDb } from "@tests";

const email = "test_mail@example.com";

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");
jest.spyOn(global, "clearTimeout");

jest.mock("../utils/forgotPasswordMail", () => {
  return jest.fn().mockName("forgotPasswordMail");
});

describe("Test forgot password resolver", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("Validate user input", () => {
    test.each(validations)(
      "E-Mail validation fails, Return an error for %s email string",
      async (_, data, errorMsg) => {
        const result = await resolver({}, { email: data }, mockContext, info);

        expect(forgotPasswordMail).not.toHaveBeenCalled();

        expect(result).toHaveProperty("emailError", errorMsg);
        expect(result).toHaveProperty("status", "ERROR");
      }
    );
  });

  describe("Verify e-mail address", () => {
    test("Return error for unknown e-mail address", async () => {
      const spy = spyDb({ rows: [] });

      const result = await resolver({}, { email }, mockContext, info);

      expect(forgotPasswordMail).not.toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({ rows: [] });

      expect(result).toHaveProperty(
        "message",
        "Unable to reset the password for this user"
      );
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Return error for email with unregistered account", async () => {
      const user = { isRegistered: false };
      const spy = spyDb({ rows: [user] });

      const result = await resolver({}, { email }, mockContext, info);

      expect(forgotPasswordMail).not.toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({ rows: [user] });

      expect(result).toHaveProperty(
        "message",
        "Unable to reset password for unregistered user"
      );
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Generate password reset link", () => {
    test("Send confirmation mail with the password reset link", async () => {
      const user = { isRegistered: true };
      const spy = spyDb({ rows: [user] }).mockReturnValue({ rows: [] });

      const result = await resolver({}, { email }, mockContext, info);

      jest.runAllTimers();

      expect(forgotPasswordMail).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveReturnedTimes(3);
      expect(spy).toHaveLastReturnedWith({ rows: [] });

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        303_000,
        email
      );

      expect(result).toHaveProperty(
        "message",
        "Your request is being processed and a mail will be sent to you shortly if that email address exists"
      );
      expect(result).toHaveProperty("status", "SUCCESS");
    });

    test("Confirmation mail fails to send, Invalidate generated password reset link", async () => {
      const msg = "Unable to send mail";
      const user = { isRegistered: true };
      const spy = spyDb({ rows: [user] }).mockReturnValue({ rows: [user] });
      const mock = forgotPasswordMail as jest.MockedFunction<() => never>;
      mock.mockImplementation(() => {
        throw new MailError(msg);
      });

      const result = await resolver({}, { email }, mockContext, info);

      jest.runAllTimers();

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveReturnedTimes(3);
      expect(spy).toHaveLastReturnedWith({ rows: [user] });

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        303_000,
        email
      );

      expect(clearTimeout).toHaveBeenCalledTimes(1);
      expect(clearTimeout).toHaveBeenCalledWith(expect.any(Number));

      expect(forgotPasswordMail).toHaveBeenCalledTimes(1);
      expect(forgotPasswordMail).toThrow(msg);
      expect(forgotPasswordMail).toThrow(MailError);

      expect(result).toHaveProperty("message", msg);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });
});
