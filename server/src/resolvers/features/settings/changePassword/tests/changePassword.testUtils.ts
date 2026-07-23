import { registeredUser } from "@utils/tests/mocks";
import type { InputErrors } from "@appTypes/tests";

interface Input {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const PASSWORD = "PassW3!ord1@";

export const validations: Array<[string, Input, InputErrors<Input>]> = [
  [
    "Should return a validation error response if the input strings are empty",
    { currentPassword: "", newPassword: "", confirmNewPassword: "" },
    {
      currentPasswordError: "Enter current password",
      newPasswordError: "Enter new password",
      confirmNewPasswordError: null,
    },
  ],
  [
    "Should return a validation error response if the inputs are empty whitespace strings",
    {
      currentPassword: "  ",
      newPassword: "             ",
      confirmNewPassword: "    ",
    },
    {
      currentPasswordError: null,
      newPasswordError:
        "New password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol",
      confirmNewPasswordError: "Passwords do not match",
    },
  ],
  [
    "Should return a validation error response if the password is invalid and if the password does not match the confirm password",
    {
      currentPassword: "null",
      newPassword: "gh5tY#",
      confirmNewPassword: "j667 ",
    },
    {
      currentPasswordError: null,
      newPasswordError: "New Password must be at least 8 characters long",
      confirmNewPasswordError: "Passwords do not match",
    },
  ],
];

export const authCheck = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export const errorInput = {
  currentPassword: "null",
  newPassword: PASSWORD,
  confirmNewPassword: PASSWORD,
};

export const validInput1 = {
  currentPassword: registeredUser.password,
  newPassword: PASSWORD,
  confirmNewPassword: PASSWORD,
};

export const validInput2 = {
  currentPassword: PASSWORD,
  newPassword: "newPassW3!ord1@",
  confirmNewPassword: "newPassW3!ord1@",
};

export const msg = `Your password has been successfully changed but we were unable to send a mail notification confirming this action`;
