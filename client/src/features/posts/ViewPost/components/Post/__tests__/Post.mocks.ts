import { testPostTag } from "@utils/tests/testPostTag";
import type { PostData } from "types/posts";

export const menuBtn = { name: /^test blog post post actions$/i };
export const status = /^post status - draft$/i;
export const heading = { name: /^Test Blog Post$/i };
export const metadataList = { name: /^post metadata$/i };
export const tagsList = { name: /^post tags$/i };
export const tOC = { name: /^table of contents$/i };
export const link1 = { name: /^blog post$/i };
export const link2 = { name: /^blog post heading$/i };
export const img = { name: /^Test Blog Post image banner$/i };
export const avatar = { name: /^first name$/i };
export const author = /^first name$/i;
export const content = { name: /^post content$/i };
export const postTags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6"];
const tags = postTags.map((items, index) => testPostTag(items, `${index + 1}`));

type Post = {
  [Prop in keyof PostData]-?: NonNullable<PostData[Prop]>;
};

const postData: Omit<Post, "isBinned" | "binnedAt"> = {
  __typename: "Post",
  id: "id-1",
  title: "Test Blog Post",
  description: "description",
  excerpt: "excerpt",
  content: {
    __typename: "PostContent",
    html: "<h2>Blog Post</h2><p>html content</p><h3>Blog Post Heading</h3><p>more html content</p>",
    tableOfContents: [
      {
        __typename: "PostTableOfContents",
        heading: "Blog Post",
        href: "#blog-post",
        level: 2,
      },
      {
        __typename: "PostTableOfContents",
        heading: "Blog Post Heading",
        href: "#blog-post-heading",
        level: 3,
      },
    ],
  },
  author: {
    __typename: "PostAuthor",
    name: "First Name",
    image: "https://example-image-bucket.com/storage/author.jpg",
  },
  status: "Draft",
  url: {
    __typename: "PostUrl",
    href: "blog post link",
    slug: "test-blog-post",
  },
  imageBanner: "https://example-image-bucket.com/storage/image_banner.jpg",
  dateCreated: new Date().toISOString(),
  datePublished: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  views: 1500,
  tags,
};

export const post1: Post = {
  ...postData,
  isBinned: false,
  binnedAt: "",
};

export const post2: Post = {
  ...postData,
  isBinned: true,
  binnedAt: new Date().toISOString(),
};
