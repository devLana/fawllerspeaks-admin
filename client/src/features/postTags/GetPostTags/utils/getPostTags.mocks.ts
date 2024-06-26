import { GraphQLError } from "graphql";
import { delay, graphql, type StrictResponse } from "msw";
import { setupServer } from "msw/node";

import { testPostTag } from "../../utils/testPostTag";
import { mswData, mswErrors, type TypeNames } from "@utils/tests/msw";

type Typename = TypeNames<"getPostTags">;

interface Redirects {
  url: string;
  pathname: string;
}

interface Res {
  data?: object;
  errors?: object[];
}

export const getTags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5"];
const gqlMsg = "Unable to get post tags. Please try again later";

const message =
  "You are unable to get post tags at the moment. Please try again later";

const noTagsMsg =
  "No post tags have been created yet. Click on 'Create Post Tags' above to get started";

const tags = [
  testPostTag(getTags[0], "1"),
  testPostTag(getTags[1], "2"),
  testPostTag(getTags[2], "3"),
  testPostTag(getTags[3], "4"),
  testPostTag(getTags[4], "5"),
];

export const server = setupServer(
  graphql.query("GetPostTags", async () => {
    await delay();
    return mswData("getPostTags", "PostTags", { tags });
  })
);

const dataCb = (typename: Typename, data: object = {}) => {
  return () => mswData("getPostTags", typename, data);
};

type MswData = ReturnType<typeof mswData<"getPostTags">>;
export const redirects: [string, Redirects, () => MswData][] = [
  [
    "Should redirect to the login page if the user is not logged in",
    {
      url: "/login?status=unauthenticated&redirectTo=/posts/new",
      pathname: "/posts/new",
    },
    dataCb("AuthenticationError"),
  ],
  [
    "Should redirect to the login page if the user could not be verified",
    { url: "/login?status=unauthorized", pathname: "/posts" },
    dataCb("UnknownError"),
  ],
  [
    "Should redirect to the registration page if the user is not registered",
    {
      url: "/register?status=unregistered&redirectTo=/post-tags",
      pathname: "/post-tags",
    },
    dataCb("RegistrationError"),
  ],
];

const network = () => mswErrors(new Error(), { status: 503 });
const gql = () => mswErrors(new GraphQLError(gqlMsg));

const text = "Should display a notification alert toast if the api";
export const alerts: [string, string, () => StrictResponse<Res>][] = [
  [`${text} throws a graphql error`, gqlMsg, gql],
  [`${text} request fails with a network error`, message, network],
  [
    `${text} responded with an unsupported object type`,
    message,
    dataCb("UnsupportedType"),
  ],
  [
    `${text} responds with an empty tags array`,
    noTagsMsg,
    dataCb("PostTags", { tags: [] }),
  ],
];
