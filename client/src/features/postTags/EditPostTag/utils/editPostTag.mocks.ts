import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { EDIT_POST_TAG } from "../operations/EDIT_POST_TAG";
import { testPostTag } from "../../utils/testPostTag";
import { mswData, mswErrors } from "@utils/tests/msw";

interface Redirects {
  pathname: string;
  url: string;
}

const nameStr = (prefix: string) => `${prefix} post tag`;
export const tagName = "Post tag";
const tagId = "tag-id-1";
const validate1Msg = "Invalid post tag name";
const validate2Msg = "Invalid post tag id";
const duplicateMsg = "Duplicate post tag error message";
const unknownMsg = "Post tag does not exist";
const gqlMsg = "Unable to edit post tag. Please try again later";
const warnMsg = "New post tag name same as old one";

const message =
  "You are unable to edit the post tag at the moment. Please try again later";

class Mock<T extends string | undefined = undefined> {
  name: string;

  constructor(prefix: string, readonly msg: T) {
    this.name = nameStr(prefix);
  }
}

const auth = new Mock("auth", undefined);
const notAllowed = new Mock("not allowed", undefined);
const unregister = new Mock("unregister", undefined);
const validate1 = new Mock("validate1", validate1Msg);
const validate2 = new Mock("validate2", validate2Msg);
const duplicate = new Mock("duplicate", duplicateMsg);
const unknown = new Mock("unknown", unknownMsg);
const unsupported = new Mock("unsupported", message);
const warn = new Mock("warn", warnMsg);
const network = new Mock("network", message);
const gql = new Mock("graphql", gqlMsg);
export const edit = new Mock("edit", "Post tag edited");

const tag = testPostTag(edit.name, tagId, 1);

export const server = setupServer(
  graphql.query("GetPostTags", async () => {
    await delay();

    return mswData("getPostTags", "PostTags", {
      tags: [testPostTag(tagName, tagId, 2)],
    });
  }),

  graphql.mutation(EDIT_POST_TAG, async ({ variables: { name } }) => {
    await delay();

    if (name === nameStr("auth")) {
      return mswData("editPostTag", "AuthenticationError");
    }

    if (name === nameStr("not allowed")) {
      return mswData("editPostTag", "NotAllowedError");
    }

    if (name === nameStr("unregister")) {
      return mswData("editPostTag", "RegistrationError");
    }

    if (name === nameStr("validate1")) {
      return mswData("editPostTag", "EditPostTagValidationError", {
        tagIdError: null,
        nameError: validate1Msg,
      });
    }

    if (name === nameStr("validate2")) {
      return mswData("editPostTag", "EditPostTagValidationError", {
        tagIdError: validate2Msg,
        nameError: null,
      });
    }

    if (name === nameStr("duplicate")) {
      return mswData("editPostTag", "DuplicatePostTagError", {
        message: duplicateMsg,
      });
    }

    if (name === nameStr("unknown")) {
      return mswData("editPostTag", "UnknownError", { message: unknownMsg });
    }

    if (name === nameStr("unsupported")) {
      return mswData("editPostTag", "UnsupportedType");
    }

    if (name === nameStr("warn")) {
      return mswData("editPostTag", "EditedPostTagWarning", {
        message: warnMsg,
        tag: testPostTag(warn.name, tagId, 3),
      });
    }

    if (name === nameStr("edit")) {
      return mswData("editPostTag", "EditedPostTag", { tag });
    }

    if (name === nameStr("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    if (name === nameStr("graphql")) {
      return mswErrors(new GraphQLError(gqlMsg));
    }

    return mswErrors(new Error(), { status: 400 });
  })
);

export const resolver = () => {
  return mswData("getPostTags", "PostTags", { tags: [tag] });
};

export const redirects: [string, Redirects, Mock][] = [
  [
    "Should redirect to the registration page if the user is not registered",
    {
      url: "/register?status=unregistered&redirectTo=/post-tags",
      pathname: "/post-tags",
    },
    unregister,
  ],
  [
    "Should redirect to the login page if the user is not logged in",
    {
      url: "/login?status=unauthenticated&redirectTo=/posts/new",
      pathname: "/posts/new",
    },
    auth,
  ],
  [
    "Should redirect to the login page if the user could not be verified",
    { url: "/login?status=unauthorized", pathname: "posts" },
    notAllowed,
  ],
];

const label = "Should display a notification alert message if the";
export const validations: [string, Mock<string>][] = [
  [`${label} is invalid`, validate1],
  [`${label} already exists`, duplicate],
];

const text = "Should display an alert message toast if the";
export const alerts: [string, Mock<string>][] = [
  [`${text} new post tag name is the same as the old post tag name`, warn],
  [`${text} provided post tag id validation failed`, validate2],
  [`${text} post tag to edit does not exist`, unknown],
  [`${text} api response is an unsupported object type`, unsupported],
  [`${text} api throws a graphql error`, gql],
  [`${text} api request failed with a network error`, network],
];
