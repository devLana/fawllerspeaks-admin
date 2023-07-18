import { randomUUID } from "node:crypto";
import { urls } from "@utils";

interface Errors {
  postIdError?: string | null;
  titleError?: string | null;
  descriptionError?: string | null;
  contentError?: string | null;
  tagsError?: string | null;
  slugError?: string | null;
}

interface Post1 {
  postId?: string;
  title: string;
  description?: string;
  content?: string;
  tags?: string[];
  slug?: string;
}

type KeyTypes = number | boolean | null | undefined;

interface Post2<T = KeyTypes> {
  [key: string]: T | T[];
  postId: T;
  title: T;
  description: T;
  content: T;
  tags: T | T[];
  slug: T;
}

type Tuple1 = [string, Post1, Errors];
type Tuple2 = [string, Post2];

export type Tags = { id: string }[];

export const userId = randomUUID();
export const UUID = randomUUID();

const dateCreated = "2021-05-17 13:22:43.717+01";
const returnDateCreated = "2021-05-17T12:22:43.717Z";

export const dbData = {
  postId: UUID,
  imageBanner: null,
  dateCreated,
  datePublished: null,
  lastModified: null,
  views: 0,
  likes: 0,
  isInBin: false,
  isDeleted: false,
};

export const post = {
  title: "post title",
  description: "post description",
  content: "post content",
  tags: [randomUUID(), randomUUID(), randomUUID()],
  slug: "POST SLUG",
};

export const testPost = { ...post, postId: UUID };

export const draftResult = {
  id: dbData.postId,
  title: post.title,
  description: post.description,
  content: post.content,
  status: "Draft",
  url: `${urls.siteUrl}/blog/post-slug`,
  slug: "POST SLUG",
  imageBanner: dbData.imageBanner,
  dateCreated: returnDateCreated,
  datePublished: null,
  lastModified: null,
  views: dbData.views,
  likes: dbData.likes,
  isInBin: dbData.isInBin,
  isDeleted: dbData.isDeleted,
  tags: [{ id: post.tags[0] }, { id: post.tags[1] }, { id: post.tags[2] }],
};

export const mockPostTagsData: Tags = [
  { id: post.tags[0] },
  { id: post.tags[1] },
  { id: post.tags[2] },
];

export const validationTestsTable = (nullOrUndefined?: null): Tuple1[] => [
  [
    "empty inputs",
    {
      postId: "",
      title: "",
      description: "",
      content: "",
      tags: ["", ""],
      slug: "",
    },
    {
      postIdError: "Provide post id",
      titleError: "A title is required to save this post to draft",
      descriptionError: "Provide post description",
      contentError: "Provide post content",
      tagsError: "Input post tags cannot be empty values",
      slugError: "Provide post slug",
    },
  ],
  [
    "empty whitespace inputs",
    {
      postId: "    ",
      title: "  ",
      description: " ",
      content: "    ",
      tags: ["   ", "     "],
      slug: "  ",
    },
    {
      postIdError: "Provide post id",
      titleError: "A title is required to save this post to draft",
      descriptionError: "Provide post description",
      contentError: "Provide post content",
      tagsError: "Input post tags cannot be empty values",
      slugError: "Provide post slug",
    },
  ],
  [
    "empty post title",
    { title: "" },
    {
      postIdError: nullOrUndefined,
      titleError: "A title is required to save this post to draft",
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: nullOrUndefined,
      slugError: nullOrUndefined,
    },
  ],
  [
    "invalid post id and empty tags input",
    { postId: "post_id", title: "title", tags: [] },
    {
      postIdError: "Invalid post id",
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: "No post tags were provided",
      slugError: nullOrUndefined,
    },
  ],
  [
    "duplicate post tag ids",
    { title: "title", tags: [UUID, UUID] },
    {
      postIdError: nullOrUndefined,
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: "Input tags can only contain unique tags",
      slugError: nullOrUndefined,
    },
  ],
  [
    "invalid post tag id",
    { title: "title", tags: [UUID, "tag_id"] },
    {
      postIdError: nullOrUndefined,
      titleError: nullOrUndefined,
      descriptionError: nullOrUndefined,
      contentError: nullOrUndefined,
      tagsError: "Invalid post tag id",
      slugError: nullOrUndefined,
    },
  ],
];

export const e2eValidationsTable: Tuple2[] = [
  [
    "null and undefined",
    {
      postId: undefined,
      title: null,
      description: undefined,
      content: undefined,
      tags: undefined,
      slug: undefined,
    },
  ],
  [
    "boolean and number",
    {
      postId: 4582,
      title: false,
      description: 34646,
      content: true,
      tags: [9877, true],
      slug: 21314,
    },
  ],
];
