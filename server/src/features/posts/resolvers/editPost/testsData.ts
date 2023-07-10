import { urls } from "@utils";
import { randomUUID } from "node:crypto";

interface Post1 {
  postId: string;
  title: string;
  description: string;
  content: string;
  tags?: string[];
  slug?: string;
}

interface PostError {
  postIdError?: string | null;
  titleError?: string | null;
  descriptionError?: string | null;
  contentError?: string | null;
  tagsError?: string | null;
  slugError?: string | null;
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

type Tuple1 = [string, Post1, PostError];
type Tuple2 = [string, Post2];

export type MockPostTags = { id: string; name: string }[];

export const UUID = randomUUID();
export const userId = "mocked_user_id";
export const name = "Author Name";

export const postFields = {
  postId: UUID,
  title: "post title",
  description: "post description",
  content: "post content",
};

const tagId1 = randomUUID();
const tagId2 = randomUUID();
const tagId3 = randomUUID();

export const post = {
  ...postFields,
  tags: [tagId1, tagId2, tagId3],
  slug: "post/slug",
};

export const dbReturned = {
  imageBanner: null,
  dateCreated: 47567,
  datePublished: null,
  lastModified: 1248993,
  views: 0,
  likes: 0,
  isInBin: false,
  isDeleted: false,
};

export const returnData = {
  ...dbReturned,
  id: UUID,
  title: post.title,
  description: post.description,
  content: post.content,
  author: name,
};

export const mockPostTags1: MockPostTags = [
  { id: tagId1, name: "tag1" },
  { id: tagId2, name: "tag2" },
  { id: tagId3, name: "tag3" },
];

export const mockPostTags2: MockPostTags = [
  { id: tagId3, name: "current tag 10" },
  { id: tagId2, name: "current tag 11" },
];

export const postInfo = {
  authorId: userId,
  authorName: name,
  postStatus: "Unpublished",
  foundSlug: "Current_Slug",
  foundTags: mockPostTags2,
};

export const data1 = {
  ...returnData,
  status: "Unpublished",
  url: `${urls.siteUrl}/blog/current-slug`,
  slug: "Current_Slug",
  tags: mockPostTags2,
};

export const data2 = {
  ...returnData,
  url: `${urls.siteUrl}/blog/post-slug`,
  slug: "post/slug",
  tags: mockPostTags1,
};

export const validationsTable = (nullOrUndefined?: null): Tuple1[] => [
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
      postId: "    ",
      title: "  ",
      description: " ",
      content: "    ",
      tags: ["   ", "     "],
      slug: "  ",
    },
    {
      postIdError: "Provide post id",
      titleError: "Provide post title",
      descriptionError: "Provide post description",
      contentError: "Provide post content",
      tagsError: "Input post tags cannot be empty values",
      slugError: "Provide post slug",
    },
  ],
  [
    "invalid post id and empty post tags input",
    { ...postFields, postId: "post_id", tags: [] },
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
    { ...postFields, tags: [UUID, UUID] },
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
    { ...postFields, tags: [UUID, "tag_id"] },
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
      postId: null,
      title: null,
      description: null,
      content: null,
      tags: undefined,
      slug: undefined,
    },
  ],
  [
    "boolean and number",
    {
      postId: true,
      title: false,
      description: 34646,
      content: true,
      tags: [9877, false],
      slug: 21314,
    },
  ],
];
