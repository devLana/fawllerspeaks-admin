import { GraphQLError } from "graphql";
import { graphql, delay } from "msw";
import { setupServer } from "msw/node";

import { LOGOUT } from "@mutations/logout/LOGOUT";
import { mswData, mswErrors } from "@utils/tests/msw";

const sessionIdStr = (prefix: string) => `${prefix}_session_id`;
const msg = "Unable to logout right now. Please try again later";
const sessionIdError = "Invalid session id";

export const server = setupServer(
  graphql.mutation(LOGOUT, async ({ variables: { sessionId } }) => {
    await delay(50);

    if (sessionId === sessionIdStr("validate")) {
      return mswData("logout", "SessionIdValidationError", { sessionIdError });
    }

    if (sessionId === sessionIdStr("auth")) {
      return mswData("logout", "AuthenticationError");
    }

    if (sessionId === sessionIdStr("not_allowed")) {
      return mswData("logout", "NotAllowedError");
    }

    if (sessionId === sessionIdStr("unknown")) {
      return mswData("logout", "UnknownError");
    }

    if (sessionId === sessionIdStr("unsupported")) {
      return mswData("logout", "UnsupportedType");
    }

    if (sessionId === sessionIdStr("success")) {
      return mswData("logout", "Response");
    }

    if (sessionId === sessionIdStr("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    if (sessionId === sessionIdStr("graphql")) {
      return mswErrors(new GraphQLError(msg));
    }

    return mswErrors(new Error(), { status: 400 });
  })
);

class Mock {
  sessionId: string;

  constructor(prefix: string) {
    this.sessionId = sessionIdStr(prefix);
  }
}

const auth = new Mock("auth");
const response = new Mock("success");
const unsupported = new Mock("unsupported");
const validate = new Mock("validate");
const network = new Mock("network");
const notAllowed = new Mock("not_allowed");
const unknown = new Mock("unknown");
const gql = new Mock("graphql");

const text = "Should close the logout dialog and display an alert message";
export const errors: [string, Mock][] = [
  [`${text} if the API's input validation failed`, validate],
  [`${text} if the user session could not be found`, unknown],
  [`${text} if the request was made with invalid cookies`, notAllowed],
  [`${text} if the API throws a graphql error`, gql],
  [`${text} if the API request failed with a network error`, network],
  [`${text} if the API response is an unsupported object type`, unsupported],
];

interface Params {
  pathname: "/login";
  query: Record<string, string>;
}

export const logout: [string, Mock, Params | string][] = [
  [
    "Should redirect the user to the login page if they were never logged in initially",
    auth,
    { pathname: "/login", query: { status: "unauthenticated" } },
  ],
  [
    "Should redirect the user to the login page if they were successfully logged out",
    response,
    "/login",
  ],
];
