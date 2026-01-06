import { randomUUID } from "node:crypto";
import type { InputErrors } from "types/tests";
import type { DraftPostInput, PostContent } from "@resolverTypes";

type Validations = [string, DraftPostInput, InputErrors<DraftPostInput>][];

export const UUID = randomUUID();
export const imageBanner = "post/image/banner";

const content =
  '<h2 class="heading">heading element</h2><hr /><a href="blog/post/title">blog post link</a><p id="class-name">paragraph text <a href="//weird-link">weird link</a></p><p><img src="src" /></p>';

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

export const title1 = "Published Post With Unknown Tag Ids";
export const title2 = "Published Post With Some Unknown Tag Ids";

export const validations: Validations = [
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
      titleError: null,
      descriptionError: null,
      excerptError: null,
      contentError: null,
      tagIdsError: "No post tag id was provided",
      imageBannerError: null,
    },
  ],
  [
    "Should return a post tags input validation error if duplicate post tag ids was provided",
    { title: "title", tagIds: [UUID, UUID], imageBanner: null },
    {
      titleError: null,
      descriptionError: null,
      excerptError: null,
      contentError: null,
      tagIdsError: "The provided input post tag ids should be unique ids",
      imageBannerError: null,
    },
  ],
  [
    "Should return a post tags input validation error if more than 5 post tag ids were provided",
    {
      title: "title",
      tagIds: [
        UUID,
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
      ],
    },
    {
      titleError: null,
      descriptionError: null,
      excerptError: null,
      contentError: null,
      tagIdsError: "Cannot add more than 5 post tags to a new draft post",
      imageBannerError: null,
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
      contentError: null,
      tagIdsError: null,
      imageBannerError: null,
    },
  ],
];
