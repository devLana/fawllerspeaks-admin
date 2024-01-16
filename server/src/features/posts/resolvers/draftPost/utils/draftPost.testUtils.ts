import { randomUUID } from "node:crypto";

import type { InputErrors } from "@types";

interface Input {
  title: string;
  description?: string;
  content?: string;
  tags?: string[];
  imageBanner?: string;
}

export type Tags = { id: string }[];
type Validations = [string, Input, InputErrors<Input>];

export const userId = randomUUID();
export const UUID = randomUUID();
export const dateCreated = "2021-05-17 13:22:43.717+01";
export const imageBanner = "post/image/banner";
export const tags = [UUID, randomUUID(), randomUUID()];

export const argsWithImage = {
  title: "Blog Post Title",
  content: null,
  imageBanner,
};

export const argsWithNoImage = {
  title: "Another Blog Post Title",
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
  { id: tags[0] },
  { id: tags[1] },
  { id: tags[2] },
];

export const gqlValidations: [string, object][] = [
  [
    "Should throw a graphql validation error for null and undefined inputs",
    {
      title: null,
      description: undefined,
      content: undefined,
      tags: undefined,
      imageBanner: undefined,
    },
  ],
  [
    "should throw a graphql validation error for boolean and number inputs",
    {
      title: false,
      description: 34646,
      content: true,
      tags: [9877, true],
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
      content: "",
      tags: ["", ""],
      imageBanner: "",
    },
    {
      titleError: "A title is required to save this post to draft",
      descriptionError: "Provide post description",
      contentError: "Provide post content",
      tagsError: "Input post tags cannot be empty values",
      imageBannerError: "Post image banner url cannot be empty",
    },
  ],
  [
    "Should return a validation error response for empty whitespace inputs",
    {
      title: "  ",
      description: " ",
      content: "    ",
      tags: ["   ", "     "],
      imageBanner: "  ",
    },
    {
      titleError: "A title is required to save this post to draft",
      descriptionError: "Provide post description",
      contentError: "Provide post content",
      tagsError: "Input post tags cannot be empty values",
      imageBannerError: "Post image banner url cannot be empty",
    },
  ],
  [
    "Should return a post tags input validation error if the post tags input array is empty",
    { title: "title", tags: [] },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: "No post tags were provided",
      imageBannerError: nullOrUndefined,
    },
  ],
  [
    "Should return a post tags input validation error if duplicate post tag ids was provided",
    { title: "title", tags: [UUID, UUID] },
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
    { title: "title", tags: [UUID, "tag_id"] },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: "Invalid post tag id",
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
