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

export const post1 = {
  id: UUID,
  title: "Blog Post Title",
  description: null,
  excerpt: null,
  content: null,
  imageBanner: null,
};

export const post2 = {
  description: "This is a draft test post description 2",
  excerpt: "This is a draft test post excerpt 2",
  content: "<p>This is a draft test post content 2</p>",
  imageBanner: "post/image/banner/storage/path/image.png",
};

export const post2ExpectedContent: PostContent = {
  __typename: "PostContent",
  html: "<p>This is a draft test post content 2</p>",
  tableOfContents: null,
};

export const post3 = {
  title: "The Edit Of A Published Post",
  description: "The Edit Of A Published Post Description",
  excerpt: "The Edit Of A Published Post Excerpt",
  content,
};

export const post4 = {
  title: "The Edit Of An Unpublished Post",
  description: "The Edit Of An Unpublished Post Description",
  excerpt: "The Edit Of An Unpublished Post Excerpt",
  content,
};

export const post5 = {
  title: "An Edit Of A Draft Post Edited To A Published Post",
  description: "An Edit Of A Draft Post Edited To A Published Post Description",
  excerpt: "An Edit Of A Draft Post Edited To A Published Post Excerpt",
  content: "<p>An Edit Of A Draft Post Edited To A Published Post</p>",
  imageBanner,
  editStatus: true,
};

export const post5ExpectedContent: PostContent = {
  __typename: "PostContent",
  html: "<p>An Edit Of A Draft Post Edited To A Published Post</p>",
  tableOfContents: null,
};

export const post6 = {
  title: "An Unpublished Post Edited To A Published Post",
  description: "An Unpublished Post Edited To A Published Post Description",
  excerpt: "An Unpublished Post Edited To A Published Post Excerpt",
  content,
  editStatus: true,
};

export const post7 = {
  title: "A Published Post Edited To An Unpublished Post",
  description: "A Published Post Edited To An Unpublished Post description",
  excerpt: "A Published Post Edited To An Unpublished Post Excerpt",
  content: "<p>A Published Post Edited To An Unpublished Post</p>",
  editStatus: true,
};

export const post7ExpectedContent: PostContent = {
  __typename: "PostContent",
  html: "<p>A Published Post Edited To An Unpublished Post</p>",
  tableOfContents: null,
};

export const expectedUpdatedDraftPostContent: PostContent = {
  __typename: "PostContent",
  html: "<p>A Published Post Edited To An Unpublished Post</p>",
  tableOfContents: null,
};
