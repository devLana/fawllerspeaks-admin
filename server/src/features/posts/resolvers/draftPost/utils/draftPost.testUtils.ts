import { randomUUID } from "node:crypto";

import type { InputErrors } from "@types";
import type { DraftPostInput, PostContent } from "@resolverTypes";

type Validations = [string, DraftPostInput, InputErrors<DraftPostInput>];

export const USER_ID = randomUUID();
export const UUID = randomUUID();
export const dateCreated = "2021-05-17 13:22:43.717+01";
export const imageBanner = "post/image/banner";
export const tagIds = [UUID, USER_ID, randomUUID()];
export const tags = [{ id: tagIds[0] }, { id: tagIds[1] }, { id: tagIds[2] }];
export const url1 = { slug: "blog-post-title", href: "blog-post-title" };

export const url2 = {
  href: "another-blog-post-title",
  slug: "another-blog-post-title",
};

export const user = {
  userId: 44,
  isRegistered: true,
  authorName: "Author Name",
  authorImage: "/author/image/path",
};

export const author = { name: user.authorName, image: user.authorImage };

const content =
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

export const argsWithImage = { title: "Blog Post Title", imageBanner };

export const argsWithNoImage = {
  title: "Another Blog Post Title",
  content,
  imageBanner: null,
};

export const dbData = {
  id: "id-2",
  dateCreated,
  datePublished: null,
  lastModified: null,
  views: 0,
  isInBin: false,
  isDeleted: false,
  status: "Draft",
};

export const dbPostWithImage = {
  ...dbData,
  slug: url1.slug,
  title: argsWithImage.title,
  description: null,
  excerpt: null,
  content: null,
  imageBanner: argsWithImage.imageBanner,
  tags,
};

export const dbPostWithNoImage = {
  ...dbData,
  slug: url2.slug,
  title: argsWithNoImage.title,
  description: null,
  excerpt: null,
  content: html,
  imageBanner: null,
  tags: null,
};

export const validations = (nullOrUndefined?: null): Validations[] => [
  [
    "Should return a validation error response for empty input strings",
    {
      title: "",
      description: "",
      excerpt: "",
      content: "",
      tagIds: ["", ""],
      imageBanner: "",
    },
    {
      titleError: "A title is required to save this post to draft",
      descriptionError: "Provide post description",
      excerptError: "Provide post excerpt",
      contentError: "Provide post content",
      tagIdsError: "Input post tag ids cannot be empty values",
      imageBannerError: "Post image banner url cannot be empty",
    },
  ],
  [
    "Should return a validation error response for empty whitespace input strings",
    {
      title: "  ",
      description: " ",
      excerpt: " ",
      content: "    ",
      tagIds: ["   ", "     "],
      imageBanner: "  ",
    },
    {
      titleError: "A title is required to save this post to draft",
      descriptionError: "Provide post description",
      excerptError: "Provide post excerpt",
      contentError: "Provide post content",
      tagIdsError: "Input post tag ids cannot be empty values",
      imageBannerError: "Post image banner url cannot be empty",
    },
  ],
  [
    "Should return a post tags input validation error if the post tags input array is empty",
    { title: "title", tagIds: [], description: null, excerpt: null },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      excerptError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagIdsError: "No post tag id was provided",
      imageBannerError: nullOrUndefined,
    },
  ],
  [
    "Should return a post tags input validation error if duplicate post tag ids was provided",
    { title: "title", tagIds: [UUID, UUID], imageBanner: null },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      excerptError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagIdsError: "The provided input post tag ids should be unique ids",
      imageBannerError: nullOrUndefined,
    },
  ],
  [
    "Should return a post tags input validation error if more than 5 post tag ids were provided",
    {
      title: "title",
      tagIds: [...tagIds, randomUUID(), randomUUID(), randomUUID()],
    },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      excerptError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagIdsError: "Cannot add more than 5 post tags to a new draft post",
      imageBannerError: nullOrUndefined,
    },
  ],
  [
    "Should return title, description and excerpt input validation error messages if the values exceed the maximum length",
    {
      title:
        "256 characters max 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters",
      description:
        "256 characters max 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters 256 characters",
      excerpt:
        "300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max 300 characters max",
      content: null,
      tagIds: null,
      imageBanner: null,
    },
    {
      titleError: "Post title can not be more than 255 characters",
      descriptionError: "Post description can not be more than 255 characters",
      excerptError: "Post excerpt can not be more than 300 characters",
      contentError: nullOrUndefined,
      tagIdsError: nullOrUndefined,
      imageBannerError: nullOrUndefined,
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

export const verifyTitleSlug: [string, string, object][] = [
  [
    "Should return an error object if the post url slug generated from the provided post title already exists",
    "It seems this post title generates a slug that already exists. Please ensure the provided title is as unique as possible",
    { slug: "another-blog-post-title", title: argsWithNoImage.title },
  ],
  [
    "Should return an error object if the post title already exists",
    `A similar post title already exists - '${argsWithNoImage.title}'. Please ensure every post has a unique title`,
    { slug: "another-blog-post-title-1", title: argsWithNoImage.title },
  ],
];
