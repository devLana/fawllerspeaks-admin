import { GraphQLError } from "graphql";
import { graphql } from "msw";
import { setupServer } from "msw/node";

import { REFRESH_TOKEN } from "../operations/REFRESH_TOKEN";
import { mswData, mswErrors } from "@utils/tests/msw";

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGQ5ZTAzNC0xMWQxLTQ2ZjItOGRmNS1hMmVmOTQ4MDJkOWMiLCJpYXQiOjE2OTU4NDA2ODMsImV4cCI6MTY5NTg0MDY4M30.aiSxMDQYPhsKJ8n8Tfaq1ryJZrpjEwVbn1ADAepOWds";

export const server = setupServer(
  graphql.mutation("VerifySession", () => {
    return mswData("verifySession", "VerifiedSession", {
      accessToken,
      user: {
        __typename: "User",
        id: "user_id",
        email: "mail@example.com",
        firstName: "first name",
        lastName: "last name",
        image: null,
        isRegistered: true,
      },
    });
  }),

  graphql.mutation(REFRESH_TOKEN, ({ variables: { sessionId } }) => {
    if (sessionId === "USER_SESSION_ID") {
      return mswData("refreshToken", "UserSessionError");
    }

    if (sessionId === "VALIDATION_SESSION_ID") {
      return mswData("refreshToken", "SessionIdValidationError");
    }

    if (sessionId === "UNKNOWN_SESSION_ID") {
      return mswData("refreshToken", "UnknownError");
    }

    if (sessionId === "FORBIDDEN_SESSION_ID") {
      return mswData("refreshToken", "ForbiddenError");
    }

    if (sessionId === "UNSUPPORTED_SESSION_ID") {
      return mswData("refreshToken", "UnsupportedType");
    }

    if (sessionId === "NOT_ALLOWED_SESSION_ID") {
      return mswData("refreshToken", "NotAllowedError");
    }

    if (sessionId === "AUTH_COOKIE_SESSION_ID") {
      return mswData("refreshToken", "AuthCookieError");
    }

    if (sessionId === "GRAPHQL_ERROR_SESSION_ID") {
      return mswErrors(new GraphQLError("Mock graphql error response"));
    }

    if (sessionId === "NETWORK_ERROR_SESSION_ID") {
      return mswErrors(new Error(), { status: 503 });
    }

    if (sessionId === "REFRESH_SESSION_ID") {
      return mswData("refreshToken", "AccessToken", {
        accessToken: "newAuthToken",
      });
    }
  })
);

const mock = (label: string) => `${label}_SESSION_ID`;

const refresh = mock("REFRESH");
const session = mock("USER");
const validate = mock("VALIDATION");
const unknown = mock("UNKNOWN");
const forbid = mock("FORBIDDEN");
const unsupported = mock("UNSUPPORTED");
const notAllowed = mock("NOT_ALLOWED");
const authCookie = mock("AUTH_COOKIE");
const gql = mock("GRAPHQL_ERROR");
const network = mock("NETWORK_ERROR");

const msg = "Should redirect to the login page if the";
export const redirects: [string, string, string][] = [
  [`${msg} user session could not be verified`, "unauthorized", notAllowed],
  [`${msg} user session has expired`, "expired", authCookie],
];

const text = "Should display an alert message toast if the";
export const alerts: [string, [string, string][]][] = [
  [
    "Refresh request got an error or an unsupported object type response",
    [
      [`${text} user session id is invalid`, validate],
      [`${text} user session is unknown`, unknown],
      [`${text} user session was not assigned to the current user`, session],
      [`${text} user's access token could not be refreshed`, forbid],
      [`${text} api throws a graphql error`, gql],
      [`${text} refresh request failed with a network error`, network],
      [`${text} api response is an unsupported object type`, unsupported],
    ],
  ],
  [
    "Access token is successfully refreshed",
    [["Update application with refreshed access token", refresh]],
  ],
];
