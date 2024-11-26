import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";
import type { Cache } from "@apollo/client/cache/core/types/Cache";

import { GET_POST } from "@queries/viewPost/GET_POST";
import { mswData, mswErrors } from "@utils/tests/msw";
import type { PostData } from "types/posts";
import type { ViewPostData } from "types/posts/viewPost";

const testSlug = (prefix: string) => `${prefix}-test-post-slug`;
export const load = { name: /^loading view post page$/i };
export const region = { name: /^view post page$/i };
export const htm = "<span>View Post</span>";
export const postSlug = testSlug("blog-post");

const slugMsg = "Invalid slug format provided";
const warningMsg = "Blog post not found";
const gqlMsg = "Graphql server error occurred";

const MESSAGE =
  "You are unable to view this post at the moment. Please try again later";

const post: PostData = {
  __typename: "Post",
  id: "id-1",
  title: "Blog Post Test Post Slug",
  description: "description",
  excerpt: "excerpt",
  content: {
    __typename: "PostContent",
    html: "<p>html content</p>",
    tableOfContents: null,
  },
  author: {
    __typename: "PostAuthor",
    name: "First Name",
    image: "image_string",
  },
  status: "Draft",
  url: {
    __typename: "PostUrl",
    href: "blog post link",
    slug: postSlug,
  },
  imageBanner: "image_banner_string",
  dateCreated: new Date().toISOString(),
  datePublished: null,
  lastModified: null,
  views: 0,
  isInBin: false,
  isDeleted: false,
  tags: null,
};

export const writePost: Cache.WriteQueryOptions<ViewPostData, object> = {
  query: GET_POST,
  data: { getPost: { __typename: "SinglePost", post, status: "SUCCESS" } },
};

export const server = setupServer(
  graphql.query(GET_POST, async ({ variables: { slug } }) => {
    await delay(50);

    if (slug === testSlug("auth")) {
      return mswData("getPost", "AuthenticationError");
    }

    if (slug === testSlug("unregister")) {
      return mswData("getPost", "RegistrationError");
    }

    if (slug === testSlug("not-allowed")) {
      return mswData("getPost", "NotAllowedError");
    }

    if (slug === testSlug("validation-error")) {
      return mswData("getPost", "GetPostValidationError", {
        slugError: slugMsg,
      });
    }

    if (slug === testSlug("get-post-warning")) {
      return mswData("getPost", "GetPostWarning", { message: warningMsg });
    }

    if (slug === testSlug("blog-post")) {
      return mswData("getPost", "SinglePost", { post });
    }

    if (slug === testSlug("unsupported")) {
      return mswData("getPost", "UnsupportedType");
    }

    if (slug === testSlug("graphql")) {
      return mswErrors(new GraphQLError(gqlMsg));
    }

    if (slug === testSlug("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    return mswErrors(new Error(), { status: 400 });
  })
);

const mock = <T extends string | undefined = undefined>(
  prefix: string,
  message: T
) => ({ slug: testSlug(prefix), message });

export const get = mock("blog-post", undefined);
const auth = mock("auth", undefined);
const unregister = mock("unregister", undefined);
const notAllowed = mock("not-allowed", undefined);
const validate = mock("validation-error", slugMsg);
const warn = mock("get-post-warning", warningMsg);
const unsupported = mock("unsupported", MESSAGE);
const network = mock("network", MESSAGE);
const gql = mock("graphql", gqlMsg);

interface Redirects {
  asPath: string;
  url: { pathname: string; query: Record<string, string> };
}

export const redirects: [string, string, Redirects][] = [
  [
    "The user is not logged in, Expect a redirect to the login page",
    auth.slug,
    ((asPath: string) => ({
      asPath,
      url: {
        pathname: "/login",
        query: { status: "unauthenticated", redirectTo: asPath },
      },
    }))(`/posts/view/${auth.slug}`),
  ],
  [
    "The logged in user could not be verified, Expect a redirect to the login page",
    notAllowed.slug,
    ((asPath: string) => ({
      asPath,
      url: { pathname: "/login", query: { status: "unauthorized" } },
    }))(`/posts/view/${notAllowed.slug}`),
  ],
  [
    "The user's account is unregistered, Expect a redirect to the user registration page",
    unregister.slug,
    ((asPath: string) => ({
      asPath,
      url: {
        pathname: "/register",
        query: { status: "unregistered", redirectTo: asPath },
      },
    }))(`/posts/view/${unregister.slug}`),
  ],
];

export const alerts: [string, string, ReturnType<typeof mock<string>>][] = [
  [
    "The API request failed with a network error, Expect a status message notification",
    `/posts/view/${network.slug}`,
    network,
  ],
  [
    "The API throws a graphql error response, Expect a status message notification",
    `/posts/view/${gql.slug}`,
    gql,
  ],
  [
    "The API responded with an unsupported object type, Expect a status message notification",
    `/posts/view/${unsupported.slug}`,
    unsupported,
  ],
  [
    "The API responded with a slug input validation error, Expect a status message notification",
    `/posts/view/${validate.slug}`,
    validate,
  ],
  [
    "The blog post could not be found, Expect a status message notification",
    `/posts/view/${warn.slug}`,
    warn,
  ],
];
