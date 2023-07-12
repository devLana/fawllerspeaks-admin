import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { VERIFY_SESSION } from "../operations/VERIFY_SESSION";
import { REFRESH_TOKEN } from "../operations/REFRESH_TOKEN";

export const TEXT_NODE = "Testing User Authentication";
export const LOGGED_IN_SESSION_ID = "LOGGED_IN_SESSION_ID";
export const msg =
  "An unexpected error has occurred while trying to verify your current session";

const refresh = {
  gql(): MockedResponse[] {
    return [
      {
        request: {
          query: REFRESH_TOKEN,
          variables: { sessionId: LOGGED_IN_SESSION_ID },
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

const request: MockedResponse["request"] = {
  query: VERIFY_SESSION,
  variables: { sessionId: LOGGED_IN_SESSION_ID },
};

class MocksOne {
  constructor(readonly typename: string, readonly message: string) {}

  gql(): MockedResponse[] {
    return [
      {
        request,
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
  constructor(readonly isRegistered: boolean, readonly userId: string) {}

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            verifySession: {
              __typename: "UserData",
              user: {
                __typename: "User",
                accessToken: "accessToken",
                dateCreated: Date.now(),
                email: "mail@example.com",
                firstName: "first name",
                id: this.userId,
                image: null,
                isRegistered: this.isRegistered,
                lastName: "last Name",
                sessionId: LOGGED_IN_SESSION_ID,
              },
              status: "SUCCESS",
            },
          },
        },
      },
      ...refresh.gql(),
    ];
  }
}

export const notAllowed = new MocksOne(
  "NotAllowedError",
  "Failed to Authenticate User"
);

const unknown = new MocksOne(
  "UnknownError",
  "Unknown session id. Authentication failed"
);

const unsupported = new MocksOne("UnsupportedObjectType", msg);

const userSession = new MocksOne(
  "UserSessionError",
  "Current logged in session could not be verified"
);

const validation = {
  message: "Current logged in session could not be verified",
  gql(): MockedResponse[] {
    return [
      {
        request,
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
  gql(): MockedResponse[] {
    return [{ request, result: { errors: [new GraphQLError(this.message)] } }];
  },
};

const network = {
  message: "Server is currently unreachable. Please try again later",
  gql(): MockedResponse[] {
    return [{ request, error: new Error(this.message) }];
  },
};

const registered = new MocksTwo(true, "registered_user_id");
const unregistered = new MocksTwo(false, "unregistered_user_id");
export const decode = new MocksTwo(true, "registered_user_id");

interface TableOne {
  msg: string;
  gql: MockedResponse[];
}

export const tableOne: [string, TableOne][] = [
  ["session id is unknown", { msg: unknown.message, gql: unknown.gql() }],
  ["session id is invalid", { msg: validation.message, gql: validation.gql() }],
  [
    "verification response is an unsupported object type",
    { msg: unsupported.message, gql: unsupported.gql() },
  ],
  [
    "user session could not be verified",
    { msg: userSession.message, gql: userSession.gql() },
  ],
  [
    "verification fails with a GraphQL error",
    { msg: graphql.message, gql: graphql.gql() },
  ],
  [
    "verification fails with a Network error",
    { msg: network.message, gql: network.gql() },
  ],
];

interface TableTwo {
  from: string;
  to: string;
  mock: MocksTwo;
}

export const tableTwo: [string, string, TableTwo][] = [
  [
    "home(dashboard)",
    "registered",
    { from: "/login", to: "/", mock: registered },
  ],
  [
    "register",
    "unregistered",
    { from: "/", to: "/register", mock: unregistered },
  ],
];

interface TableThree {
  pathname: string;
  mock: MocksTwo;
}

export const tableThree: [string, string, TableThree][] = [
  [
    "page at the current route",
    "registered",
    { pathname: "/", mock: registered },
  ],
  [
    "register page",
    "unregistered",
    { pathname: "/register", mock: unregistered },
  ],
];
