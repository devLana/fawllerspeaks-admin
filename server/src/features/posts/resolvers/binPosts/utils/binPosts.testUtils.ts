import { randomUUID } from "node:crypto";

const UUID = randomUUID();

export const validations: [string, string[], string][] = [
  [
    "Expect a validation error response if the input is an empty array",
    [],
    "No post ids provided",
  ],
  [
    "Expect a validation error response if the input is an array of empty strings and/or empty whitespace strings",
    ["   ", ""],
    "Input post ids cannot be empty values",
  ],
  [
    "Expect a validation error response if the input array contains duplicate id strings",
    [UUID, UUID],
    "Input post ids can only contain unique ids",
  ],
  [
    "Expect a validation error response if the input array contains invalid post ids",
    ["id1", "id2"],
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

export const postIds = [UUID, randomUUID(), randomUUID(), randomUUID()];
const post = {
  content: "<h2>HTML Heading</h2><p>html string</p>",
  author: { image: "/path/to/user/avatar/image.jpg", name: "Author Name" },
  imageBanner: "path/to/post/image/banner/image.jpeg",
  binnedAt,
  tags,
};

export const post1 = {
  ...post,
  id: postIds[0],
  title: "Post Title 1",
  description: "Post Title 1 Description",
  excerpt: "Post Title 1 Excerpt",
  status: "Published",
  url: { slug: "post-title-1", href: "post-title-1" },
  dateCreated,
  datePublished,
  lastModified: null,
  views: 10,
};

export const post2 = {
  id: postIds[1],
  title: "Post Title 2",
  description: "Post Title 2 Description",
  excerpt: "Post Title 2 Excerpt",
  status: "Unpublished",
  url: { slug: "post-title-2", href: "post-title-2" },
  dateCreated,
  datePublished: null,
  lastModified,
  views: 22,
  tags: null,
};

export const post3 = {
  id: postIds[2],
  title: "Post Title 3",
  description: "Post Title 3 Description",
  excerpt: "Post Title 3 Excerpt",
  status: "Published",
  url: { slug: "post-title-3", href: "post-title-3" },
  dateCreated,
  datePublished,
  lastModified,
  views: 1000,
};

export const post4 = {
  id: postIds[3],
  title: "Post Title 4",
  description: "Post Title 4 Description",
  excerpt: "Post Title 4 Excerpt",
  content: null,
  status: "Draft",
  url: { slug: "post-title-4", href: "post-title-4" },
  dateCreated,
  datePublished: null,
  lastModified: null,
  views: 0,
  tags: null,
};
