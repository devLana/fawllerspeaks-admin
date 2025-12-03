import { randomUUID } from "node:crypto";
import type { InputErrors } from "types/tests";
import type { EditPostInput, PostContent } from "@resolverTypes";

const UUID = randomUUID();
const tagIds = [UUID, randomUUID(), randomUUID()];
export const imageBanner = "path/to/post/image/banner.png";

export const content =
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

const input: EditPostInput = {
  id: UUID,
  title: "Blog Post Title",
  description: "post description",
  excerpt: "post excerpt",
};

export const post: EditPostInput = { ...input, content: "post content" };

type Validations = [string, EditPostInput, InputErrors<EditPostInput>][];

export const validations: Validations = [
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
      editStatusError: null,
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
      editStatusError: null,
    },
  ],
  [
    "Should return a post id input validation error if an invalid post id is provided",
    { id: "invalid-id", title: "title", content: null, editStatus: true },
    {
      idError: "Invalid post id",
      titleError: null,
      descriptionError: null,
      excerptError: null,
      contentError: null,
      tagIdsError: null,
      imageBannerError: null,
      editStatusError: null,
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
      idError: null,
      titleError: null,
      descriptionError: null,
      excerptError: null,
      contentError: null,
      tagIdsError: "No post tag id was provided",
      imageBannerError: null,
      editStatusError: null,
    },
  ],
  [
    "Should return a post tags input validation error if duplicate post tag ids was provided",
    { id: UUID, title: "title", tagIds: [UUID, UUID], imageBanner: null },
    {
      idError: null,
      titleError: null,
      descriptionError: null,
      excerptError: null,
      contentError: null,
      tagIdsError: "The provided input post tag ids should be unique ids",
      imageBannerError: null,
      editStatusError: null,
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
      idError: null,
      titleError: null,
      descriptionError: null,
      excerptError: null,
      contentError: null,
      tagIdsError: "Cannot add more than 5 post tags to a post",
      imageBannerError: null,
      editStatusError: null,
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
      idError: null,
      titleError: "Post title can not be more than 255 characters",
      descriptionError: "Post description can not be more than 255 characters",
      excerptError: "Post excerpt can not be more than 300 characters",
      contentError: null,
      tagIdsError: null,
      imageBannerError: null,
      editStatusError: null,
    },
  ],
];

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
