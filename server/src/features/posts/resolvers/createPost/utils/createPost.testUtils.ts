import { randomUUID } from "node:crypto";

import type { InputErrors } from "@types";
import type { PostContent } from "@resolverTypes";

interface Input {
  title: string;
  description: string;
  excerpt: string;
  content: string;
  tagIds?: string[] | null;
  imageBanner?: string | null;
}

type Validations = [string, Input, InputErrors<Input>][];

const tagId = randomUUID();
export const UUID = randomUUID();

export const validations = (nullOrUndefined?: null): Validations => [
  [
    "Should return validation errors for empty inputs",
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
    "Should return validation errors for empty whitespace inputs",
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
      imageBanner: "post/image/storage/path",
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
      tagIds: [tagId, tagId],
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
      tagIds: [tagId, "tagId"],
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
      titleError:
        "Post title character limit can not be more than 255 characters",
      descriptionError:
        "Post description character limit can not be more than 255 characters",
      excerptError:
        "Post excerpt character limit can not be more than 300 characters",
      contentError: nullOrUndefined,
      tagIdsError: nullOrUndefined,
      imageBannerError: nullOrUndefined,
    },
  ],
];

export const gqlValidations: [string, object][] = [
  [
    "Should throw a graphql validation error for null and undefined inputs",
    {
      title: null,
      description: undefined,
      excerpt: undefined,
      content: null,
      tagIds: undefined,
      imageBanner: undefined,
    },
  ],
  [
    "Should throw a graphql validation error for boolean and number inputs",
    {
      title: false,
      description: 34646,
      excerpt: 34646,
      content: true,
      tagIds: [9877, true],
      imageBanner: 21314,
    },
  ],
];

export const dateCreated = "2021-05-17 13:22:43.717+01";

export const dbPost = {
  id: "1",
  postId: "generated_post_id",
  dateCreated,
  datePublished: dateCreated,
  lastModified: null,
  views: 0,
  isInBin: false,
  isDeleted: false,
};

export const tagIds = [UUID, tagId, randomUUID()];
export const imageBanner = "post/image/banner";
const mockData = { description: "post description", excerpt: "mock excerpt" };

export const argsWithImage = {
  ...mockData,
  title: "blog post title",
  content: '<p>post content</p><a id="link" href="google.com">google link</a>',
  imageBanner,
};

export const postContentWithImage: PostContent = {
  __typename: "PostContent",
  html: '<p>post content</p><a href="https://google.com" target="_blank" rel="noopener noreferrer">google link</a>',
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
    "The generated url slug for the provided post title already exists. Please ensure every post has a unique title",
    { slug: "another-blog-post-title" },
  ],
  [
    "Should return an error object if the post title already exists",
    "A post with that title has already been created",
    {},
  ],
];
