import { GraphQLError } from "graphql";
import { graphql } from "msw";
import { setupServer } from "msw/node";

import { LOGOUT } from "../components/Navbar/components/LogoutModal/LOGOUT";
import { mswData, mswErrors } from "@utils/tests/msw";

export const storageTheme = (theme: string) => {
  return JSON.stringify({
    themeMode: theme,
    fontSize: 14,
    color: "#7dd1f3",
  });
};

export const props = {
  clientHasRendered: true,
  errorMessage: null,
  title: "Page Title",
};

const sessionIdStr = (prefix: string) => `${prefix}_session_id`;

const msg1 = "You are unable to logout at the moment. Please try again later";
const msg2 = "You cannot perform that action right now";
const msg3 = "The current session could not be verified";
const msg4 = "Unable to logout right now. Please try again later";
const sessionIdError = "Invalid session id";

export const server = setupServer(
  graphql.mutation(LOGOUT, ({ variables: { sessionId } }) => {
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
      return mswErrors(new GraphQLError(msg4));
    }
  })
);

class Mock<T extends string | undefined = undefined> {
  sessionId: string;

  constructor(prefix: string, readonly message: T) {
    this.sessionId = sessionIdStr(prefix);
  }
}

const auth = new Mock("auth", undefined);
const response = new Mock("success", undefined);
const unsupported = new Mock("unsupported", msg1);
const validate = new Mock("validate", sessionIdError);
const network = new Mock("network", msg1);
const notAllowed = new Mock("not_allowed", msg2);
const unknown = new Mock("unknown", msg3);
const gql = new Mock("graphql", msg4);

const text = "Should display an alert toast if the";
export const errors: [string, Mock<string>][] = [
  [`${text} session id is invalid`, validate],
  [`${text} user session could not be found`, unknown],
  [`${text} request was made with invalid cookies`, notAllowed],
  [`${text} api throws a graphql error`, gql],
  [`${text} api request failed with a network error`, network],
  [`${text} api response is an unsupported object type`, unsupported],
];

export const logout: [string, Mock, string][] = [
  [
    "Should redirect the user to the login page if the user was not logged in",
    auth,
    "/login?status=unauthenticated",
  ],
  [
    "User is successfully logged out, Should redirect to the login page",
    response,
    "/login",
  ],
];
