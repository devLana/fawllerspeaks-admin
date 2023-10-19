import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { getTestPostTags } from "./getTestPostTags";
import { testPostTag } from "./testPostTag";
import { CREATE_POST_TAGS } from "../CreatePostTags/operations/CREATE_POST_TAGS";

interface AlertMocks {
  tags: string[];
  message: string;
  gql: () => MockedResponse[];
}

const request = (tags: string[]): MockedResponse["request"] => {
  return { query: CREATE_POST_TAGS, variables: { tags } };
};

const redirectMock = (label: string, typename: string, path: string) => ({
  tags: [`${label} post tag`],
  path,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tags),
        result: { data: { createPostTags: { __typename: typename } } },
      },
      getTestPostTags(),
    ];
  },
});

const auth = redirectMock(
  "Auth",
  "AuthenticationError",
  "/login?status=unauthenticated"
);

const unknown = redirectMock(
  "Unknown",
  "UnknownError",
  "/login?status=unauthorized"
);

const register = redirectMock(
  "Register",
  "RegistrationError",
  "/register?status=unregistered"
);

export const redirectTable: [string, ReturnType<typeof redirectMock>][] = [
  ["Response is an AuthenticationError, Redirect to the login page", auth],
  ["Response is an UnknownError, Redirect to the login page", unknown],
  [
    "Redirect to the registration page if the response is a RegistrationError",
    register,
  ],
];

const message =
  "You are unable to create post tags at the moment. Please try again later";

const network = {
  tags: ["network post tag 1", "network post tag 2"],
  message,
  gql(): MockedResponse[] {
    return [
      { request: request(this.tags), error: new Error(this.message) },
      getTestPostTags(),
    ];
  },
};

const graphql = {
  tags: ["graphql post tag 1", "graphql post tag 2"],
  message: "Unable to create post tags. Please try again later",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tags),
        result: { errors: [new GraphQLError(this.message)] },
      },
      getTestPostTags(),
    ];
  },
};

const unsupported = {
  tags: ["unsupported post tag 1", "unsupported post tag 2"],
  message,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tags),
        result: { data: { createPostTags: { __typename: "UnsupportedType" } } },
      },
      getTestPostTags(),
    ];
  },
};

const validation = {
  tags: ["validation post tag 1", "validation post tag 2"],
  message: "Post tags input must be an array",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tags),
        result: {
          data: {
            createPostTags: {
              __typename: "CreatePostTagsValidationError",
              tagsError: this.message,
            },
          },
        },
      },
      getTestPostTags(),
    ];
  },
};

const duplicate = {
  tags: ["duplicate post tag 1", "duplicate post tag 2"],
  message: "Duplicate post tags error message",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tags),
        result: {
          data: {
            createPostTags: {
              __typename: "DuplicatePostTagError",
              message: this.message,
            },
          },
        },
      },
      getTestPostTags(),
    ];
  },
};

export const alertTable: [string, AlertMocks][] = [
  [
    "Display an alert message if api server responds with a validation error object type",
    validation,
  ],
  ["Display an alert message if api server throws a graphql error", graphql],
  [
    "Display an alert message if api server responds with a network error",
    network,
  ],
  [
    "Display an alert message if api server responds with an unsupported object type",
    unsupported,
  ],
  [
    "Display an alert message if api server responds with a duplicate tags error object type",
    duplicate,
  ],
];

export const create = {
  tags: ["create post tag 1", "create post tag 2", "create post tag 3"],
  postTags() {
    return [
      testPostTag(this.tags[0], "1"),
      testPostTag(this.tags[1], "2"),
      testPostTag(this.tags[2], "3"),
    ];
  },
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tags),
        result: {
          data: {
            createPostTags: { __typename: "PostTags", tags: [this.postTags()] },
          },
        },
      },
      getTestPostTags(),
      getTestPostTags(this.postTags()),
    ];
  },
};

export const warnCreate = {
  tags: ["post tag 1", "post tag 2", "post tag 3", "post tag 4"],
  postTags() {
    return [testPostTag(this.tags[0], "1"), testPostTag(this.tags[3], "4")];
  },
  message: "This response message will be shown in an alert",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tags),
        result: {
          data: {
            createPostTags: {
              __typename: "PostTagsWarning",
              tags: [this.postTags()],
              message: this.message,
            },
          },
        },
      },
      getTestPostTags(),
      getTestPostTags(this.postTags()),
    ];
  },
};
