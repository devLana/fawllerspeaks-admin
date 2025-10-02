import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { GET_POSTS } from "@queries/getPosts/GET_POSTS";
import { mswData, mswErrors, type TypeNames } from "@utils/tests/msw";

type Typename = TypeNames<"getPosts">;

export const server = setupServer();
export const page = { name: /^$/i };
export const load = { name: /^loading blog posts$/i };
export const PARAMS_MSG = `It seems some of the search filters provided are invalid`;
export const VALIDATION_MSG = `Invalid search filters provided`;
export const afterError = "Invalid posts pagination cursor provided";
export const sizeError = "Invalid posts pagination size provided";
const GQL_MSG = `It appears we could not find what you are looking for. Please try again later`;
const FORBID_MSG = "Unable to get posts";

const MESSAGE =
  "You are unable to get posts at the moment. Please try again later";

export const posts = graphql.query(GET_POSTS, async () => {
  await delay(50);
  return mswData("getPosts", "GetPostsData", {
    posts: [],
    pageData: { next: null, previous: null },
  });
});

const network = async () => {
  await delay(50);
  return mswErrors(new Error(), { status: 503 });
};

const gql = async () => {
  await delay(50);
  return mswErrors(new GraphQLError(GQL_MSG));
};

const resolver = (typename: Typename, data: object = {}) => {
  return async () => {
    await delay(50);
    return mswData("getPosts", typename, data);
  };
};

export const validations = graphql.query(GET_POSTS, async () => {
  await delay(50);
  return mswData("getPosts", "GetPostsValidationError", {
    afterError,
    sizeError,
  });
});

export const redirects = [
  [
    "Expect the user to be redirected to the login page if the user is not logged in",
    ((asPath: string) => ({
      params: {
        pathname: "/login",
        query: { status: "unauthenticated", redirectTo: asPath },
      },
      asPath,
      query: {},
    }))("/posts"),
    graphql.query(GET_POSTS, resolver("AuthenticationError")),
  ],
  [
    "Expect the user to be redirected to the login page if the user could not be verified",
    ((asPath: string) => ({
      params: { pathname: "/login", query: { status: "unauthorized" } },
      asPath,
      query: {},
    }))("/posts"),
    graphql.query(GET_POSTS, resolver("NotAllowedError")),
  ],
  [
    "Expect the user to be redirected to the registration page if the user is not registered",
    ((asPath: string) => ({
      params: {
        pathname: "/register",
        query: { status: "unregistered", redirectTo: asPath },
      },
      asPath,
      query: { params: ["before", "post-cursor"] },
    }))("/posts/after/post-cursor"),
    graphql.query(GET_POSTS, resolver("RegistrationError")),
  ],
] as const;

const text = "Expect a notification status message if the API";
export const alerts = [
  [
    `${text} request contains an invalid cursor format`,
    FORBID_MSG,
    graphql.query(
      GET_POSTS,
      resolver("ForbiddenError", { message: FORBID_MSG })
    ),
  ],
  [
    `${text} request fails with a network error`,
    MESSAGE,
    graphql.query(GET_POSTS, network),
  ],
  [`${text} throws a graphql error`, GQL_MSG, graphql.query(GET_POSTS, gql)],
  [
    `${text} responds with an unsupported object type`,
    MESSAGE,
    graphql.query(GET_POSTS, resolver("UnsupportedType")),
  ],
] as const;
