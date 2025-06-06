import { GraphQLError } from "graphql";
import { graphql, delay } from "msw";
import { setupServer } from "msw/node";

import { LOGIN_USER } from "@mutations/login/LOGIN_USER";
import { mswData, mswErrors } from "@utils/tests/msw";

interface Redirects {
  query: { redirectTo: string } | Record<string, never>;
  page: string;
}

export const PASSWORD = "testPassword";
export const loginName = { name: /^login$/i };
const emailStr = (label: string) => `${label}_test@mail.com`;
const msg1 = "You are unable to login at the moment. Please try again later";
const msg2 = "Invalid e-mail or password";
const msg3 = "Server responded with a graphql error";

const response = (isRegistered: boolean) => {
  return mswData("login", "LoggedInUser", {
    accessToken: "accessToken",
    sessionId: "USER_DATA_SESSION_ID",
    user: {
      __typename: "User",
      id: "user_id",
      email: "mail@example.com",
      firstName: "first name",
      lastName: "last Name",
      image: null,
      isRegistered,
    },
  });
};

export const server = setupServer(
  graphql.mutation(LOGIN_USER, async ({ variables: { email } }) => {
    await delay(50);

    if (email === emailStr("validation")) {
      return mswData("login", "LoginValidationError", {
        emailError: "Invalid e-mail address",
        passwordError: "Enter Password",
      });
    }

    if (
      email === emailStr("unrecognised") ||
      email === emailStr("email_password_error")
    ) {
      return mswData("login", "NotAllowedError", { message: msg2 });
    }

    if (email === emailStr("unsupported")) {
      return mswData("login", "UnsupportedType");
    }

    if (email === emailStr("registered")) return response(true);

    if (email === emailStr("unregistered")) return response(false);

    if (email === emailStr("network")) {
      return mswErrors(new Error(msg1), { status: 503 });
    }

    if (email === emailStr("graphql")) return mswErrors(new GraphQLError(msg3));

    return mswErrors(new Error(), { status: 400 });
  })
);

class Mock<T extends string | undefined = undefined> {
  email: string;

  constructor(email: string, readonly msg: T) {
    this.email = emailStr(email);
  }
}

export const validation = {
  email: emailStr("validation"),
  emailError: "Invalid e-mail address",
  passwordError: "Enter Password",
};

const unrecognized = new Mock("unrecognised", msg2);
const emailPasswordError = new Mock("email_password_error", msg2);
const unsupported = new Mock("unsupported", msg1);
const registered = new Mock("registered", undefined);
export const unRegistered = new Mock("unregistered", undefined);
const gql = new Mock("graphql", msg3);
const network = new Mock("network", msg1);

const text = "Should display an alert message toast if the";
export const errorTable: [string, Mock<string>][] = [
  [`${text} email was unrecognized by the server`, unrecognized],
  [`${text} email and password do not match`, emailPasswordError],
  [`${text} request failed with a network error`, network],
  [`${text} API throws a graphql error`, gql],
  [`${text} API response is an unsupported object type`, unsupported],
];

export const successTable: [string, Redirects, Mock][] = [
  [
    "Should redirect a registered user to the dashboard/home page",
    { page: "/", query: {} },
    registered,
  ],
  [
    "Should redirect the user using the value of the 'redirectTo' query params",
    { query: { redirectTo: "/posts" }, page: "/posts" },
    registered,
  ],
  [
    "Should redirect the user to the dashboard page if the 'redirectTo' query params is not a supported value",
    { query: { redirectTo: "/login" }, page: "/" },
    registered,
  ],
];
