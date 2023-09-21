import type { InputErrors } from "@types";

interface GQL {
  [key: string]: unknown;
  currentPassword: number | null;
  newPassword: boolean | undefined;
  confirmNewPassword: [] | null;
}

interface Input {
  [key: string]: unknown;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

type Validations = [string, Input, InputErrors<Input>][];

interface VerifyUser {
  [key: string]: unknown;
  isRegistered: boolean;
  password: string;
}

export const PASSWORD = "PassW3!ord1@";

export const authCheck = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export const gqlValidation: [string, GQL][] = [
  [
    "Should throw graphql validation error for null and undefined input values",
    { currentPassword: null, newPassword: undefined, confirmNewPassword: null },
  ],
  [
    "Should throw graphql validation error for number and boolean input values",
    { currentPassword: 576, newPassword: false, confirmNewPassword: [] },
  ],
];

export const validations = (nullOrUndefined: null | undefined): Validations => [
  [
    "Returns error for empty input values",
    {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    {
      currentPasswordError: "Enter current password",
      newPasswordError: "Enter new password",
      confirmNewPasswordError: nullOrUndefined,
    },
  ],
  [
    "Returns error for empty whitespace and password mismatch input values ",
    {
      currentPassword: "  ",
      newPassword: "             ",
      confirmNewPassword: "    ",
    },
    {
      currentPasswordError: nullOrUndefined,
      newPasswordError:
        "New password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol",
      confirmNewPasswordError: "Passwords do not match",
    },
  ],
  [
    "Returns error for invalid password and password mismatch input values",
    {
      currentPassword: "null",
      newPassword: "gh5tY#",
      confirmNewPassword: "j667 ",
    },
    {
      currentPasswordError: nullOrUndefined,
      newPasswordError: "New Password must be at least 8 characters long",
      confirmNewPasswordError: "Passwords do not match",
    },
  ],
];

export const errorInput = {
  currentPassword: "null",
  newPassword: PASSWORD,
  confirmNewPassword: PASSWORD,
};

export const args = {
  currentPassword: "PassWord1@",
  newPassword: "PassW3!ord1@",
  confirmNewPassword: "PassW3!ord1@",
};

export const verifyUser: [string, VerifyUser[]][] = [
  ["Returns error on unknown user", []],
  [
    "Returns error on unregistered user",
    [{ isRegistered: false, password: "saved_db_password" }],
  ],
];
