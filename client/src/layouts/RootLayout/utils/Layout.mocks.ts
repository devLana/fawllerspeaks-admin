import { GraphQLError } from "graphql";
import { gql } from "@apollo/client";
import type { MockedResponse } from "@apollo/client/testing";

import { LOGOUT } from "../components/Navbar/components/LogoutModal/LOGOUT";
import { testCache, testUserId } from "@utils/renderTestUI";

export const avatar = (hasImage: boolean) => {
  testCache.writeFragment({
    id: `User:${testUserId}`,
    data: {
      __typename: "User",
      id: testUserId,
      image: hasImage ? "image_src" : null,
      firstName: "John",
      lastName: "Doe",
    },
    fragment: gql`
      fragment AddTestUser on User {
        __typename
        id
        image
        firstName
        lastName
      }
    `,
  });
};

export const storageTheme = (theme: string) => {
  return JSON.stringify({
    themeMode: theme,
    fontSize: 14,
    color: "#7dd1f3",
  });
};

const SESSION_ID = "Logout_Session_Id";
const msg = "You are unable to logout at the moment. Please try again later";

const request = (sessionId: string): MockedResponse["request"] => {
  return { query: LOGOUT, variables: { sessionId } };
};

interface Data {
  typename: string;
  message: string;
}

interface LogoutTable {
  gql: () => MockedResponse[];
  sessionId: string;
}

interface ErrorsTable extends LogoutTable {
  message: string;
}

class MockOne {
  typename: string;
  message: string;

  constructor(readonly sessionId: string, data: Data) {
    this.typename = data.typename;
    this.message = data.message;
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: {
          data: {
            logout: { __typename: this.typename, message: this.message },
          },
        },
      },
    ];
  }
}

class MockTwo {
  constructor(readonly sessionId: string, readonly typename: string) {}

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: { data: { logout: { __typename: this.typename } } },
      },
    ];
  }
}

const auth = new MockTwo(`auth_${SESSION_ID}`, "AuthenticationError");
const response = new MockTwo(`response_${SESSION_ID}`, "Response");

const unsupported = new MockOne(`unsupported_${SESSION_ID}`, {
  typename: "UnsupportedObjectType",
  message: msg,
});

const unknown = new MockOne(`unknown_${SESSION_ID}`, {
  typename: "UnknownError",
  message: "The current session could not be verified",
});

const notAllowed = new MockOne(`notAllowed_${SESSION_ID}`, {
  typename: "NotAllowedError",
  message: "You cannot perform that action right now",
});

const validate = {
  message: "Invalid session id",
  sessionId: `validate_${SESSION_ID}`,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: {
          data: {
            logout: {
              __typename: "SessionIdValidationError",
              sessionIdError: this.message,
            },
          },
        },
      },
    ];
  },
};

const graphql = {
  message: "Unable to logout right now. Please try again later",
  sessionId: `graphql_${SESSION_ID}`,
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
  message: msg,
  sessionId: `network_${SESSION_ID}`,
  gql(): MockedResponse[] {
    return [
      { request: request(this.sessionId), error: new Error(this.message) },
    ];
  },
};

export const errorsTable: [string, ErrorsTable][] = [
  ["Display an alert if user session id is invalid", validate],
  ["Display an alert if user session could not be found", unknown],
  ["Display an alert if request had invalid cookies", notAllowed],
  ["Display an alert if response throws a graphql error", graphql],
  ["Display an alert if request resolves with a network error", network],
  [
    "Display an alert if server responds with an unsupported object type",
    unsupported,
  ],
];

export const logoutTable: [string, LogoutTable, string][] = [
  [
    "Redirect user to the login page if the user is not logged in",
    auth,
    "/login?status=unauthenticated",
  ],
  ["Log user out and redirect to the login page", response, "/login"],
];
