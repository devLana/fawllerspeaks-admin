import { urls } from "@utils";

export const name = "Post Author";

export const postTags = [
  { id: "1", name: "tag1" },
  { id: "2", name: "tag2" },
  { id: "3", name: "tag3" },
  { id: "4", name: "tag4" },
];

const dbPost = {
  description: "deletedPost.description",
  content: "deletedPost.content",
  imageBanner: null,
  dateCreated: 78345635992342,
  datePublished: 873465736583,
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
  tags: postTags,
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
