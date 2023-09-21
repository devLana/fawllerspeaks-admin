import { urls } from "@utils";
import { randomUUID } from "node:crypto";

type Tuple = [string, string[], string];

export const name = "Author Name";
const UUID = randomUUID();
const postTagIds = ["1", "2", "3", "4"];
const dateCreated = "2021-05-17 13:22:43.717+01";
const returnDateCreated = "2021-05-17T12:22:43.717Z";
const lastModified = "2023-02-14 20:18:59.953+01";
const returnLastModified = "2023-02-14T19:18:59.953Z";

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
  description: "deletedPost.description",
  content: "deletedPost.content",
  imageBanner: null,
  dateCreated,
  datePublished: null,
  lastModified: null,
  views: 0,
  likes: 0,
};

export const dbPost1 = {
  postId: postIds[0],
  title: "post1",
  ...mockPost,
  status: "Unpublished",
  slug: null,
  tags: null,
};

export const dbPost2 = {
  postId: postIds[1],
  title: "post2",
  ...mockPost,
  status: "Unpublished",
  slug: "post.2.slug",
  tags: null,
};

export const dbPost3 = {
  postId: postIds[2],
  title: "post3",
  ...mockPost,
  status: "Draft",
  slug: "post_3_slug",
  tags: postTagIds,
};

export const dbPost4 = {
  postId: postIds[3],
  title: "post4",
  ...mockPost,
  status: "Draft",
  slug: null,
  tags: postTagIds,
};

export const returnPost = {
  ...mockPost,
  author: name,
  dateCreated: returnDateCreated,
  isInBin: true,
  isDeleted: true,
};

export const returnPost1 = {
  id: postIds[0],
  title: "post1",
  ...returnPost,
  status: "Unpublished",
  url: `${urls.siteUrl}/blog/post1`,
  slug: null,
  tags: null,
};

export const returnPost2 = {
  id: postIds[1],
  title: "post2",
  ...returnPost,
  status: "Unpublished",
  url: `${urls.siteUrl}/blog/post-2-slug`,
  slug: "post.2.slug",
  tags: null,
};

export const returnPost3 = {
  id: postIds[2],
  title: "post3",
  ...returnPost,
  status: "Draft",
  url: `${urls.siteUrl}/blog/post-3-slug`,
  slug: "post_3_slug",
  tags: returnPostTags,
};

export const returnPost4 = {
  id: postIds[3],
  title: "post4",
  ...returnPost,
  status: "Draft",
  url: `${urls.siteUrl}/blog/post4`,
  slug: null,
  tags: returnPostTags,
};

export const validationsTable: Tuple[] = [
  ["empty input array", [], "No post ids provided"],
  [
    "array of empty whitespace & empty id strings",
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
  ["array input with invalid uuid post ids", ["id1", "id2"], "Invalid post id"],
];
