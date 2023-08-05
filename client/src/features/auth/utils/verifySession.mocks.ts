import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { VERIFY_SESSION } from "../operations/VERIFY_SESSION";
import { REFRESH_TOKEN } from "../operations/REFRESH_TOKEN";

export const TEXT_NODE = "Testing User Authentication";
export const msg =
  "An unexpected error has occurred while trying to verify your current session";

const refresh = {
  gql(sessionId: string): MockedResponse[] {
    return [
      {
        request: {
          query: REFRESH_TOKEN,
          variables: { sessionId },
        },
        result: {
          data: {
            refreshToken: {
              __typename: "AccessToken",
              accessToken: "new_accessToken",
              status: "SUCCESS",
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

class MocksOne {
  sessionId: string;
  constructor(readonly typename: string, readonly message: string, id: string) {
    this.sessionId = `${id}_SESSION_ID`;
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: {
          data: {
            verifySession: {
              __typename: this.typename,
              message: this.message,
              status: "ERROR",
            },
          },
        },
      },
    ];
  }
}

class MocksTwo {
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
                dateCreated: new Date().toISOString(),
                email: "mail@example.com",
                firstName: "first name",
                id: this.userId,
                image: null,
                isRegistered: this.isRegistered,
                lastName: "last Name",
              },
              status: "SUCCESS",
            },
          },
        },
      },
      ...refresh.gql(this.sessionId),
    ];
  }
}

export const notAllowed = new MocksOne(
  "NotAllowedError",
  "Failed to Authenticate User",
  "NOT_ALLOWED"
);

const unknown = new MocksOne(
  "UnknownError",
  "Unknown session id. Authentication failed",
  "UNKNOWN"
);

const unsupported = new MocksOne("UnsupportedObjectType", msg, "UNSUPPORTED");

const userSession = new MocksOne(
  "UserSessionError",
  "Current logged in session could not be verified",
  "USER_SESSION"
);

const validation = {
  message: "Current logged in session could not be verified",
  sessionId: "VALIDATION_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: {
          data: {
            verifySession: {
              __typename: "SessionIdValidationError",
              sessionIdError: "Invalid session id. Authentication failed",
              status: "ERROR",
            },
          },
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

export const decode = new MocksTwo(true, "registered_user_id", "DECODE");
const registered = new MocksTwo(true, "registered_user_id", "REGISTERED");
const unregistered = new MocksTwo(
  false,
  "unregistered_user_id",
  "UNREGISTERED"
);

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
  ["Render an error alert if user session could not be verified", userSession],
  ["Render an error alert if verification fails with a GraphQL error", graphql],
  ["Render an error alert if verification fails with a Network error", network],
];

interface TableTwo {
  from: string;
  to: string;
  mock: MocksTwo;
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
  mock: MocksTwo;
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
