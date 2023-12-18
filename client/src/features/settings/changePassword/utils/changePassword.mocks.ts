import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { CHANGE_PASSWORD } from "../operations/CHANGE_PASSWORD";
import { mswData, mswErrors } from "@utils/tests/msw";

const passwordStr = (prefix: string) => `${prefix}_N3w_p@55w0rD`;

export const currentPassword = "us3r_currenT_P@ssw0rd";
export const currentErrorMsg = "Provide current password";
export const newErrorMsg = "Password must be at least 8 characters long";
export const confirmErrorMsg = "Passwords do not match";
const responseMsg = "Password changed";
const serverMsg = "Unable to change password";
const gqlErrorMsg = "Something went wrong. Please try again later";

const notAllowedErrorMsg =
  "Unable to change password. 'current password' does not match your account";

const message =
  "You are unable to change your password at the moment. Please try again later";

export const server = setupServer(
  graphql.mutation(CHANGE_PASSWORD, async ({ variables: { newPassword } }) => {
    await delay();

    if (newPassword === passwordStr("validate")) {
      return mswData("changePassword", "ChangePasswordValidationError", {
        currentPasswordError: currentErrorMsg,
        newPasswordError: newErrorMsg,
        confirmNewPasswordError: confirmErrorMsg,
      });
    }

    if (newPassword === passwordStr("auth")) {
      return mswData("changePassword", "AuthenticationError");
    }

    if (newPassword === passwordStr("not_allowed")) {
      return mswData("changePassword", "NotAllowedError");
    }

    if (newPassword === passwordStr("register")) {
      return mswData("changePassword", "RegistrationError");
    }

    if (newPassword === passwordStr("response")) {
      return mswData("changePassword", "Response", { message: responseMsg });
    }

    if (newPassword === passwordStr("server")) {
      return mswData("changePassword", "ServerError", { message: serverMsg });
    }

    if (newPassword === passwordStr("unknown")) {
      return mswData("changePassword", "UnknownError");
    }

    if (newPassword === passwordStr("unsupported")) {
      return mswData("changePassword", "UnsupportedType");
    }

    if (newPassword === passwordStr("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    if (newPassword === passwordStr("graphql")) {
      return mswErrors(new GraphQLError(gqlErrorMsg));
    }
  })
);

const mock = <T extends string | undefined = undefined>(
  prefix: string,
  msg: T
) => ({
  msg,
  password: passwordStr(prefix),
});

export const validation = mock("validate", undefined);
const response = mock("response", responseMsg);
const auth = mock("auth", undefined);
const unknown = mock("unknown", undefined);
const register = mock("register", undefined);
const allow = mock("not_allowed", notAllowedErrorMsg);
const serverError = mock("server", serverMsg);
const gql = mock("graphql", gqlErrorMsg);
const network = mock("network", message);
const unsupported = mock("unsupported", message);

export const redirects: [string, [string, string], ReturnType<typeof mock>][] =
  [
    [
      "Should redirect the user to the login page if the user is not logged in",
      ["/login", "unauthenticated"],
      auth,
    ],
    [
      "Should redirect the user to the register page if the user is unregistered",
      ["/register", "unregistered"],
      register,
    ],
    [
      "Should redirect the user to the login page if the user could not be verified",
      ["/login", "unauthorized"],
      unknown,
    ],
  ];

const text = "Should display an alert toast if the";
export const alerts: [string, [string, ReturnType<typeof mock<string>>][]][] = [
  [
    "Api response is an error or an unsupported object type",
    [
      [`${text} current password does not match the account password`, allow],
      [`${text} user's password could not be changed`, serverError],
      [`${text} api throws a graphql error`, gql],
      [`${text} request failed with a network error`, network],
      [`${text} api responded with an unsupported object type`, unsupported],
    ],
  ],
  [
    "Password successfully changed",
    [[`${text} change password request was successful`, response]],
  ],
];
