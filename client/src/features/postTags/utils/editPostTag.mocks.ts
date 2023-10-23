import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { getTestPostTags } from "./getTestPostTags";
import { testPostTag } from "./testPostTag";
import { EDIT_POST_TAG } from "../EditPostTag/operations/EDIT_POST_TAG";

type SorN = string | null;

interface Mocks {
  message: string;
  tag: string;
  gql: () => MockedResponse[];
}

const message =
  "You are unable to edit the post tag at the moment. Please try again later";

const editTestTagId = "Tag-id-1";
export const tag = "Tag 1";
export const editMock = {
  tag: testPostTag(tag, editTestTagId),
  gql(): MockedResponse[] {
    return [getTestPostTags([this.tag])];
  },
};

const request = (name: string, tagId: string): MockedResponse["request"] => {
  return { query: EDIT_POST_TAG, variables: { tagId, name } };
};

const redirects = (label: string, path: string, typename: string) => ({
  path,
  tag: `${label} name`,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tag, editTestTagId),
        result: { data: { editPostTag: { __typename: typename } } },
      },
      ...editMock.gql(),
    ];
  },
});

const auth = redirects(
  "auth",
  "/login?status=unauthenticated",
  "AuthenticationError"
);
const notAllowed = redirects(
  "not allowed",
  "/login?status=unauthorized",
  "NotAllowedError"
);
const register = redirects(
  "register",
  "/register?status=unregistered",
  "RegistrationError"
);

export const registerTable: [string, ReturnType<typeof redirects>][] = [
  [
    "Redirect to the registration page if the response is a RegistrationError",
    register,
  ],
  [
    "Redirect to the login page if the response is an AuthenticationError",
    auth,
  ],
  [
    "Redirect to the login page if the response is a NotAllowedError",
    notAllowed,
  ],
];

const validations = <T extends SorN, U extends SorN>(
  label: string,
  tagIdError: T,
  nameError: U
) => ({
  tagIdError,
  nameError,
  tag: `${label} tag name`,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tag, editTestTagId),
        result: {
          data: {
            editPostTag: {
              __typename: "EditPostTagValidationError",
              tagIdError: this.tagIdError,
              nameError: this.nameError,
            },
          },
        },
      },
      ...editMock.gql(),
    ];
  },
});

const alerts = (msg: string, label: string, typename: string) => ({
  message: msg,
  tag: `${label} tag name`,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tag, editTestTagId),
        result: {
          data: {
            editPostTag: { __typename: typename, message: this.message },
          },
        },
      },
      ...editMock.gql(),
    ];
  },
});

const validation1 = validations("validation 1", null, "Invalid post tag name");
const duplicate = alerts("Error message", "duplicate", "DuplicatePostTagError");

export const validationTable: [string, Mocks][] = [
  [
    "Input box should have an error message if the post tag name is invalid",
    { ...validation1, message: validation1.nameError },
  ],
  [
    "Input box should have an error message if the post tag name already exists",
    duplicate,
  ],
];

const validation2 = validations("validation 2", "Invalid post tag id", null);
const unknown = alerts("Post tag does not exist", "unknown", "UnknownError");
const unsupported = alerts(message, "unsupported", "UnsupportedType");
const network = {
  message,
  tag: "network tag name",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tag, editTestTagId),
        error: new Error(this.message),
      },
      ...editMock.gql(),
    ];
  },
};

const graphql = {
  tag: "graphql tag name",
  message: "Unable to edit post tag. Please try again later",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tag, editTestTagId),
        result: { errors: [new GraphQLError(this.message)] },
      },
      ...editMock.gql(),
    ];
  },
};

const warning = {
  tag: "warning tag name",
  message: "New post tag name same as old one",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tag, editTestTagId),
        result: {
          data: {
            editPostTag: {
              __typename: "EditedPostTagWarning",
              tag: testPostTag(this.tag, editTestTagId),
              message: this.message,
            },
          },
        },
      },
      ...editMock.gql(),
    ];
  },
};

export const alertsTable: [string, Mocks][] = [
  [
    "Should display a notification alert message if the provided post tag id validation failed",
    { ...validation2, message: validation2.tagIdError },
  ],
  [
    "Should display a notification alert message if the post tag to edit does not exist",
    unknown,
  ],
  [
    "Should display a notification alert message if the response is an unsupported object type",
    unsupported,
  ],
  [
    "Should display a notification alert message if the new post name is the same as the old post tag name",
    warning,
  ],
  [
    "Should display a notification alert message if the response is a graphql error",
    graphql,
  ],
  [
    "Should display a notification alert message if response is a network error",
    network,
  ],
];

export const edit = {
  tag: "edited tag name",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tag, editTestTagId),
        result: {
          data: {
            editPostTag: {
              __typename: "EditedPostTag",
              tag: testPostTag(this.tag, editTestTagId),
            },
          },
        },
      },
      ...editMock.gql(),
      getTestPostTags([testPostTag(this.tag, editTestTagId)]),
    ];
  },
};
