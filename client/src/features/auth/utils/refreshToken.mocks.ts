import { GraphQLError } from "graphql";
import { gql } from "@apollo/client";
import type { MockedResponse } from "@apollo/client/testing";

import { REFRESH_TOKEN } from "../operations/REFRESH_TOKEN";
import { VERIFY_SESSION } from "../operations/VERIFY_SESSION";
import { testCache } from "./sessionTestRenderer";

interface Expected {
  message: string;
  gql: () => MockedResponse[];
}

const testUserId = "New_Authenticated_User_Id";
export const newAccessToken = "new_access_token";
export const LOGGED_IN_SESSION_ID = "LOGGED_IN_SESSION_ID";

const request: MockedResponse["request"] = {
  query: REFRESH_TOKEN,
  variables: { sessionId: LOGGED_IN_SESSION_ID },
};

export const getTestUserToken = () => {
  const user = testCache.readFragment<{ accessToken: string }>({
    id: `User:${testUserId}`,
    fragment: gql`
      fragment GetTestUserToken on User {
        accessToken
      }
    `,
  });

  if (!user) throw Error("Test user not found");
  return user;
};

const login = {
  gql(): MockedResponse[] {
    return [
      {
        request: {
          query: VERIFY_SESSION,
          variables: { sessionId: LOGGED_IN_SESSION_ID },
        },
        result: {
          data: {
            verifySession: {
              __typename: "UserData",
              user: {
                __typename: "User",
                accessToken: "old_access_token",
                dateCreated: Date.now(),
                email: "mail@example.com",
                firstName: "first name",
                id: testUserId,
                image: null,
                isRegistered: false,
                lastName: "last name",
                sessionId: LOGGED_IN_SESSION_ID,
              },
              status: "SUCCESS",
            },
          },
        },
      },
    ];
  },
};

class Mocks {
  constructor(
    readonly typename: string,
    readonly message = "Your access token could not be refreshed"
  ) {}

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            refreshToken: {
              __typename: this.typename,
              message: this.message,
              status: "ERROR",
            },
          },
        },
      },
      ...login.gql(),
    ];
  }
}

const unknown = new Mocks("UnknownError");
const session = new Mocks("UserSessionError");
const auth = new Mocks("AuthenticationError");
const notAllowed = new Mocks("NotAllowedError");
const unsupported = new Mocks(
  "UnrecognisedObject",
  "An unexpected error has occurred while trying to refresh your access token"
);

const validate = {
  message: "Your access token could not be refreshed",
  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            refreshToken: {
              __typename: "SessionIdValidationError",
              sessionIdError: "Invalid session id",
              status: "ERROR",
            },
          },
        },
      },
      ...login.gql(),
    ];
  },
};

const graphql = {
  message: "Mock graphql error response",
  gql(): MockedResponse[] {
    return [
      { request, result: { errors: [new GraphQLError(this.message)] } },
      ...login.gql(),
    ];
  },
};

const network = {
  message: "Server is currently unreachable. Please try again later",
  gql(): MockedResponse[] {
    return [{ request, error: new Error(this.message) }, ...login.gql()];
  },
};

export const refresh = {
  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            refreshToken: {
              __typename: "AccessToken",
              accessToken: newAccessToken,
              status: "SUCCESS",
            },
          },
        },
      },
      ...login.gql(),
    ];
  },
};

export const table1: [string, MockedResponse[], string][] = [
  ["User is not logged in", auth.gql(), "unauthenticated"],
  ["User session could not be verified", notAllowed.gql(), "unauthorized"],
];

export const table2: [string, Expected][] = [
  ["User session id is invalid", validate],
  ["User session is unknown", unknown],
  ["The user session was not assigned to the logged in user", session],
  ["Server response is an unsupported object type", unsupported],
  ["Server resolved with a graphql error", graphql],
  ["Server request failed with a network error", network],
];
