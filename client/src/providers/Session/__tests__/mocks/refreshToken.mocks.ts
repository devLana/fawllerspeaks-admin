import { GraphQLError } from "graphql";
import { graphql, HttpResponse, type GraphQLHandler } from "msw";

import { REFRESH_TOKEN } from "@mutations/session/refreshToken";
import { VERIFY_SESSION } from "@mutations/session/verifySession";

const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGQ5ZTAzNC0xMWQxLTQ2ZjItOGRmNS1hMmVmOTQ4MDJkOWMiLCJpYXQiOjE2OTU4NDA2ODMsImV4cCI6MTY5NTg0MDY4M30.aiSxMDQYPhsKJ8n8Tfaq1ryJZrpjEwVbn1ADAepOWds`;

export const verified = graphql.mutation(VERIFY_SESSION, () => {
  return HttpResponse.json({
    data: {
      verifySession: {
        __typename: "SessionData",
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
      },
    },
  });
});

const auth = graphql.mutation(REFRESH_TOKEN, () => {
  return HttpResponse.json({
    data: { refreshToken: { __typename: "UnauthorizedError" } },
  });
});

const forbid = graphql.mutation(REFRESH_TOKEN, () => {
  return HttpResponse.json({
    data: { refreshToken: { __typename: "ForbiddenError" } },
  });
});

export const redirects: Array<
  [string, { pathname: string; handler: GraphQLHandler; status: string }]
> = [
  [
    "Expect a redirect to the login page if there was an error verifying the user session",
    { pathname: "/post-tags", handler: auth, status: "unauthorized" },
  ],
  [
    "Expect a redirect to the login page if there was an error authenticating the user session",
    { pathname: "/settings/password", handler: forbid, status: "invalid" },
  ],
];

export const alerts: Array<[string, Array<[string, GraphQLHandler]>]> = [
  [
    "API request resolves with an error or an unsupported object type",
    [
      [
        "Expect an alert message toast if the api server throws a graphql error",
        graphql.mutation(REFRESH_TOKEN, () => {
          return HttpResponse.json({
            errors: [new GraphQLError("Mock graphql error response")],
          });
        }),
      ],
      [
        "Expect an alert message toast if the refresh request fails with a Network error",
        graphql.mutation(REFRESH_TOKEN, () => HttpResponse.error()),
      ],
      [
        "Expect an alert message toast if the refresh request receives an unsupported object type",
        graphql.mutation("RefreshToken", () => {
          return HttpResponse.json({
            data: { refreshToken: { __typename: "UnsupportedType" } },
          });
        }),
      ],
    ],
  ],
  [
    "Access token is successfully refreshed",
    [
      [
        "Update application with refreshed access token",
        graphql.mutation(REFRESH_TOKEN, () => {
          return HttpResponse.json({
            data: {
              refreshToken: {
                __typename: "RefreshData",
                accessToken: "new.access.token",
              },
            },
          });
        }),
      ],
    ],
  ],
];
