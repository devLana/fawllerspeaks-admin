import { urls } from "@utils/ClientUrls";

export const name = "Post Author";
const dateCreated = "2021-05-17 13:22:43.717+01";
const returnDateCreated = "2021-05-17T12:22:43.717Z";
const datePublished = "2021-06-11 09:44:02.213+01";
const returnDatePublished = "2021-06-11T08:44:02.213Z";
const lastModified = "2023-02-14 20:18:59.953+01";
const returnLastModified = "2023-02-14T19:18:59.953Z";

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

const dbPost = {
  description: "deletedPost.description",
  content: "deletedPost.content",
  imageBanner: null,
  dateCreated,
  datePublished,
  lastModified: null,
  views: 0,
  likes: 0,
};

export const dbPost1 = {
  postId: "post_id_1",
  title: "post1",
  ...dbPost,
  status: "Unpublished",
  slug: null,
  tags: ["1", "2", "3", "4"],
};

export const dbPost2 = {
  postId: "post_id_2",
  title: "post2",
  ...dbPost,
  status: "Draft",
  slug: "post.2.slug",
  tags: null,
};

const returnPost = {
  ...dbPost,
  author: name,
  dateCreated: returnDateCreated,
  datePublished: returnDatePublished,
  isInBin: true,
  isDeleted: true,
};

export const returnPost1 = {
  id: "post_id_1",
  title: "post1",
  ...returnPost,
  status: "Unpublished",
  url: `${urls.siteUrl}/blog/post1`,
  slug: null,
  tags: returnPostTags,
};

export const returnPost2 = {
  id: "post_id_2",
  title: "post2",
  ...returnPost,
  status: "Draft",
  url: `${urls.siteUrl}/blog/post-2-slug`,
  slug: "post.2.slug",
  tags: null,
};
