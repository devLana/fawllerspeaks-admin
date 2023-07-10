import { randomUUID } from "node:crypto";
import { urls } from "@utils";

type Table1Contents = [string, string[], string];

export const name = "Author Name";
export const UUID = randomUUID();
export const postIds = [UUID, randomUUID(), randomUUID(), randomUUID()];
export const postTagIds = ["1", "2", "3", "4"];

export const mockPostTags = [
  { id: "1", name: "tag1" },
  { id: "2", name: "tag2" },
  { id: "3", name: "tag3" },
  { id: "4", name: "tag4" },
];

const dbPost = {
  description: "unBinnedPost.description",
  content: "unBinnedPost.content",
  imageBanner: null,
  dateCreated: 78345635992342,
  datePublished: 873465736583,
  lastModified: null,
  views: 0,
  likes: 0,
  isDeleted: false,
};

export const dbPost1 = {
  postId: postIds[0],
  title: "post1",
  ...dbPost,
  status: "Published",
  slug: null,
  tags: null,
};

export const dbPost2 = {
  postId: postIds[1],
  title: "post2",
  ...dbPost,
  status: "Unpublished",
  slug: "post.2.slug",
  tags: null,
};

export const dbPost3 = {
  postId: postIds[2],
  title: "post3",
  ...dbPost,
  status: "Published",
  slug: "post_3_slug",
  tags: postTagIds,
};

export const dbPost4 = {
  postId: postIds[3],
  title: "post4",
  ...dbPost,
  status: "Draft",
  slug: null,
  tags: postTagIds,
};

const returnPost = { ...dbPost, author: name, isInBin: false };

export const returnPost1 = {
  id: postIds[0],
  title: "post1",
  ...returnPost,
  status: "Published",
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
  status: "Published",
  url: `${urls.siteUrl}/blog/post-3-slug`,
  slug: "post_3_slug",
  tags: mockPostTags,
};

export const returnPost4 = {
  id: postIds[3],
  title: "post4",
  ...returnPost,
  status: "Draft",
  url: `${urls.siteUrl}/blog/post4`,
  slug: null,
  tags: mockPostTags,
};

export const testTable1: Table1Contents[] = [
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
