import { urls } from "@utils";

export const tags = [
  { id: "1", name: "tag1", dateCreated: 574794, lastModified: null },
  { id: "2", name: "tag2", dateCreated: 574794, lastModified: 791045 },
  { id: "3", name: "tag3", dateCreated: 574794, lastModified: null },
];

const data1 = {
  title: "title",
  description: "description",
  content: "content",
  author: "author name",
  status: "Unpublished",
  imageBanner: "imageBanner",
  dateCreated: 92384908,
  datePublished: null,
  lastModified: 43859345,
  views: 0,
  likes: 0,
  isInBin: false,
  isDeleted: false,
  tags: null,
};

const data2 = {
  title: "new title",
  description: "new description",
  content: "new content",
  author: "author name",
  status: "Published",
  imageBanner: null,
  dateCreated: 12908305935,
  datePublished: 49058309583045,
  lastModified: 34895792355,
  views: 10,
  likes: 5,
  isInBin: false,
  isDeleted: false,
  tags: ["2", "1", "3"],
};

export const dbPosts = [
  { ...data1, postId: "post-id-1", slug: null },
  { ...data2, postId: "post-id-2", slug: "pOst_SlUg" },
];

export const posts = [
  {
    ...data1,
    id: "post-id-1",
    url: `${urls.siteUrl}/blog/title`,
    slug: null,
  },
  {
    ...data2,
    id: "post-id-2",
    url: `${urls.siteUrl}/blog/post-slug`,
    slug: "pOst_SlUg",
    tags: [tags[1], tags[0], tags[2]],
  },
];
