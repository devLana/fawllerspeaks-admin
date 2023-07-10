import { randomUUID } from "node:crypto";
import { urls } from "@utils";

type Table1Contents = [string, string, string];
type Table2Contents = [string, { rows: Record<string, unknown>[] }];
type Table3Contents = [string, { authorId: string; status?: string }, string];

export type MockPostTags = { id: string; name: string }[];

export const UUID = randomUUID();
export const userId = "logged_in_user_id";

export const mockTags = ["1", "2", "3", "4"];

export const mockPostTags: MockPostTags = [
  { id: "1", name: "tag1" },
  { id: "2", name: "tag2" },
  { id: "3", name: "tag3" },
  { id: "4", name: "tag4" },
];

export const post = {
  authorId: userId,
  status: "Published",
  authorName: "Ade Lana",
};

export const data = {
  title: "title",
  description: "description",
  content: "content",
  imageBanner: null,
  dateCreated: 5767653,
  lastModified: null,
  views: 10,
  likes: 11,
  isInBin: false,
  isDeleted: false,
};

export const returnData = {
  ...data,
  id: UUID,
  author: post.authorName,
  status: "Unpublished",
  datePublished: null,
  url: `${urls.siteUrl}/blog/sl-ug`,
  slug: "SL.UG",
  tags: mockPostTags,
};

export const testsTable1: Table1Contents[] = [
  ["empty", "", "Provide post id"],
  ["empty whitespace", "   ", "Provide post id"],
  ["invalid uuid", "post_id", "Invalid post id"],
];

export const testsTable2: Table2Contents[] = [
  ["unknown user", { rows: [] }],
  ["unregistered user", { rows: [{ isRegistered: false }] }],
  ["unknown post id", { rows: [{ isRegistered: true }] }],
];

export const testsTable3: Table3Contents[] = [
  [
    "logged in user is not the same as post author",
    { authorId: "not_post_author_id" },
    "Cannot unpublish another author's post",
  ],
  [
    "post is unpublished",
    { authorId: userId, status: "Unpublished" },
    "Post is currently unpublished",
  ],
  [
    "post status is not 'Published'",
    { authorId: userId, status: "Draft" },
    "Only published posts can be unpublished",
  ],
];
