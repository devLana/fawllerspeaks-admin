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
import changePasswordMail from "../changePasswordMail";
import { MailError } from "@utils";
import { mockContext, info, spyDb } from "@tests";

const args = {
  currentPassword: "PassWord1@",
  newPassword: "PassW3!ord1@",
  confirmNewPassword: "PassW3!ord1@",
};
let hash = "";

jest.mock("../changePasswordMail");

beforeAll(async () => {
  hash = await bcrypt.hash(args.currentPassword, 10);
});

beforeEach(() => {
  mockContext.user = "signed_in_user_id";
});

describe("Test change password resolver", () => {
  test("Returns error on logged out user", async () => {
    mockContext.user = null;

    const result = await changePassword({}, args, mockContext, info);

    expect(changePasswordMail).not.toHaveBeenCalled();

    expect(result).toHaveProperty("message", "Unable to change password");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each([
    [
      "empty",
      {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      {
        currentPasswordError: "Enter current password",
        newPasswordError: "Enter new password",
        confirmNewPasswordError: undefined,
      },
    ],
    [
      "empty whitespace and password mismatch",
      {
        currentPassword: "    ",
        newPassword: "                ",
        confirmNewPassword: "      ",
      },
      {
        currentPasswordError: undefined,
        newPasswordError:
          "New password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol",
        confirmNewPasswordError: "Passwords do not match",
      },
    ],
    [
      "invalid password and password mismatch",
      {
        currentPassword: "current",
        newPassword: "gTg@g5",
        confirmNewPassword: "not_pass",
      },
      {
        currentPasswordError: undefined,
        newPasswordError: "Password must be at least 8 characters long",
        confirmNewPasswordError: "Passwords do not match",
      },
    ],
  ])("Returns error on %s input values", async (_, data, errors) => {
    const result = await changePassword({}, data, mockContext, info);

    expect(changePasswordMail).not.toHaveBeenCalled();

    expect(result).toHaveProperty(
      "currentPasswordError",
      errors.currentPasswordError
    );

    expect(result).toHaveProperty("newPasswordError", errors.newPasswordError);

    expect(result).toHaveProperty(
      "confirmNewPasswordError",
      errors.confirmNewPasswordError
    );

    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each([
    ["unknown", []],
    ["unregistered", [{ isRegistered: false, password: "saved_db_password" }]],
  ])("Returns error on %s user", async (_, data) => {
    const spy = spyDb({ rows: data });

    const result = await changePassword({}, args, mockContext, info);

    expect(changePasswordMail).not.toHaveBeenCalled();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith({ rows: data });

    expect(changePasswordMail).not.toHaveBeenCalled();

    expect(result).toHaveProperty("message", "Unable to change password");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Should return error if passwords don't match", async () => {
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

  test("Should change password and send confirmation mail", async () => {
    const spy = spyDb({
      rows: [{ isRegistered: true, password: hash }],
    });
    spy.mockReturnValueOnce({ rows: [] });

    const result = await changePassword({}, args, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, {
      rows: [{ isRegistered: true, password: hash }],
    });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });

    expect(changePasswordMail).toHaveBeenCalledTimes(1);

    expect(result).toHaveProperty("message", "Password changed");
    expect(result).toHaveProperty("status", "SUCCESS");
  });

  test("Should revert change if confirmation mail throws", async () => {
    const spy = spyDb({
      rows: [{ isRegistered: true, password: hash }],
    });
    spy.mockReturnValue({ rows: [] });

    const mock = changePasswordMail as jest.Mock<() => never>;
    mock.mockImplementation(() => {
      throw new MailError("Unable to send mail");
    });

    const result = await changePassword({}, args, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, {
      rows: [{ isRegistered: true, password: hash }],
    });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(changePasswordMail).toHaveBeenCalledTimes(1);
    expect(changePasswordMail).toThrow("Unable to send mail");
    expect(changePasswordMail).toThrow(MailError);

    expect(result).toHaveProperty("message", "Unable to send mail");
    expect(result).toHaveProperty("status", "ERROR");
  });
});
