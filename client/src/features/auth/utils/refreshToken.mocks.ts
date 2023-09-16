import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { REFRESH_TOKEN } from "../operations/REFRESH_TOKEN";
import { VERIFY_SESSION } from "../operations/VERIFY_SESSION";

interface Expected {
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
                id: testUserId,
                email: "mail@example.com",
                firstName: "first name",
                lastName: "last name",
                image: null,
                isRegistered: false,
              },
            },
          },
        },
      },
    ];
  },
};

class Mocks {
  sessionId: string;

  constructor(id: string, readonly typename: string) {
    this.sessionId = `${id}_SESSION_ID`;
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: { data: { refreshToken: { __typename: this.typename } } },
      },
      ...verify.gql(this.sessionId),
    ];
  }
}

const session = new Mocks("SESSION", "UserSessionError");
const validate = new Mocks("VALIDATion", "SessionIdValidationError");
const unknown = new Mocks("UNKNOWN", "UnknownError");
const forbid = new Mocks("FORBIDDEN", "ForbiddenError");
const unsupported = new Mocks("UNSUPPORTED", "UnrecognisedObject");

const graphql = {
  sessionId: "GRAPHQL_ERROR_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: { errors: [new GraphQLError("Mock graphql error response")] },
      },
      ...verify.gql(this.sessionId),
    ];
  },
};

const network = {
  sessionId: "NETWORK_ERROR_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        error: new Error("Server is currently unreachable"),
      },
      ...verify.gql(this.sessionId),
    ];
  },
};

export const notAllowed = {
  sessionId: "NOT_ALLOWED_SESSION_ID",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.sessionId),
        result: { data: { refreshToken: { __typename: "NotAllowedError" } } },
      },
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
            },
          },
        },
      },
      ...verify.gql(this.sessionId),
    ];
  },
};

export const table: [string, Expected][] = [
  ["User session id is invalid", validate],
  ["User session is unknown", unknown],
  ["The user session was not assigned to the current user", session],
  ["Server response is an unsupported object type", unsupported],
  ["The current user's access token could not be refreshed", forbid],
  ["Server resolved with a graphql error", graphql],
  ["Server request failed with a network error", network],
];
