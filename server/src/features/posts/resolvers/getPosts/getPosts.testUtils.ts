import { urls } from "@utils";

const dateCreated = "2021-05-17 13:22:43.717+01";
const returnDateCreated = "2021-05-17T12:22:43.717Z";
const datePublished = "2021-06-11 09:44:02.213+01";
const returnDatePublished = "2021-06-11T08:44:02.213Z";
const lastModified = "2023-02-14 20:18:59.953+01";
const returnLastModified = "2023-02-14T19:18:59.953Z";

export const tags = [
  { id: "1", name: "tag1", dateCreated, lastModified: null },
  { id: "2", name: "tag2", dateCreated, lastModified },
  { id: "3", name: "tag3", dateCreated, lastModified: null },
];

const returnPostTags = [
  { id: "1", name: "tag1", dateCreated: returnDateCreated, lastModified: null },
  {
    id: "2",
    name: "tag2",
    dateCreated: returnDateCreated,
    lastModified: returnLastModified,
  },
  { id: "3", name: "tag3", dateCreated: returnDateCreated, lastModified: null },
];

const post1 = {
  title: "title",
  description: "description",
  content: "content",
  author: "author name",
  status: "Unpublished",
  imageBanner: "imageBanner",
  dateCreated,
  datePublished: null,
  lastModified,
  views: 0,
  likes: 0,
  isInBin: false,
  isDeleted: false,
  tags: null,
};

const post2 = {
  title: "new title",
  description: "new description",
  content: "new content",
  author: "author name",
  status: "Published",
  imageBanner: null,
  dateCreated,
  datePublished,
  lastModified,
  views: 10,
  likes: 5,
  isInBin: false,
  isDeleted: false,
  tags: ["2", "1", "3"],
};

export const dbPosts = [
  { ...post1, postId: "post-id-1", slug: null },
  { ...post2, postId: "post-id-2", slug: "pOst_SlUg" },
];

export const returnPosts = [
  {
    ...post1,
    id: "post-id-1",
    url: `${urls.siteUrl}/blog/title`,
    slug: null,
    dateCreated: returnDateCreated,
    lastModified: returnLastModified,
  },
  {
    ...post2,
    id: "post-id-2",
    url: `${urls.siteUrl}/blog/post-slug`,
    slug: "pOst_SlUg",
    dateCreated: returnDateCreated,
    datePublished: returnDatePublished,
    lastModified: returnLastModified,
    tags: [returnPostTags[1], returnPostTags[0], returnPostTags[2]],
  },
];
