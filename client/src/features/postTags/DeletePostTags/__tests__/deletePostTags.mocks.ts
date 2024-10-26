import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";
import type { Cache } from "@apollo/client/cache/core/types/Cache";

import { DELETE_POST_TAGS } from "@mutations/deletePostTags/DELETE_POST_TAGS";
import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { testPostTag } from "@utils/tests/testPostTag";
import { mswData, mswErrors } from "@utils/tests/msw";
import type { GetPostTagsData } from "types/postTags/getPostTags";

export const dialog1 = { name: /^Delete post tag$/i };
export const dialog2 = { name: /^Delete post tags$/i };
export const delBtn1 = { name: /^Delete Tag$/i };
export const delBtn2 = { name: /^Delete Tags$/i };
export const cancelBtn = { name: /^cancel$/i };

const mock = <T extends string | undefined = undefined>(
  prefix: string,
  total: number,
  msg: T
) => {
  const tagIds: string[] = [];

  const tags = new Array<string>(total).fill("").map((_, idx) => {
    const tagId = `${prefix}-id-${idx + 1}`;
    const tagName = `post tag ${idx + 1}`;

    tagIds.push(tagId);

    return testPostTag(tagName, tagId);
  });

  const [{ name }] = tags;

  return { tags, tagIds, msg, name };
};

type Mok<T extends string | undefined = undefined> = ReturnType<typeof mock<T>>;

const gqlMsg = "Delete post tag graphql error";
const unknownMsg = "Post tags could not be deleted";
const validateMsg = "Post tag id validation error";
const warnMsg = "2 post tags deleted. 1 not deleted";

const message =
  "You are unable to delete post tags at the moment. Please try again later";

export const unknown = mock("unknown", 5, unknownMsg);
export const validate = mock("validate", 4, validateMsg);
export const warn = mock("warn", 3, warnMsg);
export const all1 = mock("all1", 1, "Post tag deleted");
export const all2 = mock("all2", 4, "Post tags deleted");
const auth = mock("auth", 1, undefined);
const notAllowed = mock("not-allowed", 1, undefined);
const unregister = mock("unregister", 1, undefined);
const gql = mock("graphql", 2, gqlMsg);
const network = mock("network", 2, message);
const unsupported = mock("unsupported", 2, message);

export const server = setupServer(
  graphql.query(GET_POST_TAGS, () => {
    return mswData("getPostTags", "PostTags", { tags: [] });
  }),

  graphql.mutation(DELETE_POST_TAGS, async ({ variables: { tagIds } }) => {
    await delay(50);

    if (tagIds[0].startsWith("auth")) {
      return mswData("deletePostTags", "AuthenticationError");
    }

    if (tagIds[0].startsWith("not-allowed")) {
      return mswData("deletePostTags", "NotAllowedError");
    }

    if (tagIds[0].startsWith("unregister")) {
      return mswData("deletePostTags", "RegistrationError");
    }

    if (tagIds[0].startsWith("unsupported")) {
      return mswData("deletePostTags", "UnsupportedType");
    }

    if (tagIds[0].startsWith("unknown")) {
      return mswData("deletePostTags", "UnknownError", { message: unknownMsg });
    }

    if (tagIds[0].startsWith("validate")) {
      return mswData("deletePostTags", "DeletePostTagsValidationError", {
        tagIdsError: validateMsg,
      });
    }

    if (tagIds[0].startsWith("warn")) {
      return mswData("deletePostTags", "DeletedPostTagsWarning", {
        message: warnMsg,
      });
    }

    if (tagIds[0].startsWith("all1")) {
      return mswData("deletePostTags", "DeletedPostTags", {
        tagIds: all1.tagIds,
      });
    }

    if (tagIds[0].startsWith("all2")) {
      return mswData("deletePostTags", "DeletedPostTags", {
        tagIds: all2.tagIds,
      });
    }

    if (tagIds[0].startsWith("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    if (tagIds[0].startsWith("graphql")) {
      return mswErrors(new GraphQLError(gqlMsg));
    }

    return mswErrors(new Error(), { status: 400 });
  })
);

interface Redirects {
  pathname: string;
  params: { pathname: string; query: Record<string, string> };
}

export const redirects: [string, Redirects, Mok][] = [
  [
    "Expect a redirect to the login page it the user is not logged in",
    {
      params: {
        pathname: "/login",
        query: { status: "unauthenticated", redirectTo: "/posts" },
      },
      pathname: "/posts",
    },
    auth,
  ],
  [
    "Expect a redirect to the login page if the user could not be verified",
    {
      params: { pathname: "/login", query: { status: "unauthorized" } },
      pathname: "/settings/me/edit",
    },
    notAllowed,
  ],
  [
    "Expect a redirect to the registration page if the user is not registered",
    {
      params: {
        pathname: "/register",
        query: { status: "unregistered", redirectTo: "/posts/edit" },
      },
      pathname: "/posts/edit",
    },
    unregister,
  ],
];

const text = "Expect an alert message toast if the API";
export const alerts: [string, Mok<string>][] = [
  [`${text} throws a graphql error`, gql],
  [`${text} request fails with a network error`, network],
  [`${text} responds with an unsupported object type`, unsupported],
];

export const errors: [string, Mok<string>][] = [
  [`${text} responds with an input validation error`, validate],
  ["Expect an alert message toast if no post tag(s) could be deleted", unknown],
];

interface Data {
  diff: number;
  str: string;
  dialog: { name: RegExp };
  btn: { name: RegExp };
}

export const deletes: [string, Mok<string>, Data][] = [
  [
    "Expect some of the selected post tags to be deleted",
    warn,
    { diff: 1, str: "these 2 post tags", btn: delBtn2, dialog: dialog2 },
  ],
  [
    "Expect the selected post tag to be deleted",
    all1,
    { diff: 0, str: all1.name, btn: delBtn1, dialog: dialog1 },
  ],
  [
    "Expect all of the selected post tags to be deleted",
    all2,
    { diff: 0, str: "all post tags", btn: delBtn2, dialog: dialog2 },
  ],
];

export const writeTags = (
  tags: Mok["tags"]
): Cache.WriteQueryOptions<GetPostTagsData, object> => ({
  query: GET_POST_TAGS,
  data: { getPostTags: { __typename: "PostTags", tags, status: "SUCCESS" } },
});
