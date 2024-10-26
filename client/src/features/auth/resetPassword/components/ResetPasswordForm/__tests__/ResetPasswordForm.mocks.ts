import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { RESET_PASSWORD } from "@mutations/resetPassword/RESET_PASSWORD";
import { mswData, mswErrors } from "@utils/tests/msw";

export const resetButton = { name: /^reset password$/i };

export const msg1 =
  "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol";

export const msg2 = "Password must be at least 8 characters long";
export const msg3 = "Passwords do not match";

const errorMessage = "Unable to verify password reset token";

const passwordStr = (prefix: string) => `${prefix}_p@5Sw0Rd`;

export const server = setupServer(
  graphql.mutation(RESET_PASSWORD, async ({ variables: { password } }) => {
    await delay(50);

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
        passwordError: msg2,
        confirmPasswordError: msg3,
      });
    }

    if (password === passwordStr("validation2")) {
      return mswData("resetPassword", "ResetPasswordValidationError", {
        tokenError: "Provide password reset token",
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

const mock = (prefix: string) => ({ password: passwordStr(prefix) });

export const validation1 = mock("validation1");
const unregistered = mock("unregistered");
const success = mock("success");
const warn = mock("warn");
const notAllowed = mock("notAllowed");
const unsupported = mock("unsupported");
const network = mock("network");
const gql = mock("graphql");
const validation2 = mock("validation2");

const text = "Should redirect to the forgot password page if the";
export const redirects: [string, string, ReturnType<typeof mock>][] = [
  [`${text} API request fails with a network error`, "network", network],
  [`${text} API throws a graphql error`, "api", gql],
  [
    `${text} API responds with a token input validation error`,
    "validation",
    validation2,
  ],
  [
    `${text} API responds with an unsupported object type`,
    "unsupported",
    unsupported,
  ],
  [
    `${text} password reset token is unknown or has expired`,
    "fail",
    notAllowed,
  ],
];

const str = "Expect the page view to be changed to the";
export const views: [string, [string, { password: string }, string][]][] = [
  [
    "The user's account is unregistered",
    [[`${str} unregistered error view`, unregistered, "unregistered error"]],
  ],
  [
    "User password is successfully reset",
    [
      [`${str} password reset success view`, success, "success"],
      [`${str} password reset warning view`, warn, "warn"],
    ],
  ],
];
