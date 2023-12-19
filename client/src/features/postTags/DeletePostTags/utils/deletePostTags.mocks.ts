import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { DELETE_POST_TAGS } from "../operations/DELETE_POST_TAGS";
import { testPostTag } from "../../utils/testPostTag";
import { mswData, mswErrors } from "@utils/tests/msw";
import type { PostTagData } from "@types";

export const deleteMenuItem = { name: /^delete$/i };
export const dialog1 = { name: /^Delete post tag$/i };
export const dialog2 = { name: /^Delete post tags$/i };
export const deleteBtn1 = { name: /^Delete Tag$/i };
export const deleteBtn2 = { name: /^Delete Tags$/i };
export const selectAll = { name: /^select all post tags$/i };
export const deselectAll = { name: /^deselect all post tags$/i };
export const cancelBtn = { name: /^cancel$/i };

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

const dataCb = (tags: PostTagData[]) => {
  return () => mswData("getPostTags", "PostTags", { tags });
};

const mock = <T extends string | undefined = undefined>(
  prefix: string,
  total: number,
  msg: T
) => {
  const tagNames: string[] = [];
  const tagIds: string[] = [];

  const tags = new Array<string>(total).fill("").map((_, idx) => {
    const tagName = `post tag ${idx + 1}`;
    const tagId = `${prefix}-id-${idx + 1}`;

    tagNames.push(tagName);
    tagIds.push(tagId);

    return testPostTag(tagName, tagId);
  });

  return { tags, tagIds, msg, tagNames, resolver: dataCb(tags) };
};

const gqlMsg = "Delete post tag graphql error";
const unknownMsg = "Post tags could not be deleted";
const validateMsg = "Post tag id validation error";
const warnMsg = "2 post tags deleted. 1 not deleted";

export const deleteMsg =
  "No post tags have been created yet. Click on 'Create Post Tags' above to get started";

const message =
  "You are unable to delete post tags at the moment. Please try again later";

export const unknown = mock("unknown", 2, unknownMsg);
export const unknownResolver = dataCb([]);
export const validate = mock("validate", 2, validateMsg);
export const validateResolver = dataCb([validate.tags[1]]);
export const warn = mock("warn", 3, warnMsg);
export const warnResolver = dataCb([warn.tags[0]]);
export const del = mock("delete", 3, "Post tags deleted");
const auth = mock("auth", 1, undefined);
const notAllowed = mock("not-allowed", 1, undefined);
const unregister = mock("unregister", 1, undefined);
const gql = mock("graphql", 2, gqlMsg);
const network = mock("network", 2, message);
const unsupported = mock("unsupported", 2, message);

export const server = setupServer(
  graphql.mutation(DELETE_POST_TAGS, async ({ variables: { tagIds } }) => {
    await delay();

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

    if (tagIds[0].startsWith("delete")) {
      return mswData("deletePostTags", "DeletedPostTags", {
        tagIds: del.tagIds,
      });
    }

    if (tagIds[0].startsWith("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    if (tagIds[0].startsWith("graphql")) {
      return mswErrors(new GraphQLError(gqlMsg));
    }
  })
);

export const redirects: [string, string, ReturnType<typeof mock<undefined>>][] =
  [
    [
      "Should redirect to the login page if the user is not logged in",
      "/login?status=unauthenticated",
      auth,
    ],
    [
      "Should redirect to the login page if the user could not be verified",
      "/login?status=unauthorized",
      notAllowed,
    ],
    [
      "Should redirect to the registration page if the user is not registered",
      "/register?status=unregistered",
      unregister,
    ],
  ];

const text = "Should display an alert message toast if the api";
export const alerts: [string, ReturnType<typeof mock<string>>][] = [
  [`${text} throws a graphql error`, gql],
  [`${text} request fails with a network error`, network],
  [`${text} responded with an unsupported object type`, unsupported],
];
