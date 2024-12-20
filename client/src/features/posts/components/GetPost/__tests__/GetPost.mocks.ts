import { GraphQLError } from "graphql";
import { ApolloError } from "@apollo/client";

import type { GetPostData } from "types/posts/getPost";

export interface UIProps {
  data: GetPostData | undefined;
  error: ApolloError | undefined;
  loading: boolean;
}

interface Params {
  asPath: string;
  url: { pathname: string; query: { status: string; redirectTo?: string } };
}

export const load = { name: /^loading view post page$/i };

const slugError = "Invalid slug";
const warnMsg = "Unable to find post";
const MSG = "Something went wrong. Unable to fetch post";

export const uiProps = { label: "Post label", msg: MSG };

export const errors: [string, ApolloError, string][] = [
  [
    "The API throws a graphql error response, Expect a status message",
    new ApolloError({ graphQLErrors: [new GraphQLError("Error fetching ")] }),
    "Error fetching",
  ],
  [
    "The API request failed with a network error, Expect a status message",
    new ApolloError({ networkError: new Error() }),
    MSG,
  ],
];

export const alerts: [string, GetPostData | undefined, string][] = [
  [
    "The API responds with a slug input validation error, Expect a status message",
    { getPost: { __typename: "GetPostValidationError", slugError } },
    slugError,
  ],
  [
    "There was an error getting a post with the provided slug, Expect a status message",
    { getPost: { __typename: "GetPostWarning", message: warnMsg } },
    warnMsg,
  ],
  [
    "The API responds with no error and no data, Expect a status message",
    undefined,
    MSG,
  ],
];

export const redirects: [string, Params, GetPostData][] = [
  [
    "Should redirect to the login page if the user could not be verified",
    ((asPath: string) => ({
      asPath,
      url: { pathname: "/login", query: { status: "unauthorized" } },
    }))("/posts/view/blog-post-title"),
    { getPost: { __typename: "NotAllowedError", message: "" } },
  ],
  [
    "Should redirect to the login page if the user is not logged in",
    ((asPath: string) => ({
      asPath,
      url: {
        pathname: "/login",
        query: { status: "unauthenticated", redirectTo: asPath },
      },
    }))("/posts/edit/blog-post-title"),
    { getPost: { __typename: "AuthenticationError", message: "" } },
  ],
  [
    "Should redirect to the register page if the user's account is unregistered",
    ((asPath: string) => ({
      asPath,
      url: {
        pathname: "/register",
        query: { status: "unregistered", redirectTo: asPath },
      },
    }))("/posts/edit/other-blog-post-title"),
    { getPost: { __typename: "RegistrationError", message: "" } },
  ],
];

export const post: GetPostData = {
  getPost: {
    __typename: "SinglePost",
    post: {
      __typename: "Post",
      id: "id-1",
      title: "Blog Title",
      description: "Description",
      excerpt: "Excerpt",
      content: { __typename: "PostContent", html: "<p>paragraph</p>" },
      imageBanner: null,
      tags: [
        { __typename: "PostTag", id: "id-1", name: "tag 1" },
        { __typename: "PostTag", id: "id-2", name: "tag 2" },
      ],
      status: "Draft",
    },
  },
};
