import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { VERIFY_SESSION } from "../operations/VERIFY_SESSION";
import { REFRESH_TOKEN } from "../operations/REFRESH_TOKEN";

export const TEXT_NODE = "Testing User Authentication";
export const msg1 =
  "An unexpected error has occurred while trying to verify your current session";
const msg2 = "Current logged in session could not be verified";

const refresh = {
  gql(sessionId: string): MockedResponse[] {
    return [
      {
        request: { query: REFRESH_TOKEN, variables: { sessionId } },
        result: {
          data: {
            refreshToken: {
              __typename: "AccessToken",
              accessToken: "new_accessToken",
            },
          },
        },
      },
    ];
  },
};

const request = (sessionId: string): MockedResponse["request"] => {
  return { query: VERIFY_SESSION, variables: { sessionId } };
};

class MockOne {
  sessionId: string;

  constructor(readonly typename: string, readonly message: string, id: string) {
    this.sessionId = `${id}_SESSION_ID`;
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: { data: { verifySession: { __typename: this.typename } } },
      },
    ];
  }
}

class MockTwo {
  sessionId: string;

  constructor(
    readonly isRegistered: boolean,
    readonly userId: string,
    id: string
  ) {
    this.sessionId = `${id}_SESSION_ID`;
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: {
          data: {
            verifySession: {
              __typename: "VerifiedSession",
              accessToken: "accessToken",
              user: {
                __typename: "User",
                id: this.userId,
                email: "mail@example.com",
                firstName: "first name",
                lastName: "last Name",
                image: null,
                isRegistered: this.isRegistered,
              },
            },
          },
        },
      },
      ...refresh.gql(this.sessionId),
    ];
  }
}

export const notAllowed = {
  sessionId: "NOT_ALLOWED_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: { data: { verifySession: { __typename: "NotAllowedError" } } },
      },
    ];
  },
};

const unsupported = new MockOne("UnsupportedObjectType", msg1, "UNSUPPORTED");
const forbid = new MockOne("ForbiddenError", msg2, "FORBIDDEN");
const userSession = new MockOne("UserSessionError", msg2, "USER_SESSION");

const unknown = {
  sessionId: "UNKNOWN_SESSION_ID",
  message: "Unknown session id. Authentication failed",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: {
          data: {
            verifySession: {
              __typename: "UnknownError",
              message: this.message,
            },
          },
        },
      },
    ];
  },
};

const validation = {
  message: msg2,
  sessionId: "VALIDATION_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: {
          data: { verifySession: { __typename: "SessionIdValidationError" } },
        },
      },
    ];
  },
};

const graphql = {
  message: "Mock graphql error response. Authentication failed",
  sessionId: "GRAPHQL_ERROR_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: { errors: [new GraphQLError(this.message)] },
      },
    ];
  },
};

const network = {
  message: "Server is currently unreachable. Please try again later",
  sessionId: "NETWORK_ERROR_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      { request: request(this.sessionId), error: new Error(this.message) },
    ];
  },
};

export const decode = new MockTwo(true, "registered_user_id", "DECODE");
const registered = new MockTwo(true, "registered_user_id", "REGISTERED");
const unregistered = new MockTwo(false, "unregistered_user_id", "UNREGISTERED");

interface TableOne {
  message: string;
  gql: () => MockedResponse[];
  sessionId: string;
}

export const tableOne: [string, TableOne][] = [
  ["Render an error alert if session id is invalid", validation],
  ["Render an error alert if session id is unknown", unknown],
  [
    "Render an error alert if verification response is an unsupported object type",
    unsupported,
  ],
  [
    "Render an error alert if the refresh token could not be verified/validated",
    forbid,
  ],
  ["Render an error alert if user session could not be verified", userSession],
  ["Render an error alert if verification fails with a GraphQL error", graphql],
  ["Render an error alert if verification fails with a Network error", network],
];

interface TableTwo {
  from: string;
  to: string;
  mock: MockTwo;
}

export const tableTwo: [string, TableTwo][] = [
  [
    "Redirect to the home(dashboard) page if user is registered",
    { from: "/login", to: "/", mock: registered },
  ],
  [
    "Redirect to the register page if user is unregistered",
    { from: "/", to: "/register", mock: unregistered },
  ],
];

interface TableThree {
  pathname: string;
  mock: MockTwo;
}

export const tableThree: [string, TableThree][] = [
  [
    "Render the page at the current route if user is registered",
    { pathname: "/", mock: registered },
  ],
  [
    "Render the register page if user is unregistered",
    { pathname: "/register", mock: unregistered },
  ],
];
