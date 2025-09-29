import { randomUUID } from "node:crypto";

const UUID = randomUUID();
export const postId = UUID;

export const validations: [string, string, string][] = [
  [
    "Expect an error object response when the post id input provided is an empty string",
    "",
    "Provide post id",
  ],
  [
    "Expect an error object response when the post id input provided is an empty whitespace string",
    "   ",
    "Provide post id",
  ],
  [
    "Expect an error object response when the post id input provided is an invalid uuid string",
    "post_id",
    "Invalid post id",
  ],
];

export const verifyUser: [string, object[]][] = [
  ["Expect an error object if the user is an unknown user", []],
  [
    "Expect an error object if the user is an unregistered user",
    [{ isRegistered: false }],
  ],
];

export const verifyPost: [string, object[], string][] = [
  [
    "Expect an error object if no post could be found with th provided post id",
    [],
    "Unable to move post to bin",
  ],
  [
    "Expect an error object if the post has already been moved to bin",
    [{ is_in_bin: true }],
    "This blog post has already been sent to bin",
  ],
];

const dateCreated = "2021-05-17 13:22:43.717+01";
const datePublished = "2021-06-11 09:44:02.213+01";
const lastModified = "2023-02-14 20:18:59.953+01";
const binnedAt = "2024-11-01 12:13:14.053+01";

const tags = [
  { id: "1", name: "tag1", dateCreated, lastModified },
  { id: "2", name: "tag2", dateCreated, lastModified: null },
  { id: "3", name: "tag3", dateCreated, lastModified },
  { id: "4", name: "tag4", dateCreated, lastModified: null },
];

export const post1 = {
  id: postId,
  title: "Post Title 1",
  description: "Post Title 1 Description",
  excerpt: "Post Title 1 Excerpt",
  content: "<h2>HTML Heading</h2><p>html string</p>",
  author: { image: "/path/to/user/avatar/image.jpg", name: "Author Name" },
  status: "Published",
  url: { slug: "post-title-1", href: "post-title-1" },
  imageBanner: "path/to/post/image/banner/image.jpeg",
  dateCreated,
  datePublished,
  lastModified: null,
  views: 10,
  isBinned: true,
  binnedAt,
  tags,
};
