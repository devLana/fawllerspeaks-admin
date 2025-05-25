import { GraphQLError } from "graphql";
import { ApolloError } from "@apollo/client";

import { testPostTag } from "@utils/tests/testPostTag";
import type { GetPostTagsData } from "types/postTags/getPostTags";

export interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  data: GetPostTagsData | undefined;
}

interface Mock {
  pathname: string;
  params: { pathname: string; query: object };
}

export const loading = /^Loading post tags$/i;
export const combobox = /^Post tags combobox$/i;

const MSG = `You can't add post tags to this post at the moment. Please try again later`;
const gqlMsg = `Graphql error response message`;
const noDataMsg = `No post tags found. Go to the 'Post Tags' page to create some post tags`;
const emptyDataMsg = `No post tags have been created yet. Go to the 'Post Tags' page to get started`;

const networkProps: Props = {
  loading: false,
  data: undefined,
  error: new ApolloError({ networkError: new Error("Network Error") }),
};

const gqlProps: Props = {
  loading: false,
  data: undefined,
  error: new ApolloError({
    graphQLErrors: [new GraphQLError(gqlMsg)],
  }),
};

const noDataProps: Props = {
  loading: false,
  error: undefined,
  data: undefined,
};

const emptyDataProps: Props = {
  loading: false,
  error: undefined,
  data: { getPostTags: { __typename: "PostTags", tags: [] } },
};

const authProps: Props["data"] = {
  getPostTags: { __typename: "AuthenticationError", message: "Not logged in" },
};

const authMock: Mock = {
  pathname: "/posts/new",
  params: {
    pathname: "/login",
    query: { status: "unauthenticated", redirectTo: "/posts/new" },
  },
};

const unknownProps: Props["data"] = {
  getPostTags: { __typename: "UnknownError", message: "Unknown user" },
};

const unknownMock: Mock = {
  pathname: "/posts/edit",
  params: { pathname: "/login", query: { status: "unauthorized" } },
};

const registerProps: Props["data"] = {
  getPostTags: {
    __typename: "RegistrationError",
    message: "Unregistered user",
  },
};

const registerMock: Mock = {
  pathname: "/posts/new",
  params: {
    pathname: "/register",
    query: { status: "unregistered", redirectTo: "/posts/new" },
  },
};

const text = "Expect a status message if";
export const alerts: [string, Props, string][] = [
  [`${text} the request failed with a network error `, networkProps, MSG],
  [`${text} the API responded with a graphql error`, gqlProps, gqlMsg],
  [`${text} the request resolved with no data`, noDataProps, noDataMsg],
  [`${text} there are no post tags`, emptyDataProps, emptyDataMsg],
];

const label = "Expect a redirect to the";
export const errors: [string, Props["data"], Mock][] = [
  [`${label} login page if the user is not logged in`, authProps, authMock],
  [
    `${label} login page if the logged in user could not be verified`,
    unknownProps,
    unknownMock,
  ],
  [
    `${label} registration page if the user's account is unregistered`,
    registerProps,
    registerMock,
  ],
];

const tags = [testPostTag("Tag 1", "fc2f2351-80c7-4e4c-b462-11b3512f1293")];

export const dataProps: Props = {
  loading: false,
  error: undefined,
  data: { getPostTags: { __typename: "PostTags", tags } },
};
