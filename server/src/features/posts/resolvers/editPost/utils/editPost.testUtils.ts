import { randomUUID } from "node:crypto";

import type { InputErrors } from "@types";
import type { EditPostInput, PostContent, PostStatus } from "@resolverTypes";

const UUID = randomUUID();
const name = "Author Name";
const tagIds = [UUID, randomUUID(), randomUUID()];
const dateCreated = "2021-05-17 13:22:43.717+01";
const lastModified = "2023-02-14 20:18:59.953+01";
export const imageBanner = "path/to/post/image/banner.png";
export const url = { slug: "blog-post-title", href: "blog-post-title" };

export const content =
  '<h2 class="heading">heading element</h2><hr /><a href="blog/post/title">blog post link</a><p id="class-name">paragraph text <a href="//weird-link">weird link</a></p><p><img src="src" /></p>';

export const html =
  '<h2>heading element</h2><hr><a href="blog/post/title">blog post link</a><p>paragraph text <a href="https://weird-link" target="_blank" rel="noopener noreferrer">weird link</a></p><p><img src="src"></p>';

export const expectedPostContent: PostContent = {
  __typename: "PostContent",
  html: '<h2 id="heading-element">heading element</h2><hr><a href="blog/post/title">blog post link</a><p>paragraph text <a href="https://weird-link" target="_blank" rel="noopener noreferrer">weird link</a></p><p><img src="src"></p>',
  tableOfContents: [
    {
      __typename: "PostTableOfContents",
      heading: "heading element",
      level: 2,
      href: "#heading-element",
    },
  ],
};

const input: EditPostInput = {
  id: UUID,
  title: "Blog Post Title",
  description: "post description",
  excerpt: "post excerpt",
};

export const post: EditPostInput = { ...input, content: "post content" };

export const user = {
  isRegistered: true,
  userName: name,
  userImage: "/path/to/user/image/avatar.jpg",
};

export const author = { name: user.userName, image: user.userImage };

type Validations = [string, EditPostInput, InputErrors<EditPostInput>];

export const validations = (nullOrUndefined?: null): Validations[] => [
  [
    "Should return a validation error response for empty input values",
    {
      id: "",
      title: "",
      description: "",
      excerpt: "",
      content: "",
      tagIds: ["", ""],
      imageBanner: "",
      editStatus: false,
    },
    {
      idError: "Provide post id",
      titleError: "Provide post title",
      descriptionError: "Provide post description",
      excerptError: "Provide post excerpt",
      contentError: "Provide post content",
      tagIdsError: "Input post tag ids cannot be empty values",
      imageBannerError: "Post image banner url cannot be empty",
      editStatusError: nullOrUndefined,
    },
  ],
  [
    "Should return a validation error response for empty whitespace input strings",
    {
      id: "  ",
      title: "  ",
      description: " ",
      excerpt: " ",
      content: "    ",
      tagIds: ["   ", "     "],
      imageBanner: "  ",
    },
    {
      idError: "Provide post id",
      titleError: "Provide post title",
      descriptionError: "Provide post description",
      excerptError: "Provide post excerpt",
      contentError: "Provide post content",
      tagIdsError: "Input post tag ids cannot be empty values",
      imageBannerError: "Post image banner url cannot be empty",
      editStatusError: nullOrUndefined,
    },
  ],
  [
    "Should return a post id input validation error if an invalid post id is provided",
    { id: "invalid-id", title: "title", content: null, editStatus: true },
    {
      idError: "Invalid post id",
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      excerptError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagIdsError: nullOrUndefined,
      imageBannerError: nullOrUndefined,
      editStatusError: nullOrUndefined,
    },
  ],
  [
    "Should return a post tags input validation error if the post tags input array is empty",
    {
      id: UUID,
      title: "title",
      tagIds: [],
      description: null,
      excerpt: null,
    },
    {
      idError: nullOrUndefined,
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      excerptError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagIdsError: "No post tag id was provided",
      imageBannerError: nullOrUndefined,
      editStatusError: nullOrUndefined,
    },
  ],
  [
    "Should return a post tags input validation error if duplicate post tag ids was provided",
    { id: UUID, title: "title", tagIds: [UUID, UUID], imageBanner: null },
    {
      idError: nullOrUndefined,
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      excerptError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagIdsError: "The provided input post tag ids should be unique ids",
      imageBannerError: nullOrUndefined,
      editStatusError: nullOrUndefined,
    },
  ],
  [
    "Should return a post tags input validation error if more than 5 post tag ids were provided",
    {
      id: UUID,
      title: "title",
      content,
      tagIds: [...tagIds, randomUUID(), randomUUID(), randomUUID()],
    },
    {
      idError: nullOrUndefined,
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      excerptError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagIdsError: "Cannot add more than 5 post tags to a post",
      imageBannerError: nullOrUndefined,
      editStatusError: nullOrUndefined,
    },
  ],
  [
    "Should return title, description and excerpt input validation error messages if the values exceed the maximum length",
    {
      id: UUID,
      title:
        "256 characters max 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters",
      description:
        "256 characters max 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters",
      excerpt:
        "300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max",
      content: null,
      tagIds: null,
      imageBanner: null,
      editStatus: null,
    },
    {
      idError: nullOrUndefined,
      titleError: "Post title can not be more than 255 characters",
      descriptionError: "Post description can not be more than 255 characters",
      excerptError: "Post excerpt can not be more than 300 characters",
      contentError: nullOrUndefined,
      tagIdsError: nullOrUndefined,
      imageBannerError: nullOrUndefined,
      editStatusError: nullOrUndefined,
    },
  ],
];

export const verifyUser: [string, object[]][] = [
  ["Should return an error object if the logged in user is unknown", []],
  [
    "Should return an error object if the user is unregistered",
    [{ isRegistered: false }],
  ],
];

type Keys = "content" | "excerpt" | "description";
type Errors = InputErrors<Pick<EditPostInput, Keys>>;

export const metadata: [string, EditPostInput, PostStatus, Errors][] = [
  [
    "Should return an error object if no post metadata is provided for a published post",
    { id: UUID, title: "Post Title", editStatus: true },
    "Unpublished",
    {
      descriptionError: "Provide post description",
      excerptError: "Provide post excerpt",
      contentError: "Provide post content",
    },
  ],
  [
    "Should return an error object if no post metadata is provided for an unpublished post",
    { id: UUID, title: "Post Title" },
    "Published",
    {
      descriptionError: "Provide post description",
      excerptError: "Provide post excerpt",
      contentError: "Provide post content",
    },
  ],
];

interface MockData {
  postSlug: string;
  postTitle: string;
  id: string;
}

export const verifyTitleSlug: [string, string, MockData][] = [
  [
    "Should return an error object if the post url slug generated from the provided post title already exists",
    "This blog post's title generates a slug that already exists. Please ensure the provided title is as unique as possible",
    { postSlug: "blog-post-title", postTitle: post.title, id: tagIds[1] },
  ],
  [
    "Should return an error object if the post title already exists",
    `A similar post title already exists - '${post.title}'. Please ensure every post has a unique title`,
    { postSlug: "blog-post-title-1", postTitle: post.title, id: tagIds[2] },
  ],
];

export const mockPost = { postStatus: "Draft", postImageBanner: imageBanner };

const dbPost = {
  id: UUID,
  slug: url.slug,
  title: input.title,
  description: "Blog Post Description",
  excerpt: "Blog Post Excerpt",
  dateCreated,
  lastModified,
  views: 0,
  isBinned: false,
  binnedAt: null,
};

export const post1: EditPostInput = {
  ...input,
  content,
  imageBanner,
  tagIds,
  editStatus: true,
};

export const post2: EditPostInput = {
  ...input,
  content: null,
  editStatus: false,
};

export const mock1 = {
  ...dbPost,
  content: null,
  imageBanner,
  datePublished: dateCreated,
  tags: tagIds,
  status: "Published",
};

export const mock2 = {
  ...dbPost,
  content: html,
  imageBanner: null,
  datePublished: null,
  tags: null,
  status: "Draft",
};
