import { randomUUID } from "node:crypto";

import type { InputErrors } from "@types";
import type { PostContent } from "@resolverTypes";

interface Input {
  title: string;
  description?: string | null;
  excerpt?: string | null;
  content?: string | null;
  tagIds?: string[] | null;
  imageBanner?: string | null;
}

export type Tags = { id: string }[];
type Validations = [string, Input, InputErrors<Input>];

export const userId = randomUUID();
export const UUID = randomUUID();
export const dateCreated = "2021-05-17 13:22:43.717+01";
export const imageBanner = "post/image/banner";
export const tagIds = [UUID, userId, randomUUID()];

const content =
  '<h2 class="heading">heading element</h2><a href="blog/post/title">blog post link</a><p id="class-name">paragraph text</p><a href="//weird-link">weird link</a>';

export const html =
  '<h2>heading element</h2><a href="blog/post/title">blog post link</a><p>paragraph text</p><a href="https://weird-link" target="_blank" rel="noopener noreferrer">weird link</a>';

export const expectedPostContent: PostContent = {
  __typename: "PostContent",
  html: '<h2 id="heading-element">heading element</h2><a href="blog/post/title">blog post link</a><p>paragraph text</p><a href="https://weird-link" target="_blank" rel="noopener noreferrer">weird link</a>',
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
  id: "2",
  postId: UUID,
  dateCreated,
  datePublished: null,
  lastModified: null,
  views: 0,
  isInBin: false,
  isDeleted: false,
};

export const mockPostTagsData: Tags = [
  { id: tagIds[0] },
  { id: tagIds[1] },
  { id: tagIds[2] },
];

export const gqlValidations: [string, object][] = [
  [
    "Should throw a graphql validation error for null and undefined inputs",
    {
      title: null,
      description: undefined,
      excerpt: undefined,
      content: undefined,
      tagIds: undefined,
      imageBanner: undefined,
    },
  ],
  [
    "should throw a graphql validation error for boolean and number inputs",
    {
      title: false,
      description: 34646,
      excerpt: true,
      content: true,
      tagIds: [9877, true],
      imageBanner: 21314,
    },
  ],
];

export const validations = (nullOrUndefined?: null): Validations[] => [
  [
    "Should return a validation error response for empty inputs",
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
    "Should return a validation error response for empty whitespace inputs",
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
    "The generated url slug for the provided post title already exists. Please ensure every post has a unique title",
    { slug: "another-blog-post-title" },
  ],
  [
    "Should return an error object if the post title already exists",
    "A post with that title has already been created",
    {},
  ],
];
