import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { RESET_PASSWORD } from "@mutations/resetPassword/RESET_PASSWORD";
import { mswData, mswErrors } from "@testUtils/msw";

type Status = "WARN" | "SUCCESS";

export const data = {
  email: "reset_password_test@mail.org",
  resetToken: "VERIFIED_PASSWORD_RESET_TOKEN",
};

export const msg1 =
  "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol";

export const msg2 =
  "It appears you are trying to reset the password of an unregistered account.";

export const msg3 = "Password must be at least 8 characters long";
export const msg4 = "Passwords do not match";
export const msg5 = "Provide password reset token";

const errorMessage = "Unable to verify password reset token";

const passwordStr = (prefix: string) => `${prefix}_p@5Sw0Rd`;

export const server = setupServer(
  graphql.mutation(RESET_PASSWORD, async ({ variables: { password } }) => {
    await delay();

    if (password === passwordStr("notAllowed")) {
      return mswData("resetPassword", "NotAllowedError");
    }

    if (password === passwordStr("unregistered")) {
      return mswData("resetPassword", "RegistrationError");
    }

    if (password === passwordStr("unsupported")) {
      return mswData("resetPassword", "UnsupportedType");
    }

    if (password === passwordStr("validation1")) {
      return mswData("resetPassword", "ResetPasswordValidationError", {
        tokenError: null,
        passwordError: msg3,
        confirmPasswordError: msg4,
      });
    }

    if (password === passwordStr("validation2")) {
      return mswData("resetPassword", "ResetPasswordValidationError", {
        tokenError: msg5,
        passwordError: null,
        confirmPasswordError: null,
      });
    }

    if (password === passwordStr("success")) {
      return mswData("resetPassword", "Response", { status: "SUCCESS" });
    }

    if (password === passwordStr("warn")) {
      return mswData("resetPassword", "Response", { status: "WARN" });
    }

    if (password === passwordStr("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    if (password === passwordStr("graphql")) {
      return mswErrors(new GraphQLError(errorMessage));
    }

    return mswErrors(new Error(), { status: 400 });
  })
);

const mock = <T extends Status | undefined = undefined>(
  prefix: string,
  status: T
) => ({
  status,
  password: passwordStr(prefix),
});

export const unregistered = mock("unregistered", undefined);
export const validation1 = mock("validation1", undefined);
const success = mock("success", "SUCCESS");
const warn = mock("warn", "WARN");
const notAllowed = mock("notAllowed", undefined);
const unsupported = mock("unsupported", undefined);
const network = mock("network", undefined);
const gql = mock("graphql", undefined);
const validation2 = mock("validation2", undefined);

const text = "Should redirect to the forgot password page if the";
export const redirects: [string, string, ReturnType<typeof mock>][] = [
  [`${text} api request fails a network error`, "network", network],
  [`${text} api throws a graphql error`, "api", gql],
  [
    `${text} api responds with a token validation error`,
    "validation",
    validation2,
  ],
  [
    `${text} api responds with an unsupported object type`,
    "unsupported",
    unsupported,
  ],
  [
    `${text} password reset token is unknown or has expired`,
    "fail",
    notAllowed,
  ],
];

export const alerts: [string, string, ReturnType<typeof mock<Status>>][] = [
  [
    "Should render a success dialog box if the api response status is 'SUCCESS'",
    "MuiAlert-standardSuccess",
    success,
  ],
  [
    "Should render an information dialog box if the api response status is 'WARN'",
    "MuiAlert-standardInfo",
    warn,
  ],
];
