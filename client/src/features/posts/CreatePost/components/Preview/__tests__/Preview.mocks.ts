import { GraphQLError } from "graphql";
import { delay, graphql, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { Cache } from "@apollo/client/cache/core/types/Cache";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { CREATE_POST } from "@mutations/createPost/CREATE_POST";
import { mswData, mswErrors } from "@utils/tests/msw";
import { testPostTag } from "@utils/tests/testPostTag";
import type { GetPostTagsData } from "types/postTags/getPostTags";
import type {
  CreateInputErrors,
  CreateStatus,
  PostImageBanner,
} from "types/posts/createPost";

const titleStr = (prefix: string) => `${prefix} Test Post Title`;
const tagNames = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5"];
const tags = tagNames.map((tag, idx) => testPostTag(tag, `id-${idx + 1}`));
const duplicateMsg = "Post title already exists";
const forbidMsg = "Generated post slug from post title already exists. Change!";
const gqlMsg = "Graphql server error ocurred";
export const excerptMsg = "Post excerpt can not be more than 300 characters";
export const contentMsg = "Provide post content";
export const tagsMsg = "Invalid post tag id provided";
export const imageBannerMsg = "Image banner string cannot be empty";
export const html = "<h2>Heading 2</h2><p>paragraph</p>";
export const postInfo = { name: /^post information$/i };
export const postTags = { name: /^post tags$/i };
export const postImg = { name: /^post title image banner$/i };
export const postContent = { name: /^post content$/i };
export const draftErrors = { name: /^draft post errors$/i };
export const createErrors = { name: /^publish post errors$/i };
export const closeDraft = { name: /^close draft post errors list$/i };
export const closeCreate = { name: /^close publish post errors list$/i };
export const draftBtn = { name: /^save as draft$/i };
export const previewMenu = { name: /^post preview actions menu$/i };
export const menuCreate = { name: /^publish post$/i };
export const menuDraft = { name: /^save post as draft$/i };
export const dialog = { name: /^publish blog post$/i };
export const cancel = { name: /^cancel$/i };
export const create = { name: /^publish post$/i };
export const publish = { name: /^publish$/i };
export const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
export const blobUrl = window.URL.createObjectURL(file);

export const descriptionMsg =
  "Post description can not be more than 255 characters";

const CREATE_MESSAGE =
  "You are unable to create and publish this post at the moment. Please try again later";

export interface Props {
  title: string;
  tagIds?: string[];
  imageBanner?: PostImageBanner;
  draftStatus: CreateStatus;
  draftErrors: CreateInputErrors;
}

export const props: Props = {
  title: "Post Title",
  draftErrors: {},
  draftStatus: "idle",
};

export const previewProps: Props = {
  ...props,
  tagIds: ["id-1", "id-2", "id-4", "id-5"],
  imageBanner: { file, blobUrl },
};

export const draftErrorsProps: Props = {
  ...props,
  draftStatus: "inputError",
  draftErrors: {
    titleError: "Post title error",
    descriptionError: "Post description error",
    excerptError: "Post excerpt error",
    contentError: "Post content error",
    tagIdsError: "Post tags error",
    imageBannerError: "Post image banner error",
  },
};

export const createProps = (title: string): Props => ({ ...props, title });

export const savedProps = (title: string): Props => ({
  ...props,
  title,
  imageBanner: { file, blobUrl },
});

export const server = setupServer(
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
      pathname: "/settings/edit/me",
      url: {
        pathname: "/login",
        query: { status: "unauthenticated", redirectTo: "/settings/edit/me" },
      },
    },
  ],
  [
    "The logged in user could not be verified, Expect a redirect to the login page",
    notAllowed.title,
    {
      pathname: "/",
      url: { pathname: "/login", query: { status: "unauthorized" } },
    },
  ],
  [
    "The user's account is unregistered, Expect a redirect to the registration page",
    unregister.title,
    {
      pathname: "/post-tags",
      url: {
        pathname: "/register",
        query: { status: "unregistered", redirectTo: "/post-tags" },
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
      url: {
        pathname: "/posts/view/[slug]",
        query: { slug: "post-url-slug", create: false },
      },
    },
  ],
  [
    "Image banner upload failed, The new blog post should be created and published without an image banner",
    {
      mock: savedPost,
      resolver: () => HttpResponse.error(),
      url: {
        pathname: "/posts/view/[slug]",
        query: { slug: "post-url-slug", create: true },
      },
    },
  ],
];

export const writeTags: Cache.WriteQueryOptions<GetPostTagsData, object> = {
  query: GET_POST_TAGS,
  data: { getPostTags: { __typename: "PostTags", tags, status: "SUCCESS" } },
};
