import { GraphQLError } from "graphql";
import { delay, graphql } from "msw";
import { setupServer } from "msw/node";
import type { Cache } from "@apollo/client/cache/core/types/Cache";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { GET_POST_TO_EDIT } from "@queries/getPostToEdit/GET_POST_TO_EDIT";
import { mswData, mswErrors } from "@utils/tests/msw";
import { testPostTag } from "@utils/tests/testPostTag";
import type { PostData } from "types/posts";
import type { GetPostToEditData } from "types/posts/editPost";

export const load = { name: /^loading edit blog post page$/i };
export const article = { name: /^edit blog post$/i };

const slugMsg = "Invalid slug format provided";
const warningMsg = "Blog post not found";
const gqlMsg = "Graphql server error occurred";
const MESSAGE = `You are unable to view this post at the moment. Please try again later`;
const postTags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6"];
const testSlug = (prefix: string) => `${prefix}-test-post-slug`;
export const postSlug = testSlug("blog-post");
export const html = "<section>Edit Post Page Component</section>";

const postTagIds = [
  "fc2f2351-80c7-4e4c-b462-11b3512f1293",
  "377fba48-d9e3-4b06-aab6-0b29e2c98413",
  "a2ee44f1-323c-41aa-addd-5fca6f3cc309",
  "3240e4d2-f157-4991-90b2-a7795d75b01f",
  "4589dc3b-eb31-4d53-a34f-d75e14288b59",
  "c11cb682-8a2d-46b8-99d5-8ba33c450ed9",
];

const tags = postTags.map((items, index) => {
  return testPostTag(items, postTagIds[index]);
});

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
    image: "author_image_url_string",
  },
  status: "Draft",
  url: {
    __typename: "PostUrl",
    href: `https://link.com/${postSlug}`,
    slug: postSlug,
  },
  imageBanner: "https://stroage.com/image.jpg",
  dateCreated: new Date().toISOString(),
  datePublished: null,
  lastModified: null,
  isBinned: false,
  binnedAt: null,
  views: 0,
  tags: null,
};

export const writePost: Cache.WriteQueryOptions<GetPostToEditData, object> = {
  query: GET_POST_TO_EDIT,
  data: { getPost: { __typename: "SinglePost", post } },
};

export const server = setupServer(
  graphql.query(GET_POST_TAGS, async () => {
    await delay();
    return mswData("getPostTags", "PostTags", { tags });
  }),

  graphql.query(GET_POST_TO_EDIT, async ({ variables: { slug } }) => {
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
      return mswData("getPost", "UnknownError", { message: warningMsg });
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
    }))(`/posts/edit/${auth.slug}`),
  ],
  [
    "The logged in user could not be verified, Expect a redirect to the login page",
    notAllowed.slug,
    ((asPath: string) => ({
      asPath,
      url: { pathname: "/login", query: { status: "unauthorized" } },
    }))(`/posts/edit/${notAllowed.slug}`),
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
    }))(`/posts/edit/${unregister.slug}`),
  ],
];

export const alerts: [string, string, ReturnType<typeof mock<string>>][] = [
  [
    "The API request failed with a network error, Expect a status message notification",
    `/posts/edit/${network.slug}`,
    network,
  ],
  [
    "The API throws a graphql error response, Expect a status message notification",
    `/posts/edit/${gql.slug}`,
    gql,
  ],
  [
    "The API responded with an unsupported object type, Expect a status message notification",
    `/posts/edit/${unsupported.slug}`,
    unsupported,
  ],
  [
    "The API responded with a slug input validation error, Expect a status message notification",
    `/posts/edit/${validate.slug}`,
    validate,
  ],
  [
    "The blog post could not be found, Expect a status message notification",
    `/posts/edit/${warn.slug}`,
    warn,
  ],
];
