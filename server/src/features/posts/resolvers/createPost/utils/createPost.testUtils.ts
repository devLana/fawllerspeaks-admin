import { randomUUID } from "node:crypto";
import type { InputErrors } from "@types";

interface Input {
  title: string;
  description: string;
  content: string;
  tags: string[] | null;
  imageBanner: string;
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
      content: "",
      tags: ["", ""],
      imageBanner: "",
    },
    {
      titleError: "Provide post title",
      descriptionError: "Provide post description",
      contentError: "Provide post content",
      tagsError: "Input post tags cannot be empty values",
      imageBannerError: "Post image banner url cannot be empty",
    },
  ],
  [
    "Should return validation errors for empty whitespace inputs",
    {
      title: "  ",
      description: " ",
      content: "    ",
      tags: ["   ", "     "],
      imageBanner: "  ",
    },
    {
      titleError: "Provide post title",
      descriptionError: "Provide post description",
      contentError: "Provide post content",
      tagsError: "Input post tags cannot be empty values",
      imageBannerError: "Post image banner url cannot be empty",
    },
  ],
  [
    "Should return a post tags input validation error if the post tags array is empty",
    {
      title: "title",
      description: "description",
      content: "content",
      tags: [],
      imageBanner: "post/image/storage/path",
    },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: "No post tags were provided",
      imageBannerError: nullOrUndefined,
    },
  ],
  [
    "Should return a post tags input validation error if duplicate post tag ids were provided",
    {
      title: "title",
      description: "description",
      content: "content",
      tags: [tagId, tagId],
      imageBanner: "slug/image/storage/path",
    },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: "Input tags can only contain unique tags",
      imageBannerError: nullOrUndefined,
    },
  ],
  [
    "Should return a post tags input validation error if an invalid post tag id was provided",
    {
      title: "title",
      description: "description",
      content: "content",
      tags: [tagId, "tagId"],
      imageBanner: "post/image/storage/path",
    },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: "Invalid post tag id",
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
      content: null,
      tags: undefined,
      imageBanner: undefined,
    },
  ],
  [
    "Should throw a graphql validation error for boolean and number inputs",
    {
      title: false,
      description: 34646,
      content: true,
      tags: [9877, true],
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

export const tags = [UUID, randomUUID(), randomUUID()];
export const imageBanner = "post/image/banner";
const mockData = { description: "post description", content: "post content" };

export const argsWithImage = {
  ...mockData,
  title: "blog post title",
  imageBanner,
};

export const argsWithNoImage = {
  ...mockData,
  title: "another blog post title",
  imageBanner: null,
};

export const verifyUser: [string, object[]][] = [
  ["Should return an error object if the user is unknown", []],
  [
    "Should return an error object if the user is unregistered",
    [{ isRegistered: false }],
  ],
];
