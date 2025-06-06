import { GraphQLError } from "graphql";
import { delay, graphql, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { screen, waitFor } from "@testing-library/react";
import type { Cache } from "@apollo/client/cache/core/types/Cache";
import type { UserEvent } from "@testing-library/user-event";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { EDIT_POST } from "@mutations/editPost/EDIT_POST";
import { mswData, mswErrors } from "@utils/tests/msw";
import { testPostTag } from "@utils/tests/testPostTag";
import type { EditPostProps, PostTagsFetchData } from "types/posts/editPost";
import type { GetPostTagsData } from "types/postTags/getPostTags";

export const contentBox = { name: /^editor editing area/i };
export const metadata = { name: /^edit post metadata$/i };
export const content = { name: /^edit post content$/i };
export const preview = { name: /^preview edited post$/i };
export const previewBtn = { name: /^edit post$/i };
export const previewBack = { name: /^Go back to edit post content section$/i };
export const contentBack = { name: /^Go back to edit post metadata section$/i };
export const dialog = { name: /^edit blog post$/i };
export const cancel = { name: /^cancel$/i };
export const edit = { name: /^edit$/i };
export const errors = { name: /^input validation errors$/i };
export const hideErrorsBtn = { name: /^hide input validation errors alert$/i };
export const image = /^change image$/i;
export const contentNext = { name: /^preview post$/i };
export const metadataNext = { name: /^proceed to post content$/i };
export const loadSavedPost = { name: /^Continue with unfinished post$/i };
export const deleteSavedPost = { name: /^Delete unfinished post$/i };

export const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
const heading = (title: string) => ({ name: new RegExp(title, "i") });
const html = "<h2>Heading 2</h2><p>paragraph</p>";
const postTags = ["Tag 1", "Tag 2", "Tag 3"];

const tagIds = [
  "fc2f2351-80c7-4e4c-b462-11b3512f1293",
  "377fba48-d9e3-4b06-aab6-0b29e2c98413",
  "a2ee44f1-323c-41aa-addd-5fca6f3cc309",
];

const tags = postTags.map((items, index) => testPostTag(items, tagIds[index]));

const postTagsData: PostTagsFetchData = {
  data: { getPostTags: { __typename: "PostTags", tags } },
  error: undefined,
  loading: false,
};

export const writeTags: Cache.WriteQueryOptions<GetPostTagsData, object> = {
  query: GET_POST_TAGS,
  data: { getPostTags: { __typename: "PostTags", tags } },
};

type Props = Omit<EditPostProps, "onRendered">;

export const props: Props = {
  hasRenderedBeforeRef: false,
  id: "edit-post-page",
  postTagsData,
  post: {
    id: "67f14943-2768-4fd9-ae78-fa089bcfbf9e",
    title: "Post Title",
    description: "Post Description",
    excerpt: "Post Excerpt",
    content: { html },
    tags,
    imageBanner: "https://stroage.com/image.jpg",
    url: { slug: "post-title" },
    status: "Published",
  },
};

const testPostId = (prefix: string) => `${prefix}-post-id`;
const dMsg = "The new post title already exists";
const forbidMsg = "Generated post slug from post title already exists. Change!";
const gqlMsg = "Graphql server error occurred";
const msg = `You are unable to edit this post at the moment. Please try again later`;
export const idError = "Invalid post id";
export const titleError = "Enter post title";
export const descriptionError = `Post description can not be more than 255 characters`;
export const excerptError = "Post excerpt can not be more than 300 characters";
export const contentError = "Provide post content";
export const tagIdsError = "Invalid post tag id provided";
export const imageBannerError = "Image banner string cannot be empty";
export const editStatusError = "Invalid edit post status value";

export const server = setupServer(
  graphql.mutation(EDIT_POST, async ({ variables: { post } }) => {
    await delay(50);

    if (post.id === testPostId("auth")) {
      return mswData("editPost", "AuthenticationError");
    }

    if (post.id === testPostId("unregister")) {
      return mswData("editPost", "RegistrationError");
    }

    if (post.id === testPostId("not-allowed")) {
      return mswData("editPost", "NotAllowedError");
    }

    if (post.id === testPostId("duplicate")) {
      return mswData("editPost", "DuplicatePostTitleError", { message: dMsg });
    }

    if (post.id === testPostId("forbid")) {
      return mswData("editPost", "ForbiddenError", { message: forbidMsg });
    }

    if (post.id === testPostId("validate")) {
      return mswData("editPost", "EditPostValidationError", {
        idError,
        titleError,
        descriptionError,
        excerptError,
        contentError,
        tagIdsError,
        imageBannerError,
        editStatusError,
      });
    }

    if (post.id === testPostId("unknown")) {
      return mswData("editPost", "UnknownError");
    }

    if (post.id === testPostId("edited-1")) {
      return mswData("editPost", "SinglePost", {
        post: {
          __typename: "Post",
          id: testPostId("edited-1"),
          title: "Post Title",
          description: "Post Description",
          excerpt: "Post Excerpt",
          content: { __typename: "PostContent", html, tableOfContents: null },
          author: {
            __typename: "PostAuthor",
            name: "First Name",
            image: "https://stroage.com/author.jpg",
          },
          status: "Published",
          url: {
            __typename: "PostUrl",
            href: "https://blog-site.com/post-title",
            slug: "post-title",
          },
          imageBanner: "https://stroage.com/image.jpg",
          dateCreated: new Date().toISOString(),
          datePublished: new Date(Date.now() + 1_000_000_000_000).toISOString(),
          lastModified: new Date(Date.now() + 5_000_000_000_000).toISOString(),
          views: 0,
          isInBin: false,
          isDeleted: false,
          tags,
        },
      });
    }

    if (post.id === testPostId("edited-2")) {
      return mswData("editPost", "SinglePost", {
        post: {
          __typename: "Post",
          id: testPostId("edited-2"),
          title: "New Post Title",
          description: "New Post Description",
          excerpt: "New Post Excerpt",
          content: { __typename: "PostContent", html, tableOfContents: null },
          author: {
            __typename: "PostAuthor",
            name: "First Name",
            image: "https://stroage.com/author.jpg",
          },
          status: "Published",
          url: {
            __typename: "PostUrl",
            href: "https://blog-site.com/post-title",
            slug: "new-post-title",
          },
          imageBanner: "https://stroage.com/image.jpg",
          dateCreated: new Date().toISOString(),
          datePublished: new Date(Date.now() + 1_000_000_000_000).toISOString(),
          lastModified: new Date(Date.now() + 5_000_000_000_000).toISOString(),
          views: 10,
          isInBin: false,
          isDeleted: false,
          tags,
        },
      });
    }

    if (post.id === testPostId("unsupported")) {
      return mswData("editPost", "UnsupportedType");
    }

    if (post.id === testPostId("graphql")) {
      return mswErrors(new GraphQLError(gqlMsg));
    }

    if (post.id === testPostId("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    return mswErrors(new Error(), { status: 400 });
  })
);

const mock = <T extends string | undefined = undefined>(
  prefix: string,
  message: T
) => ({
  props: { ...props, post: { ...props.post, id: testPostId(prefix) } },
  message,
});

export const validate = mock("validate", undefined);
export const unknown = mock("unknown", undefined);
export const edited1 = mock("edited-1", undefined);
export const edited2 = mock("edited-2", undefined);
const auth = mock("auth", undefined);
const unregister = mock("unregister", undefined);
const notAllowed = mock("not-allowed", undefined);
const duplicate = mock("duplicate", dMsg);
const forbid = mock("forbid", forbidMsg);
const unsupported = mock("unsupported", msg);
const network = mock("network", msg);
const gql = mock("graphql", gqlMsg);

interface Redirects {
  asPath: string;
  url: { pathname: string; query: Record<string, string> };
}

export const redirects: [string, Props, Redirects][] = [
  [
    "The user is not logged in, Expect a redirect to the login page",
    auth.props,
    ((asPath: string) => ({
      asPath,
      url: {
        pathname: "/login",
        query: { status: "unauthenticated", redirectTo: asPath },
      },
    }))(`/posts/edit/${auth.props.post.url.slug}`),
  ],
  [
    "The logged in user could not be verified, Expect a redirect to the login page",
    notAllowed.props,
    ((asPath: string) => ({
      asPath,
      url: { pathname: "/login", query: { status: "unauthorized" } },
    }))(`/posts/edit/${auth.props.post.url.slug}`),
  ],
  [
    "The user's account is unregistered, Expect a redirect to the registration page",
    unregister.props,
    ((asPath: string) => ({
      asPath,
      url: {
        pathname: "/register",
        query: { status: "unregistered", redirectTo: asPath },
      },
    }))(`/posts/edit/${auth.props.post.url.slug}`),
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

export const editUpload = (): Response => {
  return HttpResponse.json(
    { image: "path/to/image/on/storage", status: "SUCCESS" },
    { status: 201 }
  );
};

export const editUploadFail = (): Response => HttpResponse.error();

export const setup = async (user: UserEvent, title: string) => {
  await user.click(screen.getByRole("button", metadataNext));

  expect(screen.queryByRole("region", metadata)).not.toBeInTheDocument();
  expect(screen.getByRole("region", content)).toBeInTheDocument();

  await expect(
    screen.findByRole("button", contentNext)
  ).resolves.toBeInTheDocument();

  await user.click(screen.getByRole("button", contentNext));

  expect(screen.queryByRole("region", content)).not.toBeInTheDocument();
  expect(screen.getByRole("region", preview)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByRole("heading", heading(title))).toBeInTheDocument();
  });
};

export const storagePost1 = {
  id: props.post.id,
  slug: "blog-post-slug",
  content: "<p>Paragraph One</p>",
};

export const storagePost2 = {
  ...storagePost1,
  id: "377fba48-d9e3-4b06-aab6-0b29e2c98413",
};

export const storageMsg1 =
  "It seems you have tried editing this post before. Would you like to continue from where you stopped?";

export const storageMsg2 =
  "It seems you have an unfinished post that you tried editing previously. Would you like to finish editing that post instead?";
