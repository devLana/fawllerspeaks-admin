import { GraphQLError } from "graphql";
import { graphql, HttpResponse } from "msw";

import { VERIFY_SESSION } from "@mutations/session/verifySession";

export const TEXT_NODE = "Testing User Authentication";
export const MSG = `An unexpected error has occurred while trying to verify your current session`;
const NETWORK_MSG = `The server is currently unreachable. Please try again later`;
const GQL_MSG = "Mock graphql error response. Authentication failed";
const jwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGQ5ZTAzNC0xMWQxLTQ2ZjItOGRmNS1hMmVmOTQ4MDJkOWMiLCJpYXQiOjE2OTU4NDA2ODMsImV4cCI6MTY5NTg0MDY4M30.aiSxMDQYPhsKJ8n8Tfaq1ryJZrpjEwVbn1ADAepOWds`;

const userData = (accessToken = jwt, isRegistered = true) => {
  return {
    __typename: "SessionData",
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
  } as const;
};

export const refresher = graphql.mutation("RefreshToken", () => {
  return HttpResponse.json({
    data: { refreshToken: { __typename: "UnsupportedType" } },
  });
});

export const decode = graphql.mutation(VERIFY_SESSION, () => {
  return HttpResponse.json({
    data: { verifySession: userData("access.token") },
  });
});

const unregistered = graphql.mutation(VERIFY_SESSION, () => {
  return HttpResponse.json({
    data: { verifySession: userData(undefined, false) },
  });
});

const registered = graphql.mutation(VERIFY_SESSION, () => {
  return HttpResponse.json({ data: { verifySession: userData() } });
});

export const alerts = [
  [
    "Expect an alert message box to be rendered if the api server throws a GraphQL error",
    GQL_MSG,
    graphql.mutation(VERIFY_SESSION, () => {
      return HttpResponse.json({ errors: [new GraphQLError(GQL_MSG)] });
    }),
  ],
  [
    "Expect an alert message box to be rendered if the session verification request fails with a Network error",
    NETWORK_MSG,
    graphql.mutation(VERIFY_SESSION, () => HttpResponse.error()),
  ],
  [
    "Expect an alert message box to be rendered if an unsupported object type is received in the response",
    MSG,
    graphql.mutation("VerifySession", () => {
      return HttpResponse.json({
        data: { verifySession: { __typename: "UnsupportedType" } },
      });
    }),
  ],
] as const;

export const redirects = [
  [
    "Expect a redirect to the login page if there was an error verifying the user session",
    graphql.mutation(VERIFY_SESSION, () => {
      return HttpResponse.json({
        data: { verifySession: { __typename: "UnauthorizedError" } },
      });
    }),
  ],
  [
    "Expect a redirect to the login page if there was an error authenticating the user session",
    graphql.mutation(VERIFY_SESSION, () => {
      return HttpResponse.json({
        data: { verifySession: { __typename: "ForbiddenError" } },
      });
    }),
  ],
] as const;

export const authRedirects = [
  [
    "Expect a redirect to the register page if an unregistered user is not on the register route",
    unregistered,
    { from: "/settings/password", to: "/register" },
  ],
  [
    "Expect a redirect to the dashboard page if a registered user is on the register route",
    registered,
    { from: "/register", to: "/" },
  ],
] as const;

export const renders = [
  [
    "Expect the page at the current route to be rendered if a registered user is successfully authenticated",
    registered,
    "/posts/new",
  ],
  [
    "Expect the page at the register route to be rendered if an unregistered user is successfully authenticated",
    unregistered,
    "/register",
  ],
] as const;
