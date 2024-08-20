import { GraphQLError } from "graphql";
import { delay, graphql, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { DRAFT_POST } from "../operations/DRAFT_POST";
import { CREATE_POST } from "../components/CreatePostPreview/operations/CREATE_POST";
import { mswData, mswErrors } from "@utils/tests/msw";
import { testPostTag } from "@features/postTags/utils/testPostTag";

interface Redirects {
  pathname: string;
  url: string;
}

const titleStr = (prefix: string) => `${prefix} Test Post Title`;
const duplicateMsg = "Post title already exists";
const forbidMsg = "Generated post slug from post title already exists. Change!";
const gqlMsg = "Graphql server error ocurred";
export const draftBtn = { name: /^save as draft$/i };
export const imageLabel = /^Select A Post Image Banner$/i;
export const titleLabel = { name: /^post title$/i };
export const description = { name: /^post description$/i };
export const content = { name: /^editor editing area/i };
export const excerpt = { name: /^post excerpt$/i };
export const postTag = { name: /^post tags$/i };
export const metadataNext = { name: /^proceed to post content$/i };
export const contentNext = { name: /^preview post$/i };
export const previewBtn = { name: /^create post$/i };
export const metadataRegion = { name: /^provide post metadata$/i };
export const contentRegion = { name: /^provide post content$/i };
export const previewRegion = { name: /^preview blog post$/i };
export const previewMenuBtn = { name: /^post preview actions menu$/i };
export const previewMenu = { name: /^post preview actions menu$/i };
export const createMenuItem = { name: /^create post$/i };
export const draftMenuItem = { name: /^save post as draft$/i };
export const draftValidationErrors = { name: /^draft post errors$/i };
export const createValidationErrors = { name: /^create post errors$/i };
export const dialog = { name: /^Create blog post$/i };
export const dialogCancel = { name: /^cancel$/i };
export const dialogCreate = { name: /^create post$/i };
export const titleMsg = "Post title can not be more than 255 characters";
export const excerptMsg = "Post excerpt can not be more than 300 characters";
export const contentMsg = "Provide post content";
export const tagsMsg = "Invalid post tag id provided";
export const imageBannerMsg = "Image banner string cannot be empty";
export const html = "<h2>Heading 2</h2><p>paragraph</p>";

export const descriptionMsg =
  "Post description can not be more than 255 characters";

const DRAFT_MESSAGE =
  "You are unable to save this post as draft at the moment. Please try again later";

const CREATE_MESSAGE =
  "You are unable to create and publish this post at the moment. Please try again later";

export const longText =
  "256 characters max 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters";

export const longerText =
  "300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max";

export const postTagsErrorMsg =
  "You can't add post tags to this post at the moment. Please try again later";

const tags = [
  testPostTag("Tag 1", "1"),
  testPostTag("Tag 2", "2"),
  testPostTag("Tag 3", "3"),
];

const resolver = (field: "draftPost" | "createPost", title: string) => {
  if (title === titleStr("auth")) {
    return mswData(field, "AuthenticationError");
  }

  if (title === titleStr("unregister")) {
    return mswData(field, "RegistrationError");
  }

  if (title === titleStr("not allowed")) {
    return mswData(field, "NotAllowedError");
  }

  if (title === titleStr("duplicate")) {
    return mswData(field, "DuplicatePostTitleError", {
      message: duplicateMsg,
    });
  }

  if (title === titleStr("forbid")) {
    return mswData(field, "ForbiddenError", {
      message: forbidMsg,
    });
  }

  if (title === titleStr("validate")) {
    return mswData(field, "PostValidationError", {
      titleError: null,
      descriptionError: descriptionMsg,
      excerptError: excerptMsg,
      contentError: contentMsg,
      imageBannerError: imageBannerMsg,
      tagIdsError: tagsMsg,
    });
  }

  if (title === titleStr("saved"))
    return mswData(field, "SinglePost", {
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
          slug: "post url slug",
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

  if (title === titleStr("unsupported")) {
    return mswData(field, "UnsupportedType");
  }

  if (title === titleStr("graphql")) {
    return mswErrors(new GraphQLError(gqlMsg));
  }

  if (title === titleStr("network")) {
    return mswErrors(new Error(), { status: 503 });
  }

  return mswErrors(new Error(), { status: 400 });
};

export const server = setupServer(
  graphql.query("GetPostTags", async () => {
    await delay();
    return mswData("getPostTags", "PostTags", { tags });
  }),

  graphql.mutation(DRAFT_POST, async ({ variables: { post } }) => {
    await delay();
    return resolver("draftPost", post.title);
  }),

  graphql.mutation(CREATE_POST, async ({ variables: { post } }) => {
    await delay();
    return resolver("createPost", post.title);
  })
);

export const getPostTagResolver = () => {
  server.use(
    graphql.query("GetPostTags", async () => {
      await delay();
      return mswData("getPostTags", "UnsupportedType");
    })
  );
};

const mock = <T extends string | undefined = undefined>(
  prefix: string,
  message: T
) => ({ title: titleStr(prefix), message });

const savedPost = mock("saved", undefined);
const auth = mock("auth", undefined);
const unregister = mock("unregister", undefined);
const notAllowed = mock("not allowed", undefined);
export const validate = mock("validate", undefined);
const duplicate = mock("duplicate", duplicateMsg);
const forbid = mock("forbid", forbidMsg);
const draftUnsupported = mock("unsupported", DRAFT_MESSAGE);
const draftNetwork = mock("network", DRAFT_MESSAGE);
const createUnsupported = mock("unsupported", CREATE_MESSAGE);
const createNetwork = mock("network", CREATE_MESSAGE);
const gql = mock("graphql", gqlMsg);

export const longTitleValue: [string, { name: RegExp }][] = [
  [
    "When the title field has a value longer than 255 characters and the user tries to proceed to the post content section, Expect the title input field to have an error message",
    metadataNext,
  ],
  [
    "When the title field has a value longer than 255 characters and the user tries to save the post as draft, Expect the title input field to have an error message",
    draftBtn,
  ],
];

export const longDescriptionValue: [string, { name: RegExp }][] = [
  [
    "When the description field has a value longer than 255 characters and the user tries to proceed to the post content section, Expect the description input field to have an error message",
    metadataNext,
  ],
  [
    "When the description field has a value longer than 255 characters and the user tries to save the post as draft, Expect the description input field to have an error message",
    draftBtn,
  ],
];

export const longExcerptValue: [string, { name: RegExp }][] = [
  [
    "When the excerpt field has a value longer than 300 characters and the user tries to proceed to the post content section, Expect the excerpt input field to have an error message",
    metadataNext,
  ],
  [
    "When the excerpt field has a value longer than 300 characters and the user tries to save the post as draft, Expect the excerpt input field to have an error message",
    draftBtn,
  ],
];

type TitleSlug = [string, ReturnType<typeof mock<string>>][];

export const titleSlug = (isMetadata = false): TitleSlug => {
  const str = isMetadata
    ? "Expect the title input field to have an error message"
    : "Expect an error alert list with a post title error message";

  return [
    [`When the provided post title already exists, ${str}`, duplicate],
    [
      `When the post url slug generated from the provided post title already exists, ${str}`,
      forbid,
    ],
  ];
};

const str = "Should display an alert error message";
export const draftAlerts: [string, ReturnType<typeof mock<string>>][] = [
  [`When the API response is a network error, ${str}`, draftNetwork],
  [`When the API throws a graphql error, ${str}`, gql],
  [
    `When the API responds with an unsupported object type, ${str}`,
    draftUnsupported,
  ],
];

export const createAlerts: [string, ReturnType<typeof mock<string>>][] = [
  [`When the API response is a network error, ${str}`, createNetwork],
  [`When the API throws a graphql error, ${str}`, gql],
  [
    `When the API responds with an unsupported object type, ${str}`,
    createUnsupported,
  ],
];

export const redirects: [string, string, Redirects][] = [
  [
    "When the user is not logged in, Should redirect the user to the login page",
    auth.title,
    {
      url: "/login?status=unauthenticated&redirectTo=/settings/edit/me",
      pathname: "/settings/edit/me",
    },
  ],
  [
    "When the logged in user could not be verified, Should redirect the user to the login page",
    notAllowed.title,
    { url: "/login?status=unauthorized", pathname: "/" },
  ],
  [
    "When the user's account is unregistered, Should redirect the user to the registration page",
    unregister.title,
    {
      url: "/register?status=unregistered&redirectTo=/post-tags",
      pathname: "/post-tags",
    },
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

type Saved = [string, DraftMock][];

export const saved = (isCreate = false): Saved => {
  const title1 = isCreate
    ? "Should create and publish the new blog post with an image"
    : "Should save the new post along with an image file string as draft";

  const title2 = isCreate
    ? "Should create and publish the new blog post without an image"
    : "Should save the post as draft without an image";

  const path = `/posts?image=${isCreate ? "create" : "draft"}-upload-error`;

  return [
    [
      `When the image banner upload succeeds, ${title1}`,
      { mock: savedPost, resolver: cb1, path: "/posts" },
    ],
    [
      `When the image banner upload fails, ${title2}`,
      { mock: savedPost, resolver: cb2, path },
    ],
  ];
};
