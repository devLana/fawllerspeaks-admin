import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { REFRESH_TOKEN } from "../operations/REFRESH_TOKEN";
import { VERIFY_SESSION } from "../operations/VERIFY_SESSION";

interface Expected {
  message: string;
  gql: () => MockedResponse[];
  sessionId: string;
}

const testUserId = "New_Authenticated_User_Id";
export const newAccessToken = "new_access_token";

const request = (sessionId: string): MockedResponse["request"] => {
  return { query: REFRESH_TOKEN, variables: { sessionId } };
};

const verify = {
  gql(sessionId: string): MockedResponse[] {
    return [
      {
        request: { query: VERIFY_SESSION, variables: { sessionId } },
        result: {
          data: {
            verifySession: {
              __typename: "VerifiedSession",
              accessToken: "old_access_token",
              user: {
                __typename: "User",
                dateCreated: new Date().toISOString(),
                email: "mail@example.com",
                firstName: "first name",
                id: testUserId,
                image: null,
                isRegistered: false,
                lastName: "last name",
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
  sessionId: string;

  constructor(
    id: string,
    readonly typename: string,
    readonly message = "Your access token could not be refreshed"
  ) {
    this.sessionId = `${id}_SESSION_ID`;
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
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
      ...verify.gql(this.sessionId),
    ];
  }
}

const unknown = new Mocks("UNKNOWN", "UnknownError");
const session = new Mocks("SESSION", "UserSessionError");
const auth = new Mocks("AUTH", "AuthenticationError");
const notAllowed = new Mocks("NOT_ALLOWED", "NotAllowedError");
const unsupported = new Mocks(
  "UNSUPPORTED",
  "UnrecognisedObject",
  "An unexpected error has occurred while trying to refresh your access token"
);

const validate = {
  message: "Your access token could not be refreshed",
  sessionId: "VALIDATE_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
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
      ...verify.gql(this.sessionId),
    ];
  },
};

const graphql = {
  message: "Mock graphql error response",
  sessionId: "GRAPHQL_ERROR_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: { errors: [new GraphQLError(this.message)] },
      },
      ...verify.gql(this.sessionId),
    ];
  },
};

const network = {
  message: "Server is currently unreachable. Please try again later",
  sessionId: "NETWORK_ERROR_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      { request: request(this.sessionId), error: new Error(this.message) },
      ...verify.gql(this.sessionId),
    ];
  },
};

export const refresh = {
  sessionId: "REFRESH_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
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
      ...verify.gql(this.sessionId),
    ];
  },
};

export const table1: [string, string, Mocks][] = [
  ["User is not logged in", "unauthenticated", auth],
  ["User session could not be verified", "unauthorized", notAllowed],
];

export const table2: [string, Expected][] = [
  ["User session id is invalid", validate],
  ["User session is unknown", unknown],
  ["The user session was not assigned to the logged in user", session],
  ["Server response is an unsupported object type", unsupported],
  ["Server resolved with a graphql error", graphql],
  ["Server request failed with a network error", network],
];
