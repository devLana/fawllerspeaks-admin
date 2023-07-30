import bcrypt from "bcrypt";
import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  beforeAll,
} from "@jest/globals";

import changePassword from "..";

import changePasswordMail from "../utils/changePasswordMail";
import {
  args,
  validations,
  verifyUser,
} from "../utils/changePasswordTestUtils";
import { MailError } from "@utils";
import { mockContext, info, spyDb } from "@tests";

let hash = "";

jest.mock("../utils/changePasswordMail", () => {
  return jest.fn().mockName("changePasswordMail");
});

beforeAll(async () => {
  hash = await bcrypt.hash(args.currentPassword, 10);
});

beforeEach(() => {
  mockContext.user = "signed_in_user_id";
});

describe("Test change password resolver", () => {
  describe("Verify user authentication", () => {
    test("User is not logged in, Return an AuthenticationError response", async () => {
      mockContext.user = null;

      const result = await changePassword({}, args, mockContext, info);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Unable to change password");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    test.each(validations(undefined))("%s", async (_, data, errors) => {
      const result = await changePassword({}, data, mockContext, info);

      expect(changePasswordMail).not.toHaveBeenCalled();

      expect(result).toHaveProperty(
        "currentPasswordError",
        errors.currentPasswordError
      );

      expect(result).toHaveProperty(
        "newPasswordError",
        errors.newPasswordError
      );

      expect(result).toHaveProperty(
        "confirmNewPasswordError",
        errors.confirmNewPasswordError
      );

      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    test.each(verifyUser)("%s", async (_, data) => {
      const spy = spyDb({ rows: data });

      const result = await changePassword({}, args, mockContext, info);

      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({ rows: data });
      expect(changePasswordMail).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Unable to change password");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user's current password", () => {
    test("Should return an error response if passwords do not match", async () => {
      const hashed = await bcrypt.hash("in_CorrecT_PassW0rd", 10);
      const spy = spyDb({
        rows: [{ isRegistered: true, password: hashed }],
      });

      const result = await changePassword({}, args, mockContext, info);

      expect(changePasswordMail).not.toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({
        rows: [{ isRegistered: true, password: hashed }],
      });

      expect(result).toHaveProperty(
        "message",
        "Unable to change password. 'current password' does not match"
      );
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Change user password", () => {
    test("Change password and send confirmation mail", async () => {
      const mock = { rows: [{ isRegistered: true, password: hash }] };
      const spy = spyDb(mock);
      spy.mockReturnValueOnce({ rows: [] });

      const result = await changePassword({}, args, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, mock);
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(changePasswordMail).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("message", "Password changed");
      expect(result).toHaveProperty("status", "SUCCESS");
    });

    test("Sending confirmation mail fails, Revert update and return an error", async () => {
      const mock = changePasswordMail as jest.Mock<() => never>;
      const mockData = { rows: [{ isRegistered: true, password: hash }] };
      const spy = spyDb(mockData);
      spy.mockReturnValue({ rows: [] });

      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const result = await changePassword({}, args, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, mockData);
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(spy).toHaveNthReturnedWith(3, { rows: [] });
      expect(changePasswordMail).toHaveBeenCalledTimes(1);
      expect(changePasswordMail).toThrow("Unable to send mail");
      expect(changePasswordMail).toThrow(MailError);
      expect(result).toHaveProperty("message", "Unable to send mail");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });
});
