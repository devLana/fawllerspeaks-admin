import { randomUUID } from "node:crypto";
import { urls } from "@utils";

type Tuple = [string, string[], string];

const UUID = randomUUID();
const postTagIds = ["1", "2", "3", "4"];
const dateCreated = "2021-05-17 13:22:43.717+01";
const returnDateCreated = "2021-05-17T12:22:43.717Z";
const datePublished = "2021-06-11 09:44:02.213+01";
const returnDatePublished = "2021-06-11T08:44:02.213Z";
const lastModified = "2023-02-14 20:18:59.953+01";
const returnLastModified = "2023-02-14T19:18:59.953Z";

export const name = "Author Name";
export const postIds = [UUID, randomUUID(), randomUUID(), randomUUID()];

export const dbPostTags = [
  { id: "1", name: "tag1", dateCreated, lastModified },
  { id: "2", name: "tag2", dateCreated, lastModified: null },
  { id: "3", name: "tag3", dateCreated, lastModified },
  { id: "4", name: "tag4", dateCreated, lastModified: null },
];

const returnPostTags = [
  {
    id: "1",
    name: "tag1",
    dateCreated: returnDateCreated,
    lastModified: returnLastModified,
  },
  { id: "2", name: "tag2", dateCreated: returnDateCreated, lastModified: null },
  {
    id: "3",
    name: "tag3",
    dateCreated: returnDateCreated,
    lastModified: returnLastModified,
  },
  { id: "4", name: "tag4", dateCreated: returnDateCreated, lastModified: null },
];

const mockPost = {
  description: "binnedPost.description",
  content: "binnedPost.content",
  imageBanner: null,
  dateCreated,
  views: 0,
  likes: 0,
  isDeleted: false,
};
const returnPost = { ...mockPost, author: name, isInBin: true };

export const dbPost1 = {
  postId: postIds[0],
  title: "post1",
  ...mockPost,
  datePublished,
  lastModified,
  status: "Published",
  slug: null,
  tags: null,
};

export const dbPost2 = {
  postId: postIds[1],
  title: "post2",
  ...mockPost,
  datePublished: null,
  lastModified: null,
  status: "Unpublished",
  slug: "post.2.slug",
  tags: null,
};

export const dbPost3 = {
  postId: postIds[2],
  title: "post3",
  ...mockPost,
  datePublished,
  lastModified: null,
  status: "Published",
  slug: "post_3_slug",
  tags: postTagIds,
};

export const dbPost4 = {
  postId: postIds[3],
  title: "post4",
  ...mockPost,
  datePublished: null,
  lastModified: null,
  status: "Draft",
  slug: null,
  tags: postTagIds,
};

export const returnPost1 = {
  ...mockPost,
  ...returnPost,
  id: postIds[0],
  title: "post1",
  status: "Published",
  slug: null,
  url: `${urls.siteUrl}/blog/post1`,
  dateCreated: returnDateCreated,
  datePublished: returnDatePublished,
  lastModified: returnLastModified,
  tags: null,
};

export const returnPost2 = {
  ...mockPost,
  ...returnPost,
  id: postIds[1],
  title: "post2",
  status: "Unpublished",
  slug: "post.2.slug",
  url: `${urls.siteUrl}/blog/post-2-slug`,
  dateCreated: returnDateCreated,
  datePublished: null,
  lastModified: null,
  tags: null,
};

export const returnPost3 = {
  ...mockPost,
  ...returnPost,
  id: postIds[2],
  title: "post3",
  status: "Published",
  slug: "post_3_slug",
  url: `${urls.siteUrl}/blog/post-3-slug`,
  dateCreated: returnDateCreated,
  datePublished: returnDatePublished,
  lastModified: null,
  tags: returnPostTags,
};

export const returnPost4 = {
  ...mockPost,
  ...returnPost,
  id: postIds[3],
  title: "post4",
  status: "Draft",
  slug: null,
  url: `${urls.siteUrl}/blog/post4`,
  dateCreated: returnDateCreated,
  datePublished: null,
  lastModified: null,
  tags: returnPostTags,
};

export const validationsTable: Tuple[] = [
  ["empty input array", [], "No post ids provided"],
  [
    "array of empty strings and empty whitespace strings",
    ["   ", ""],
    "Input post ids cannot be empty values",
  ],
  [
    "array of duplicate id strings",
    [UUID, UUID],
    "Input post ids can only contain unique ids",
  ],
  [
    "array input that exceeds maximum limit of 10",
    [
      ...postIds,
      randomUUID(),
      randomUUID(),
      randomUUID(),
      randomUUID(),
      randomUUID(),
      randomUUID(),
      randomUUID(),
    ],
    "Input post ids can only contain at most 10 ids",
  ],
  [
    "array input with invalid uuid post tag ids",
    ["id1", "id2"],
    "Invalid post id",
  ],
];
