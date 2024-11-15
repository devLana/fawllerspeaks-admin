import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { EDIT_POST_TAG } from "@mutations/editPostTag/EDIT_POST_TAG";
import { testPostTag } from "@utils/tests/testPostTag";
import { mswData, mswErrors } from "@utils/tests/msw";

export const cancel = { name: /^cancel$/i };
export const editBtn = { name: /^edit tag$/i };
export const textbox = { name: /^post tag$/i };

export const dialog = (name: string) => ({
  name: new RegExp(`^edit post tag - ${name}$`, "i"),
});

const nameStr = (prefix: string) => `${prefix} post tag`;
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
  id: string;

  constructor(prefix: string, readonly msg: T) {
    this.id = `${prefix}-post-tag-id`;
    this.name = nameStr(prefix);
  }
}

const edit = new Mock("edit", "Post tag edited");
const unknown = new Mock("unknown", unknownMsg);
const auth = new Mock("auth", undefined);
const notAllowed = new Mock("not allowed", undefined);
const unregister = new Mock("unregister", undefined);
const validate1 = new Mock("validate1", validate1Msg);
const validate2 = new Mock("validate2", validate2Msg);
const duplicate = new Mock("duplicate", duplicateMsg);
const unsupported = new Mock("unsupported", message);
const warn = new Mock("warn", warnMsg);
const network = new Mock("network", message);
const gql = new Mock("graphql", gqlMsg);

const tag = testPostTag(edit.name, tagId);

export const server = setupServer(
  graphql.query(GET_POST_TAGS, () => {
    return mswData("getPostTags", "PostTags", { tags: [] });
  }),

  graphql.mutation(EDIT_POST_TAG, async ({ variables: { name } }) => {
    await delay(50);

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
        tag: testPostTag(warn.name, tagId),
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

interface Redirects {
  pathname: string;
  params: { pathname: string; query: Record<string, string> };
}

export const redirects: [string, Redirects, Mock][] = [
  [
    "Should redirect to the registration page if the user is not registered",
    {
      params: {
        pathname: "/register",
        query: { status: "unregistered", redirectTo: "/post-tags" },
      },
      pathname: "/post-tags",
    },
    unregister,
  ],
  [
    "Should redirect to the login page if the user is not logged in",
    {
      params: {
        pathname: "/login",
        query: { status: "unauthenticated", redirectTo: "/post-tags" },
      },
      pathname: "/post-tags",
    },
    auth,
  ],
  [
    "Should redirect to the login page if the user could not be verified",
    {
      params: { pathname: "/login", query: { status: "unauthorized" } },
      pathname: "/post-tags",
    },
    notAllowed,
  ],
];

const label = "Expect the input field to have an error message if the";
export const validations: [string, Mock<string>][] = [
  [`${label} API input validation failed`, validate1],
  [`${label} post tag name already exists`, duplicate],
];

const text = "Expect an alert message toast if the";
export const alerts: [string, Mock<string>][] = [
  [`${text} new post tag name is the same as the old post tag name`, warn],
  [`${text} post tag id input validation failed`, validate2],
  [`${text} API response is an unsupported object type`, unsupported],
  [`${text} API throws a graphql error`, gql],
  [`${text} API request failed with a network error`, network],
];

export const table: [string, [string, Mock<string>][]][] = [
  [
    "Verify post tag",
    [
      [
        `${text} post tag that the user is trying to edit does not exist`,
        unknown,
      ],
    ],
  ],
  [
    "Post tag edited",
    [
      [
        "Expect the post tag's name to be edited to the new post tag name",
        edit,
      ],
    ],
  ],
];
