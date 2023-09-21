import { randomUUID } from "node:crypto";

type Table1Contents = [string, string, string];
type Table2Contents = [string, { rows: Record<string, unknown>[] }];
type Table3Contents = [string, { authorId: string; status?: string }, string];

export type PostTags = { id: string; name: string }[];

export const UUID = randomUUID();
export const userId = "logged_in_user_id";
export const tags = ["1", "2", "3"];

export const mockPostTags: PostTags = [
  { id: "1", name: "tag1" },
  { id: "2", name: "tag2" },
  { id: "3", name: "tag3" },
];

const dateCreated = "2021-05-17 13:22:43.717+01";
export const returnDateCreated = "2021-05-17T12:22:43.717Z";
const datePublished = "2021-06-11 09:44:02.213+01";
export const returnDatePublished = "2021-06-11T08:44:02.213Z";

export const post = {
  authorId: userId,
  status: "Unpublished",
  authorName: "Ade Lana",
};

export const data = {
  title: "title",
  description: "description",
  content: "content",
  imageBanner: null,
  dateCreated,
  datePublished,
  lastModified: null,
  views: 10,
  likes: 11,
  isInBin: false,
  isDeleted: false,
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
    "Cannot publish another author's post",
  ],
  [
    "post has already been published",
    { authorId: userId, status: "Published" },
    "Post has already been published",
  ],
  [
    "post status is not 'Unpublished'",
    { authorId: userId, status: "Draft" },
    "Only unpublished posts can be published",
  ],
];
