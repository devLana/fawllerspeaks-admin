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
import {
  email,
  message,
  msg1,
  msg2,
  validations,
} from "../utils/forgotPassword.testUtils";
import { MailError } from "@utils";
import { mockContext, info, spyDb } from "@tests";

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
    test.each(validations)("%s", async (_, data, errorMsg) => {
      const result = await resolver({}, { email: data }, mockContext, info);

      expect(forgotPasswordMail).not.toHaveBeenCalled();
      expect(result).toHaveProperty("emailError", errorMsg);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify e-mail address", () => {
    test("Should return an error response for an unknown e-mail address", async () => {
      const spy = spyDb({ rows: [] });

      const result = await resolver({}, { email }, mockContext, info);

      expect(forgotPasswordMail).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({ rows: [] });
      expect(result).toHaveProperty("message", msg1);
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Should return an error response if the provided email is for an unregistered account", async () => {
      const user = { isRegistered: false };
      const spy = spyDb({ rows: [user] });

      const result = await resolver({}, { email }, mockContext, info);

      expect(forgotPasswordMail).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({ rows: [user] });
      expect(result).toHaveProperty("message", msg2);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Generate password reset link", () => {
    test("Should send a confirmation mail with the generated password reset link", async () => {
      const user = { isRegistered: true };
      const spy = spyDb({ rows: [user] }).mockReturnValue({ rows: [] });

      const result = await resolver({}, { email }, mockContext, info);

      jest.runAllTimers();

      expect(forgotPasswordMail).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveReturnedTimes(3);
      expect(spy).toHaveLastReturnedWith({ rows: [] });
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("message", message);
      expect(result).toHaveProperty("status", "SUCCESS");
      expect(setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        303_000,
        email
      );
    });

    test("Should invalidate the generated password reset link if the confirmation mail fails to send", async () => {
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
      expect(clearTimeout).toHaveBeenCalledTimes(1);
      expect(clearTimeout).toHaveBeenCalledWith(expect.any(Number));
      expect(forgotPasswordMail).toHaveBeenCalledTimes(1);
      expect(forgotPasswordMail).toThrow(msg);
      expect(forgotPasswordMail).toThrow(MailError);
      expect(result).toHaveProperty("message", msg);
      expect(result).toHaveProperty("status", "ERROR");
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        303_000,
        email
      );
    });
  });
});
