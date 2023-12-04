import { GraphQLError } from "graphql";
import { graphql } from "msw";
import { setupServer } from "msw/node";

import { FORGOT_PASSWORD } from "../operations/FORGOT_PASSWORD";
import { mswData, mswErrors } from "@utils/tests/msw";

const emailStr = (label: string) => `${label}_email@example.org`;
const emailError = "Invalid e-mail address server response";
const msg1 = "Unable to send password reset link at this time";
const msg2 = "Unknown email address provided";
const msg3 = "Server responded with a graphql error";

const msg4 =
  "A password reset link has been sent to the e-mail address you provided.";

const msg5 =
  "You are unable to reset your password at the moment. Please try again later";

const msg6 =
  "It appears the account belonging to the e-mail address you provided has not been registered yet.";

export const server = setupServer(
  graphql.mutation(FORGOT_PASSWORD, ({ variables: { email } }) => {
    if (email === emailStr("not_allowed")) {
      return mswData("forgotPassword", "NotAllowedError", { message: msg2 });
    }

    if (email === emailStr("server_error")) {
      return mswData("forgotPassword", "ServerError", { message: msg1 });
    }

    if (email === emailStr("registration")) {
      return mswData("forgotPassword", "RegistrationError");
    }

    if (email === emailStr("unsupported")) {
      return mswData("forgotPassword", "UnsupportedType", { message: msg5 });
    }

    if (email === emailStr("validation")) {
      return mswData("forgotPassword", "EmailValidationError", { emailError });
    }

    if (email === emailStr("success")) {
      return mswData("forgotPassword", "Response");
    }

    if (email === emailStr("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    if (email === emailStr("graphql")) {
      return mswErrors(new GraphQLError(msg3));
    }
  })
);

class Mocks<T extends string | undefined = undefined> {
  email: string;

  constructor(label: string, readonly message: T) {
    this.email = emailStr(label);
  }
}

export const success = new Mocks("success", msg4);
export const registration = new Mocks("registration", msg6);
export const validation = new Mocks("validation", emailError);
const notAllowed = new Mocks("not_allowed", msg2);
const gql = new Mocks("graphql", msg3);
const network = new Mocks("network", msg5);
const serverError = new Mocks("server_error", msg1);
const unsupported = new Mocks("unsupported", msg5);

const text = "Should show an alert message toast if the";
export const testTable: [string, Mocks<string>][] = [
  [`${text} email does not match a valid account on the server`, notAllowed],
  [`${text} api responds with a server error`, serverError],
  [`${text} request fails with a network error`, network],
  [`${text} api throws a graphql error`, gql],
  [`${text} api api response is an unsupported object type`, unsupported],
];

export const statusTable: [string, string, string][] = [
  [
    "Should display an alert message toast if an empty password reset token string was provided",
    "empty",
    "A password reset token is needed to reset an account password",
  ],
  [
    "Should display an alert message toast if a malformed password reset token string was provided",
    "invalid",
    "Invalid password reset token",
  ],
  [
    "Should display an alert message toast if a password reset token validation error occurred",
    "validation",
    "Invalid password reset token",
  ],
  [
    "Should display an alert message toast if the password reset token was unknown or had expired",
    "fail",
    "Unable to verify password reset token",
  ],
  [
    "Should display an alert message toast if the password reset token verification response was an unsupported object type",
    "unsupported",
    "Unable to verify password reset token",
  ],
  [
    "Should display an alert message toast if a graphql error was thrown while verifying the password reset token ",
    "api",
    "Unable to verify password reset token",
  ],
  [
    "Should display an alert message toast if a network error failed the password reset token verification",
    "network",
    "Unable to verify password reset token. Please try again later",
  ],
];
