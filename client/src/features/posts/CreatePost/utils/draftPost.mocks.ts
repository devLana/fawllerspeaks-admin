import { GraphQLError } from "graphql";
import { delay, graphql, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { DRAFT_POST } from "../operations/DRAFT_POST";
import { mswData, mswErrors } from "@utils/tests/msw";
import { testPostTag } from "@features/postTags/utils/testPostTag";

interface Redirects {
  pathname: string;
  url: string;
}

export const draftBtn = { name: /^save as draft$/i };
export const regex = /^Select Post Image Banner$/i;
export const main = { name: /^title$/i };
export const description = { name: /^description$/i };
export const next = { name: /^next$/i };
export const form = { name: /^post metadata$/i };
const titleStr = (prefix: string) => `${prefix} Test Post Title`;
const duplicateMsg = "Post title already exists";
const unknownMsg = "Unknown post tag id provided";
const gqlMsg = "Graphql server error ocurred";
const contentErrorMsg = "Provide post content";

const MESSAGE =
  "You are unable to save this post as draft at the moment. Please try again later";

const tags = [
  testPostTag("Tag 1", "1"),
  testPostTag("Tag 2", "2"),
  testPostTag("Tag 3", "3"),
];

export const server = setupServer(
  graphql.query("GetPostTags", async () => {
    await delay();
    return mswData("getPostTags", "PostTags", { tags });
  }),

  graphql.mutation(DRAFT_POST, async ({ variables: { post } }) => {
    const { title } = post;

    await delay();

    if (title === titleStr("auth")) {
      return mswData("draftPost", "AuthenticationError");
    }

    if (title === titleStr("unregister")) {
      return mswData("draftPost", "RegistrationError");
    }

    if (title === titleStr("not allowed")) {
      return mswData("draftPost", "NotAllowedError");
    }

    if (title === titleStr("duplicate")) {
      return mswData("draftPost", "DuplicatePostTitleError", {
        message: duplicateMsg,
      });
    }

    if (title === titleStr("unknown")) {
      return mswData("draftPost", "UnknownError", { message: unknownMsg });
    }

    if (title === titleStr("validate")) {
      return mswData("draftPost", "PostValidationError", {
        titleError: null,
        descriptionError: null,
        contentError: contentErrorMsg,
        imageBannerError: contentErrorMsg,
        tagsError: "Invalid post tag id provided",
      });
    }

    if (title === titleStr("draft")) return mswData("draftPost", "SinglePost");

    if (title === titleStr("unsupported")) {
      return mswData("draftPost", "UnsupportedType");
    }

    if (title === titleStr("graphql")) {
      return mswErrors(new GraphQLError(gqlMsg));
    }

    if (title === titleStr("network")) {
      return mswErrors(new Error(), { status: 503 });
    }
  })
);

const mock = <T extends string | undefined = undefined>(
  prefix: string,
  message: T
) => ({ title: titleStr(prefix), message });

const draft = mock("draft", undefined);
const auth = mock("auth", undefined);
const unregister = mock("unregister", undefined);
const notAllowed = mock("not allowed", undefined);
const validate = mock("validate", contentErrorMsg);
const unknown = mock("unknown", unknownMsg);
const duplicate = mock("duplicate", duplicateMsg);
const unsupported = mock("unsupported", MESSAGE);
const network = mock("network", MESSAGE);
const gql = mock("graphql", gqlMsg);

export const redirects: [string, ReturnType<typeof mock>, Redirects][] = [
  [
    "Should redirect the user to the login page if the user is not logged in",
    auth,
    {
      url: "/login?status=unauthenticated&redirectTo=/settings/edit/me",
      pathname: "/settings/edit/me",
    },
  ],
  [
    "Should redirect the user to the login page if the user could not be verified",
    notAllowed,
    { url: "/login?status=unauthorized", pathname: "/" },
  ],
  [
    "Should redirect the user to the registration page if the user's account is not registered",
    unregister,
    {
      url: "/register?status=unregistered&redirectTo=/post-tags",
      pathname: "/post-tags",
    },
  ],
];

const str = "Should display an alert notification if";
export const alerts: [string, ReturnType<typeof mock<string>>][] = [
  [`${str} the request failed with a validation error`, validate],
  [`${str} the provided post title already exists`, duplicate],
  [`${str} the api response is an unsupported object type`, unsupported],
  [`${str} the api request fails with a network error`, network],
  [`${str} the api throws a graphql error`, gql],
  [
    `${str} at least one of the provided post tag ids could not be verified`,
    unknown,
  ],
];

const cb1 = () => {
  return HttpResponse.json(
    { image: "path/to/image/on/storage", status: "SUCCESS" },
    { status: 201 }
  );
};

const cb2 = () => HttpResponse.error();

interface DraftMock {
  mock: ReturnType<typeof mock>;
  path: string;
  resolver: () => Response;
}

export const drafts: [string, DraftMock][] = [
  [
    "Should save a new post with an image as draft",
    { mock: draft, resolver: cb1, path: "/posts" },
  ],
  [
    "Image upload failed, Should save a new post without an image as draft",
    { mock: draft, resolver: cb2, path: "/posts?status=draft-upload-error" },
  ],
];
