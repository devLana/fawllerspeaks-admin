import { randomUUID } from "node:crypto";

import type { InputErrors } from "@types";
import type { CreatePostInput, PostContent } from "@resolverTypes";

type Validations = [string, CreatePostInput, InputErrors<CreatePostInput>][];

const TAG_ID = randomUUID();
export const UUID = randomUUID();
export const tagIds = [TAG_ID, UUID, randomUUID()];
export const dateCreated = "2021-05-17 13:22:43.717+01";
export const tags = ["tag", "tag", "tag"];
export const url1 = { slug: "blog-post-title", href: "blog-post-title" };
const slug = "another-blog-post-title";
export const url2 = { href: "another-blog-post-title", slug };

export const user = {
  isRegistered: true,
  authorName: "Author Name",
  authorImage: "/author/image/path",
};

export const author = { name: user.authorName, image: user.authorImage };

export const validations = (nullOrUndefined?: null): Validations => [
  [
    "Should return validation errors for empty input strings",
    {
      title: "",
      description: "",
      excerpt: "",
      content: "",
      tagIds: ["", ""],
      imageBanner: "",
    },
    {
      titleError: "Provide post title",
      descriptionError: "Provide post description",
      excerptError: "Provide post excerpt",
      contentError: "Provide post content",
      tagIdsError: "Input post tag ids cannot be empty values",
      imageBannerError: "Post image banner url cannot be empty",
    },
  ],
  [
    "Should return validation errors for empty whitespace input strings",
    {
      title: "  ",
      description: " ",
      excerpt: " ",
      content: "    ",
      tagIds: ["   ", "     "],
      imageBanner: "  ",
    },
    {
      titleError: "Provide post title",
      descriptionError: "Provide post description",
      excerptError: "Provide post excerpt",
      contentError: "Provide post content",
      tagIdsError: "Input post tag ids cannot be empty values",
      imageBannerError: "Post image banner url cannot be empty",
    },
  ],
  [
    "Should return a post tags input validation error if the post tags array is empty",
    {
      title: "title",
      description: "description",
      excerpt: "excerpt",
      content: "content",
      tagIds: [],
      imageBanner: null,
    },
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
    "Should return a post tags input validation error if duplicate post tag ids were provided",
    {
      title: "title",
      description: "description",
      excerpt: "excerpt",
      content: "content",
      tagIds: [TAG_ID, TAG_ID],
    },
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
    "Should return a post tags input validation error if an invalid post tag id was provided",
    {
      title: "title",
      description: "description",
      excerpt: "excerpt",
      content: "content",
      tagIds: [TAG_ID, "tagId"],
      imageBanner: null,
    },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      excerptError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagIdsError: "Invalid post tag id provided",
      imageBannerError: nullOrUndefined,
    },
  ],
  [
    "Should return a post tags input validation error if more than 5 post tag ids were provided",
    {
      title: "title",
      description: "description",
      excerpt: "excerpt",
      content: "content",
      tagIds: [...tagIds, randomUUID(), randomUUID(), randomUUID()],
    },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      excerptError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagIdsError: "Cannot add more than 5 post tags to a new post",
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
      content: "<p>post html content</p>",
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

export const dbPost = {
  id: "1",
  dateCreated,
  datePublished: dateCreated,
  lastModified: null,
  views: 0,
  isInBin: false,
  isDeleted: false,
};

export const imageBanner = "post/image/banner";
const mockData = { description: "post description", excerpt: "mock excerpt" };

export const argsWithImage = {
  ...mockData,
  title: "blog post title",
  content:
    '<p>post content</p><hr /><a id="link" href="google.com">google link</a><p></p><p><br/><br/><br/></p><p>hello world</p><p><img src="src" /></p>',
  imageBanner,
};

export const postContentWithImage: PostContent = {
  __typename: "PostContent",
  html: '<p>post content</p><hr><a href="https://google.com" target="_blank" rel="noopener noreferrer">google link</a><p>hello world</p><p><img src="src"></p>',
  tableOfContents: null,
};

export const argsWithNoImage = {
  ...mockData,
  title: "another blog post title",
  content:
    '<h2>Opening Heading</h2><p>post content</p><a id="link" href="/blog/post-one-title">Post One Link</a><h4>Closing Heading.</h4><p>Closing Paragraph</p>',
  imageBanner: null,
};

export const postContentWithNoImage: PostContent = {
  __typename: "PostContent",
  html: '<h2 id="opening-heading">Opening Heading</h2><p>post content</p><a href="/blog/post-one-title">Post One Link</a><h4 id="closing-heading">Closing Heading.</h4><p>Closing Paragraph</p>',
  tableOfContents: [
    {
      __typename: "PostTableOfContents",
      heading: "Opening Heading",
      level: 2,
      href: "#opening-heading",
    },
    {
      __typename: "PostTableOfContents",
      heading: "Closing Heading.",
      level: 4,
      href: "#closing-heading",
    },
  ],
};

export const verifyUser: [string, object[]][] = [
  ["Should return an error object if the user is unknown", []],
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
