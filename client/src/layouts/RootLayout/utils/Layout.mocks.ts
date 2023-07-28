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

export const LOGOUT_SESSION_ID = "Logout_Session_Id";
const msg = "You are unable to logout at the moment. Please try again later";

const request: MockedResponse["request"] = {
  query: LOGOUT,
  variables: { sessionId: LOGOUT_SESSION_ID },
};

class Mock {
  readonly status: string;

  constructor(
    readonly typename: string,
    readonly message: string,
    status = "ERROR"
  ) {
    this.status = status;
  }

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            logout: {
              __typename: this.typename,
              message: this.message,
              status: this.status,
            },
          },
        },
      },
    ];
  }
}

const auth = new Mock("AuthenticationError", "You are not logged in");
const response = new Mock("Response", "User logged out", "SUCCESS");
const unsupported = new Mock("Unsupported", msg, "WARN");

const unknown = new Mock(
  "UnknownError",
  "The current session could not be verified"
);

const notAllowed = new Mock(
  "NotAllowedError",
  "You cannot perform that action right now"
);

const validate = {
  message: "Invalid session id",
  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            logout: {
              __typename: "SessionIdValidationError",
              sessionIdError: this.message,
              status: "ERROR",
            },
          },
        },
      },
    ];
  },
};

const graphql = {
  message: "Unable to logout right now. Please try again later",
  gql(): MockedResponse[] {
    return [{ request, result: { errors: [new GraphQLError(this.message)] } }];
  },
};

const network = {
  message: msg,
  gql(): MockedResponse[] {
    return [{ request, error: new Error(this.message) }];
  },
};

export const errorsTable: [string, MockedResponse[], string][] = [
  [
    "Display an alert if user session id is invalid",
    validate.gql(),
    validate.message,
  ],
  [
    "Display an alert if user session could not be found",
    unknown.gql(),
    unknown.message,
  ],
  [
    "Display an alert if request had invalid cookies",
    notAllowed.gql(),
    notAllowed.message,
  ],
  [
    "Display an alert if response throws a graphql error",
    graphql.gql(),
    graphql.message,
  ],
  [
    "Display an alert if request resolves with a network error",
    network.gql(),
    network.message,
  ],
  [
    "Display an alert if server responds with an unsupported object type",
    unsupported.gql(),
    unsupported.message,
  ],
];

export const logoutTable: [string, MockedResponse[], string][] = [
  [
    "Redirect user to the login page if the user is not logged in",
    auth.gql(),
    "/login?status=unauthenticated",
  ],
  ["Log user out and redirect to the login page", response.gql(), "/login"],
];
