import { GraphQLError } from "graphql";
import { delay, type StrictResponse } from "msw";
import { setupServer } from "msw/node";

import { testPostTag } from "@utils/tests/testPostTag";
import { mswData, mswErrors, type TypeNames } from "@utils/tests/msw";

type Typename = TypeNames<"getPostTags">;

interface Redirects {
  pathname: string;
  params: { pathname: string; query: Record<string, string> };
}

interface Res {
  data?: object;
  errors?: object[];
}

export const label = { name: /^loading post tags$/i };
const tags = [testPostTag("Tag 1", "1")];
const gqlMsg = "Unable to get post tags. Please try again later";

const message =
  "You are unable to get post tags at the moment. Please try again later";

const noTagsMsg =
  "No post tags have been created yet. Click on 'Create Post Tags' above to get started";

export const server = setupServer();

const dataCb = (typename: Typename, data: object = {}) => {
  return async () => {
    await delay(50);
    return mswData("getPostTags", typename, data);
  };
};

type MswData = ReturnType<typeof mswData<"getPostTags">>;
export const redirects: [string, Redirects, () => Promise<MswData>][] = [
  [
    "Expect the user to be redirected to the login page if the user is not logged in",
    {
      params: {
        pathname: "/login",
        query: { status: "unauthenticated", redirectTo: "/posts/new" },
      },
      pathname: "/posts/new",
    },
    dataCb("AuthenticationError"),
  ],
  [
    "Expect the user to be redirected to the login page if the user could not be verified",
    {
      params: { pathname: "/login", query: { status: "unauthorized" } },
      pathname: "/posts",
    },
    dataCb("UnknownError"),
  ],
  [
    "Expect the user to be redirected to the registration page if the user is not registered",
    {
      params: {
        pathname: "/register",
        query: { status: "unregistered", redirectTo: "/post-tags" },
      },
      pathname: "/post-tags",
    },
    dataCb("RegistrationError"),
  ],
];

const network = async () => {
  await delay(50);
  return mswErrors(new Error(), { status: 503 });
};

const gql = async () => {
  await delay(50);
  return mswErrors(new GraphQLError(gqlMsg));
};

const text = "Expect a notification status message if the API";
export const alerts: [string, string, () => Promise<StrictResponse<Res>>][] = [
  [`${text} throws a graphql error`, gqlMsg, gql],
  [`${text} request fails with a network error`, message, network],
  [
    `${text} responds with an unsupported object type`,
    message,
    dataCb("UnsupportedType"),
  ],
  [
    `${text} responds with an empty post tags array`,
    noTagsMsg,
    dataCb("PostTags", { tags: [] }),
  ],
];

export const all = async () => {
  await delay(50);
  return mswData("getPostTags", "PostTags", { tags });
};
