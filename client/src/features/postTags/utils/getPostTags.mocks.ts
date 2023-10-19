import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { testPostTag } from "./testPostTag";
import { GET_POST_TAGS } from "../GetPostTags/operations/GET_POST_TAGS";

interface AlertMocks {
  message: string;
  gql: () => MockedResponse[];
}

const request: MockedResponse["request"] = {
  query: GET_POST_TAGS,
};

const redirectMock = (typename: string, path: string) => ({
  path,
  gql(): MockedResponse[] {
    return [
      { request, result: { data: { getPostTags: { __typename: typename } } } },
    ];
  },
});

const unknown = redirectMock("UnknownError", "/login?status=unauthorized");

const auth = redirectMock(
  "AuthenticationError",
  "/login?status=unauthenticated"
);

const register = redirectMock(
  "RegistrationError",
  "/register?status=unregistered"
);

export const getRedirect: [string, ReturnType<typeof redirectMock>][] = [
  [
    "Redirect to the login page if the response is an AuthenticationError",
    auth,
  ],
  ["Redirect to the login page if the response is an UnknownError", unknown],
  [
    "Redirect to the registration page if the response is a RegistrationError",
    register,
  ],
];

const message =
  "You are unable to get post tags at the moment. Please try again later";

const network = {
  message,
  gql(): MockedResponse[] {
    return [{ request, error: new Error(this.message) }];
  },
};

const graphql = {
  message: "Unable to get post tags. Please try again later",
  gql(): MockedResponse[] {
    return [{ request, result: { errors: [new GraphQLError(this.message)] } }];
  },
};

const unsupported = {
  message,
  gql(): MockedResponse[] {
    return [
      {
        request,
        result: { data: { getPostTags: { __typename: "UnsupportedType" } } },
      },
    ];
  },
};

const noTags = {
  message:
    "No post tags have been created yet. Click on 'Create Post Tags' above to get started",

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: { data: { getPostTags: { __typename: "PostTags", tags: [] } } },
      },
    ];
  },
};

export const getAlerts: [string, AlertMocks][] = [
  [
    "Render an error message if api server responds with an unsupported object type",
    unsupported,
  ],
  [
    "Render a notification message if api server responds with an empty tags array",
    noTags,
  ],
  ["Render an error message if api server throws a graphql error", graphql],
  [
    "Render an error message if api server responds with a network error",
    network,
  ],
];

export const getTags = {
  tags: ["Tag 1", "Tag 2", "Tag 3"],
  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            getPostTags: {
              __typename: "PostTags",
              tags: [
                testPostTag(this.tags[0], "1"),
                testPostTag(this.tags[1], "2"),
                testPostTag(this.tags[2], "3"),
              ],
            },
          },
        },
      },
    ];
  },
};
