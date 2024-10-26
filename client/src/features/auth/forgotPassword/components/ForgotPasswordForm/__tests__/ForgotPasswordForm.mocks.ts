import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { FORGOT_PASSWORD } from "@mutations/forgotPassword/FORGOT_PASSWORD";
import { mswData, mswErrors } from "@utils/tests/msw";
import type { AuthPageView } from "@types";

const emailStr = (label: string) => `${label}_email@example.org`;
const emailError = "Invalid e-mail address server response";
const msg1 = "Unable to send password reset link at this time";
const msg2 = "Unknown email address provided";
const msg3 = "Server responded with a graphql error";

const msg4 =
  "You are unable to reset your password at the moment. Please try again later";

export const server = setupServer(
  graphql.mutation(FORGOT_PASSWORD, async ({ variables: { email } }) => {
    await delay(50);

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
      return mswData("forgotPassword", "UnsupportedType", { message: msg4 });
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

    return mswErrors(new Error(), { status: 400 });
  })
);

class Mocks<T extends string | undefined = undefined> {
  email: string;

  constructor(label: string, readonly message: T) {
    this.email = emailStr(label);
  }
}

export const validation = new Mocks("validation", emailError);
const registration = new Mocks("registration", undefined);
const success = new Mocks("success", undefined);
const notAllowed = new Mocks("not_allowed", msg2);
const gql = new Mocks("graphql", msg3);
const network = new Mocks("network", msg4);
const serverError = new Mocks("server_error", msg1);
const unsupported = new Mocks("unsupported", msg4);

const text = "Should show an alert message toast if the";
export const testTable: [string, Mocks<string>][] = [
  [
    `${text} email address does not match a valid account on the server`,
    notAllowed,
  ],
  [`${text} API responds with a server error`, serverError],
  [`${text} request fails with a network error`, network],
  [`${text} API throws a graphql error`, gql],
  [`${text} API response is an unsupported object type`, unsupported],
];

export const viewTable: [
  string,
  { title: string; email: string; view: Exclude<AuthPageView, "form"> }
][] = [
  [
    "The provided email address belongs to an unregistered account",
    {
      title: "Expect the view to change to the unregistered error view",
      email: registration.email,
      view: "unregistered error",
    },
  ],
  [
    "On forgot password request success",
    {
      title: "Expect the view to change to the success view",
      email: success.email,
      view: "success",
    },
  ],
];
