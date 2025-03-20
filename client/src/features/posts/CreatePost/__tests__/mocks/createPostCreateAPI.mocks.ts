import { GraphQLError } from "graphql";
import { delay, graphql, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { CREATE_POST } from "@mutations/createPost/CREATE_POST";
import { mswData, mswErrors } from "@utils/tests/msw";
import { testPostTag } from "@utils/tests/testPostTag";

export const image = /^Select A Post Image Banner$/i;
export const postTag = { name: /^post tags$/i };
export const titleBox = { name: /^post title$/i };
export const descBox = { name: /^post description$/i };
export const extBox = { name: /^post excerpt$/i };
export const contBox = { name: /^editor editing area/i };
export const metadataNext = { name: /^proceed to post content$/i };
export const contentNext = { name: /^preview post$/i };
export const previewMenu = { name: /^post preview actions menu$/i };
export const pubPost = { name: /^publish post$/i };
export const dialog = { name: /^publish blog post$/i };
export const pub = { name: /^publish$/i };
export const cancel = { name: /^cancel$/i };
export const errors = { name: /^input validation errors$/i };
export const hideErrorsBtn = { name: /^hide input validation errors alert$/i };

const postTags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6"];

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

const titleStr = (prefix: string) => `${prefix} Test Post Title`;

export const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
export const html = "<h2>Heading 2</h2><p>paragraph</p>";
export const excerptMsg = "Post excerpt can not be more than 300 characters";
export const contentMsg = "Provide post content";
export const tagsMsg = "Invalid post tag id provided";
export const imageBannerMsg = "Image banner string cannot be empty";
export const descriptionMsg = `Post description can not be more than 255 characters`;
const duplicateMsg = "Post title already exists";
const forbidMsg = "Generated post slug from post title already exists. Change!";
const gqlMsg = "Graphql server error occurred";
const CREATE_MESSAGE = `You are unable to create and publish this post at the moment. Please try again later`;

export const server = setupServer(
  graphql.query(GET_POST_TAGS, async () => {
    await delay();
    return mswData("getPostTags", "PostTags", { tags });
  }),

  graphql.mutation(CREATE_POST, async ({ variables: { post } }) => {
    await delay(50);

    if (post.title === titleStr("auth")) {
      return mswData("createPost", "AuthenticationError");
    }

    if (post.title === titleStr("unregister")) {
      return mswData("createPost", "RegistrationError");
    }

    if (post.title === titleStr("not allowed")) {
      return mswData("createPost", "NotAllowedError");
    }

    if (post.title === titleStr("duplicate")) {
      return mswData("createPost", "DuplicatePostTitleError", {
        message: duplicateMsg,
      });
    }

    if (post.title === titleStr("forbid")) {
      return mswData("createPost", "ForbiddenError", {
        message: forbidMsg,
      });
    }

    if (post.title === titleStr("validate")) {
      return mswData("createPost", "PostValidationError", {
        titleError: null,
        descriptionError: descriptionMsg,
        excerptError: excerptMsg,
        contentError: contentMsg,
        tagIdsError: tagsMsg,
        imageBannerError: imageBannerMsg,
      });
    }

    if (post.title === titleStr("saved"))
      return mswData("createPost", "SinglePost", {
        post: {
          __typename: "Post",
          id: "1",
          title: titleStr("saved"),
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
            slug: "post-url-slug",
          },
          imageBanner: "image_banner_string",
          dateCreated: new Date().toISOString(),
          datePublished: null,
          lastModified: null,
          views: 0,
          isInBin: false,
          isDeleted: false,
          tags: null,
        },
      });

    if (post.title === titleStr("unsupported")) {
      return mswData("createPost", "UnsupportedType");
    }

    if (post.title === titleStr("graphql")) {
      return mswErrors(new GraphQLError(gqlMsg));
    }

    if (post.title === titleStr("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    return mswErrors(new Error(), { status: 400 });
  })
);

const mock = <T extends string | undefined = undefined>(
  prefix: string,
  message: T
) => ({ title: titleStr(prefix), message });

export const validate = mock("validate", undefined);
const savedPost = mock("saved", undefined);
const auth = mock("auth", undefined);
const unregister = mock("unregister", undefined);
const notAllowed = mock("not allowed", undefined);
const duplicate = mock("duplicate", duplicateMsg);
const forbid = mock("forbid", forbidMsg);
const unsupported = mock("unsupported", CREATE_MESSAGE);
const network = mock("network", CREATE_MESSAGE);
const gql = mock("graphql", gqlMsg);

interface Redirects {
  pathname: string;
  url: { pathname: string; query: Record<string, string> };
}

export const redirects: [string, string, Redirects][] = [
  [
    "The user is not logged in, Expect a redirect to the login page",
    auth.title,
    {
      pathname: "/posts/new",
      url: {
        pathname: "/login",
        query: { status: "unauthenticated", redirectTo: "/posts/new" },
      },
    },
  ],
  [
    "The logged in user could not be verified, Expect a redirect to the login page",
    notAllowed.title,
    {
      pathname: "/posts/new",
      url: { pathname: "/login", query: { status: "unauthorized" } },
    },
  ],
  [
    "The user's account is unregistered, Expect a redirect to the registration page",
    unregister.title,
    {
      pathname: "/posts/new",
      url: {
        pathname: "/register",
        query: { status: "unregistered", redirectTo: "/posts/new" },
      },
    },
  ],
];

const str = "Expect an alert error message notification";
export const alerts: [string, ReturnType<typeof mock<string>>][] = [
  [`The API request failed with a network error, ${str}`, network],
  [`The API throws a graphql error response, ${str}`, gql],
  [`The API responded with an unsupported object type, ${str}`, unsupported],
];

const text = "Expect a post title error alert message";
export const verifyTitle: [string, ReturnType<typeof mock<string>>][] = [
  [`The provided post title already exists, ${text}`, duplicate],
  [
    `The post url slug generated from the provided post title already exists, ${text}`,
    forbid,
  ],
];

interface CreateMock {
  mock: ReturnType<typeof mock>;
  url: { pathname: string; query: Record<string, string | boolean> };
  resolver: () => Response;
}

export const created: [string, CreateMock][] = [
  [
    "Image banner uploaded, The new blog post should be created and published",
    {
      mock: savedPost,
      resolver() {
        return HttpResponse.json(
          { image: "path/to/image/on/storage", status: "SUCCESS" },
          { status: 201 }
        );
      },
      url: { pathname: "/posts/view/post-url-slug", query: { create: false } },
    },
  ],
  [
    "Image banner upload failed, The new blog post should be created and published without an image banner",
    {
      mock: savedPost,
      resolver: () => HttpResponse.error(),
      url: { pathname: "/posts/view/post-url-slug", query: { create: true } },
    },
  ],
];
