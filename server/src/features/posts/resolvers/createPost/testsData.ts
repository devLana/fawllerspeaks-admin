import { randomUUID } from "node:crypto";

type Tuple = [
  string,
  {
    title: string;
    description: string;
    content: string;
    tags: string[];
    slug: string;
  },
  {
    titleError?: string | null;
    descriptionError?: string | null;
    contentError?: string | null;
    tagsError?: string | null;
    slugError?: string | null;
  }
];

const tagId = randomUUID();

export const validationTestsTable = (nullOrUndefined?: null): Tuple[] => [
  [
    "empty inputs",
    { title: "", description: "", content: "", tags: ["", ""], slug: "" },
    {
      titleError: "Provide post title",
      descriptionError: "Provide post description",
      contentError: "Provide post content",
      tagsError: "Input post tags cannot be empty values",
      slugError: "Provide post slug",
    },
  ],
  [
    "empty whitespace inputs",
    {
      title: "  ",
      description: " ",
      content: "    ",
      tags: ["   ", "     "],
      slug: "  ",
    },
    {
      titleError: "Provide post title",
      descriptionError: "Provide post description",
      contentError: "Provide post content",
      tagsError: "Input post tags cannot be empty values",
      slugError: "Provide post slug",
    },
  ],
  [
    "empty tags input",
    {
      title: "title",
      description: "description",
      content: "content",
      tags: [],
      slug: "post slug",
    },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: "No post tags were provided",
      slugError: nullOrUndefined,
    },
  ],
  [
    "duplicate tag ids",
    {
      title: "title",
      description: "description",
      content: "content",
      tags: [tagId, tagId],
      slug: "slug",
    },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: "Input tags can only contain unique tags",
      slugError: nullOrUndefined,
    },
  ],
  [
    "invalid tag id",
    {
      title: "title",
      description: "description",
      content: "content",
      tags: [tagId, "tagId"],
      slug: "POST SLUG",
    },
    {
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: "Invalid post tag id",
      slugError: nullOrUndefined,
    },
  ],
];

const dateCreated = "2021-05-17 13:22:43.717+01";
export const returnDateCreated = "2021-05-17T12:22:43.717Z";

export const dbPost = {
  postId: "generated_post_id",
  imageBanner: null,
  dateCreated,
  datePublished: null,
  lastModified: null,
  views: 0,
  likes: 0,
  isInBin: false,
  isDeleted: false,
};
