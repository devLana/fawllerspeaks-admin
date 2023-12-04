import { GraphQLError } from "graphql";
import { graphql } from "msw";
import { setupServer } from "msw/node";

import { VERIFY_SESSION } from "../operations/VERIFY_SESSION";
import { REFRESH_TOKEN } from "../operations/REFRESH_TOKEN";
import { mswData, mswErrors } from "@utils/tests/msw";

export const TEXT_NODE = "Testing User Authentication";

export const msg1 =
  "An unexpected error has occurred while trying to verify your current session";

const msg2 = "Current logged in session could not be verified";

export const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const response = (accessToken = jwt, isRegistered = true) => {
  return mswData("verifySession", "VerifiedSession", {
    accessToken,
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
  graphql.mutation(REFRESH_TOKEN, () => {
    return mswData("refreshToken", "UnsupportedType");
  }),

  graphql.mutation(VERIFY_SESSION, ({ variables: { sessionId } }) => {
    if (sessionId === "NOT_ALLOWED_SESSION_ID") {
      return mswData("verifySession", "NotAllowedError");
    }

    if (sessionId === "AUTH_COOKIE_SESSION_ID") {
      return mswData("verifySession", "AuthCookieError");
    }

    if (sessionId === "FORBIDDEN_SESSION_ID") {
      return mswData("verifySession", "ForbiddenError");
    }

    if (sessionId === "UNSUPPORTED_SESSION_ID") {
      return mswData("verifySession", "UnsupportedType");
    }

    if (sessionId === "UNKNOWN_SESSION_ID") {
      const message = "Unknown session id. Authentication failed";
      return mswData("verifySession", "UnknownError", { message });
    }

    if (sessionId === "VALIDATION_SESSION_ID") {
      return mswData("verifySession", "SessionIdValidationError");
    }

    if (sessionId === "GRAPHQL_ERROR_SESSION_ID") {
      const msg = "Mock graphql error response. Authentication failed";
      return mswErrors(new GraphQLError(msg));
    }

    if (sessionId === "NETWORK_ERROR_SESSION_ID") {
      return mswErrors(new Error(), { status: 503 });
    }

    if (sessionId === "DECODE_SESSION_ID") return response("accessToken");

    if (sessionId === "REGISTERED_SESSION_ID") return response();

    if (sessionId === "UNREGISTERED_SESSION_ID") {
      return response(undefined, false);
    }
  })
);

class Mock<T extends string | undefined = undefined> {
  sessionId: string;

  constructor(label: string, readonly message: T) {
    this.sessionId = `${label}_SESSION_ID`;
  }
}

export const decode = new Mock("DECODE", undefined);
const registered = new Mock("REGISTERED", undefined);
const unregistered = new Mock("UNREGISTERED", undefined);
const notAllowed = new Mock("NOT_ALLOWED", undefined);
const authCookie = new Mock("AUTH_COOKIE", undefined);
const unsupported = new Mock("UNSUPPORTED", msg1);
const forbid = new Mock("FORBIDDEN", msg2);
const validate = new Mock("VALIDATION", msg2);

const unknown = new Mock(
  "UNKNOWN",
  "Unknown session id. Authentication failed"
);

const network = new Mock(
  "NETWORK_ERROR",
  "Server is currently unreachable. Please try again later"
);

const gql = new Mock(
  "GRAPHQL_ERROR",
  "Mock graphql error response. Authentication failed"
);

const text = "Should render an alert message box if the";
export const tableOne: [string, Mock<string>][] = [
  [`${text} session id is invalid`, validate],
  [`${text} session id is unknown`, unknown],
  [`${text} api response is an unsupported object type`, unsupported],
  [`${text} the cookie refresh token could not be verified/validated`, forbid],
  [`${text} session verification throws a GraphQL error`, gql],
  [`${text} session verification fails with a Network error`, network],
];

export const tableTwo: [string, Mock][] = [
  [
    "The current route is a protected route and the api response is a NotAllowedError response, Should redirect the user to the login page",
    notAllowed,
  ],
  [
    "The current route is a protected route but the user's session has expired, Should redirect the user to the login page",
    authCookie,
  ],
];

export const tableThree: [string, string, Mock][] = [
  [
    "The current route is not a protected route and the api response is a NotAllowedError response, Should render the (authentication)page at the current route",
    "/forgot-password",
    notAllowed,
  ],
  [
    "The current route is not a protected route and the user's session has expired, Should render the current(authentication) page",
    "/login",
    authCookie,
  ],
];

interface TableTwo {
  from: string;
  to: string;
  mock: Mock;
}

export const tableFour: [string, TableTwo][] = [
  [
    "The user is registered and the current route is not a protected route, Should redirect the user to the home(dashboard) page",
    { from: "/login", to: "/", mock: registered },
  ],
  [
    "The user is unregistered and the current route is not the register route, Should redirect the user to the register page",
    { from: "/", to: "/register", mock: unregistered },
  ],
];

export const tableFive: [string, string, Mock][] = [
  [
    "The user is registered and the current route is a protected route, Should render the page at the current route",
    "/",
    registered,
  ],
  [
    "The user is unregistered and the current route is the register route, Should render the register page",
    "/register",
    unregistered,
  ],
];
