import { randomUUID } from "node:crypto";
import type { InputErrors } from "types/tests";
import type { CreatePostInput, PostContent } from "@resolverTypes";

type Validations = [string, CreatePostInput, InputErrors<CreatePostInput>][];

const ID = randomUUID();

export const validations: Validations = [
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
      titleError: null,
      descriptionError: null,
      excerptError: null,
      contentError: null,
      tagIdsError: "No post tag id was provided",
      imageBannerError: null,
    },
  ],
  [
    "Should return a post tags input validation error if duplicate post tag ids were provided",
    {
      title: "title",
      description: "description",
      excerpt: "excerpt",
      content: "content",
      tagIds: [ID, ID],
    },
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
    "Should return a post tags input validation error if an invalid post tag id was provided",
    {
      title: "title",
      description: "description",
      excerpt: "excerpt",
      content: "content",
      tagIds: [ID, "tagId"],
      imageBanner: null,
    },
    {
      titleError: null,
      descriptionError: null,
      excerptError: null,
      contentError: null,
      tagIdsError: "Invalid post tag id provided",
      imageBannerError: null,
    },
  ],
  [
    "Should return a post tags input validation error if more than 5 post tag ids were provided",
    {
      title: "title",
      description: "description",
      excerpt: "excerpt",
      content: "content",
      tagIds: [
        ID,
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
      tagIdsError: "Cannot add more than 5 post tags to a new post",
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
      content: "<p>post html content</p>",
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
