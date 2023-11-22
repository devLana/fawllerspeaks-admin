import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { testPostTag } from "./testPostTag";
import { getTestPostTags } from "./getTestPostTags";
import { DELETE_POST_TAGS } from "../DeletePostTags/operations/DELETE_POST_TAGS";

export const wrapper = (tagName: string) => {
  return new RegExp(`^${tagName} post tag container$`, "i");
};

export const name = (tagName: string) => ({
  name: new RegExp(`^${tagName} post tag$`, "i"),
});

export const tagLabel = (tagName: string) => ({
  name: new RegExp(tagName, "i"),
});

export const toolbarBtn = (text: string, letter = "") => ({
  name: new RegExp(`delete ${text} post tag${letter}`, "i"),
});

export const deleteMenuItem = { name: /^delete$/i };
export const dialog1 = { name: /^Delete post tag$/i };
export const dialog2 = { name: /^Delete post tags$/i };
export const deleteBtn1 = { name: /^Delete Tag$/i };
export const deleteBtn2 = { name: /^Delete Tags$/i };
export const selectAll = { name: /^select all post tags$/i };
export const deselectAll = { name: /^deselect all post tags$/i };

const testTag1: [string, string] = ["tag 1", "1"];
const testTag2: [string, string] = ["tag 2", "2"];
const testTag3: [string, string] = ["tag 3", "3"];
const testTag4: [string, string] = ["tag 4", "4"];
const testTag5: [string, string] = ["tag 5", "5"];
const tag1 = testPostTag(...testTag1);
const tag2 = testPostTag(...testTag2);
const tag3 = testPostTag(...testTag3);
const tag4 = testPostTag(...testTag4);
const tag5 = testPostTag(...testTag5);

const message =
  "You are unable to delete post tags at the moment. Please try again later";

export const deleteMock1 = {
  gql(): MockedResponse[] {
    return [getTestPostTags([tag5])];
  },
};

interface Table1 {
  checkbox: { name: RegExp };
  dialog: { name: RegExp };
  text: string;
  gql: () => MockedResponse[];
}

export const table1: [string, Table1][] = [
  [
    "Click the select all checkbox then the toolbar delete button, Display the delete dialog box",
    {
      checkbox: selectAll,
      dialog: dialog2,
      text: "tag 1",
      gql(): MockedResponse[] {
        return [getTestPostTags([tag1, tag2, tag3, tag4, tag5])];
      },
    },
  ],
  [
    "Click a post tag checkbox then the toolbar delete button, Display the delete dialog box",
    {
      checkbox: tagLabel("tag 4"),
      dialog: dialog1,
      text: "tag 4",
      gql(): MockedResponse[] {
        return [getTestPostTags([tag4])];
      },
    },
  ],
];

const request = (tagIds: string[]): MockedResponse["request"] => {
  return { query: DELETE_POST_TAGS, variables: { tagIds } };
};

const redirects = (id: string, path: string, typename: string) => ({
  path,
  tag: ["tag 1", id] as [string, string],
  gql(): MockedResponse[] {
    return [
      {
        request: request([this.tag[1]]),
        result: { data: { deletePostTags: { __typename: typename } } },
      },
      getTestPostTags([testPostTag(...this.tag)]),
    ];
  },
});

const auth = redirects(
  "auth-id",
  "/login?status=unauthenticated",
  "AuthenticationError"
);
const notAllowed = redirects(
  "not-allowed-id",
  "/login?status=unauthorized",
  "NotAllowedError"
);
const register = redirects(
  "register-id",
  "/register?status=unregistered",
  "RegistrationError"
);

export const redirectTable: [string, ReturnType<typeof redirects>][] = [
  [
    "Should redirect to the registration page if the user is not registered",
    register,
  ],
  ["Should redirect to the login page if the user is not logged in", auth],
  [
    "Should redirect to the login page if the user is not recognized",
    notAllowed,
  ],
];

const alertObjMOck = (id: string) => ({
  tagIds: [`${id}-id-1`, `${id}-id-2`],
  tags: [
    ["tag 1", `${id}-id-1`],
    ["tag 2", `${id}-id-2`],
  ] as [string, string][],
});

const unsupported = {
  ...alertObjMOck("unsupported"),
  message,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tagIds),
        result: {
          data: {
            deletePostTags: {
              __typename: "UnsupportedType",
              message: this.message,
            },
          },
        },
      },
      getTestPostTags([
        testPostTag(...this.tags[0]),
        testPostTag(...this.tags[1]),
      ]),
    ];
  },
};

const graphql = {
  ...alertObjMOck("graphql"),
  message: "Post tag id validation error",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.tagIds),
        result: { errors: [new GraphQLError(this.message)] },
      },
      getTestPostTags([
        testPostTag(...this.tags[0]),
        testPostTag(...this.tags[1]),
      ]),
    ];
  },
};

const network = {
  ...alertObjMOck("network"),
  message,
  gql(): MockedResponse[] {
    return [
      { request: request(this.tagIds), error: new Error(this.message) },
      getTestPostTags([
        testPostTag(...this.tags[0]),
        testPostTag(...this.tags[1]),
      ]),
    ];
  },
};

interface AlertMock {
  message: string;
  tagIds: string[];
  tags: [string, string][];
  gql: () => MockedResponse[];
}

export const alertTable: [string, AlertMock][] = [
  [
    "Should display an alert message if the api throws a graphql error",
    graphql,
  ],
  [
    "Should display an alert message if the response fails with a network error",
    network,
  ],
  [
    "Should display an alert message if the api responded with an unsupported object type",
    unsupported,
  ],
];

export const unknown = {
  ...alertObjMOck("unknown"),
  message: "Post tags could not be deleted",
  gql(): MockedResponse[] {
    return [
      getTestPostTags([
        testPostTag(...this.tags[0]),
        testPostTag(...this.tags[1]),
      ]),
      {
        request: request(this.tagIds),
        result: {
          data: {
            deletePostTags: {
              __typename: "UnknownError",
              message: this.message,
            },
          },
        },
      },
      getTestPostTags([]),
    ];
  },
};

export const validate = {
  ...alertObjMOck("validate"),
  message: "Post tag id validation error",
  gql(): MockedResponse[] {
    return [
      getTestPostTags([
        testPostTag(...this.tags[0]),
        testPostTag(...this.tags[1]),
      ]),
      {
        request: request(this.tagIds),
        result: {
          data: {
            deletePostTags: {
              __typename: "DeletePostTagsValidationError",
              tagIdsError: this.message,
            },
          },
        },
      },
      getTestPostTags([testPostTag(...this.tags[1])]),
    ];
  },
};

export const warn = {
  tagIds: ["warn-id-1", "warn-id-2", "warn-id-3"],
  tags: [
    ["tag 1", "warn-id-1"],
    ["tag 2", "warn-id-2"],
    ["tag 3", "warn-id-3"],
  ] as [string, string][],
  message: "2 post tags deleted. 1 not deleted",
  gql(): MockedResponse[] {
    return [
      getTestPostTags([
        testPostTag(...this.tags[0]),
        testPostTag(...this.tags[1]),
        testPostTag(...this.tags[2]),
      ]),
      {
        request: request(this.tagIds),
        result: {
          data: {
            deletePostTags: {
              __typename: "PostTagsWarning",
              message: this.message,
            },
          },
        },
      },
      getTestPostTags([testPostTag(...this.tags[0])]),
    ];
  },
};

export const msg =
  "No post tags have been created yet. Click on 'Create Post Tags' above to get started";
export const del = {
  tagIds: ["delete-id-1", "delete-id-2", "delete-id-3"],
  tags: [
    ["tag 1", "delete-id-1"],
    ["tag 2", "delete-id-2"],
    ["tag 3", "delete-id-3"],
  ] as [string, string][],
  message: "Post tags deleted",
  gql(): MockedResponse[] {
    return [
      getTestPostTags([
        testPostTag(...this.tags[0]),
        testPostTag(...this.tags[1]),
        testPostTag(...this.tags[2]),
      ]),
      {
        request: request(this.tagIds),
        result: {
          data: {
            deletePostTags: {
              __typename: "PostTags",
              tags: [
                testPostTag(...this.tags[0]),
                testPostTag(...this.tags[1]),
                testPostTag(...this.tags[2]),
              ],
            },
          },
        },
      },
    ];
  },
};
