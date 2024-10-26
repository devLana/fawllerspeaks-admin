import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";

import { CREATE_POST_TAGS } from "@mutations/createPostTags/CREATE_POST_TAGS";
import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { testPostTag } from "@utils/tests/testPostTag";
import { mswData, mswErrors } from "@utils/tests/msw";

export const cancel = { name: /^cancel$/i };
export const createDialogBtn = { name: /^create post tags$/i };
export const dialog = { name: /^create new post tags$/i };
export const textBox = { name: /^post tag$/i };
export const addMoreBtn = { name: /^add more$/i };
export const saveBtn = { name: /^Create tags$/i };

const tagsError = "Post tags input must be an array";
const message = "Duplicate post tags error message";
const gqlMsg = "Unable to create post tags. Please try again later";
const warnMsg = "Some post tags have already been created";

const errorMsg =
  "You are unable to create post tags at the moment. Please try again later";

class Mock<T extends string | undefined = undefined> {
  tags: string[];

  constructor(prefix: string, total: number, readonly msg: T) {
    const tags = Array<string>(total).fill("");
    this.tags = tags.map((_, idx) => `${prefix} post tag ${idx + 1}`);
  }
}

const create = new Mock("create", 3, "Post tags created");
const warn = new Mock("warn", 3, warnMsg);
const auth = new Mock("auth", 1, undefined);
const unknown = new Mock("unknown", 1, undefined);
const unregister = new Mock("unregister", 1, undefined);
const network = new Mock("network", 2, errorMsg);
const gqlAPI = new Mock("graphql", 2, gqlMsg);
const unsupported = new Mock("unsupported", 2, errorMsg);
const validation = new Mock("validate", 2, tagsError);
const duplicate = new Mock("duplicate", 2, message);

const mocks = (mock: Mock<string>) => {
  return mock.tags.map((item, index) => testPostTag(item, `${index + 1}`));
};

export const server = setupServer(
  graphql.query(GET_POST_TAGS, () => {
    return mswData("getPostTags", "PostTags", { tags: [] });
  }),

  graphql.mutation(CREATE_POST_TAGS, async ({ variables: { tags } }) => {
    await delay(50);

    if (tags[0].startsWith("auth")) {
      return mswData("createPostTags", "AuthenticationError");
    }

    if (tags[0].startsWith("unknown")) {
      return mswData("createPostTags", "UnknownError");
    }

    if (tags[0].startsWith("unregister")) {
      return mswData("createPostTags", "RegistrationError");
    }

    if (tags[0].startsWith("unsupported")) {
      return mswData("createPostTags", "UnsupportedType");
    }

    if (tags[0].startsWith("validate")) {
      return mswData("createPostTags", "CreatePostTagsValidationError", {
        tagsError,
      });
    }

    if (tags[0].startsWith("duplicate")) {
      return mswData("createPostTags", "DuplicatePostTagError", { message });
    }

    if (tags[0].startsWith("create")) {
      return mswData("createPostTags", "PostTags", { tags: mocks(create) });
    }

    if (tags[0].startsWith("warn")) {
      return mswData("createPostTags", "CreatedPostTagsWarning", {
        message: warnMsg,
        tags: [testPostTag(warn.tags[0], "1"), testPostTag(warn.tags[2], "3")],
      });
    }

    if (tags[0].startsWith("graphql")) {
      return mswErrors(new GraphQLError(gqlMsg));
    }

    if (tags[0].startsWith("network")) {
      return mswErrors(new Error(), { status: 503 });
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
    "Should redirect to the login page if the user is not logged in",
    {
      params: {
        pathname: "/login",
        query: { status: "unauthenticated", redirectTo: "/settings/password" },
      },
      pathname: "/settings/password",
    },
    auth,
  ],
  [
    "Should redirect to the login page if the user could not be verified",
    {
      params: { pathname: "/login", query: { status: "unauthorized" } },
      pathname: "/post-tags",
    },
    unknown,
  ],
  [
    "Should redirect to the register page if the user is unregistered",
    {
      params: {
        pathname: "/register",
        query: { status: "unregistered", redirectTo: "/posts/new" },
      },
      pathname: "/posts/new",
    },
    unregister,
  ],
];

const text = "Expect an alert message toast if the";
export const alerts: [string, Mock<string>][] = [
  [`${text} API response is an input validation error`, validation],
  [`${text} API throws a graphql error`, gqlAPI],
  [`${text} API request failed with a network error`, network],
  [`${text} API response is an unsupported object type`, unsupported],
  [`${text} user attempts to create post tags that already exist`, duplicate],
];

export const creates: [string, Mock<string>][] = [
  [
    "All the provided post tags are created, Should display a notification alert",
    create,
  ],
  [
    "Some of the passed post tags are created, Should display a notification alert",
    warn,
  ],
];
