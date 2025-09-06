import type { InputErrors } from "@types";
import type { QueryGetPostsArgs as Args } from "@resolverTypes";

type IntErrors = InputErrors<NonNullable<Args>>;

export const intValidations: [string, object, IntErrors][] = [
  [
    "Expect a validation error when empty input strings are passed and page size is less than 6",
    { after: "", size: 0, sort: "", status: "" },
    {
      afterError: "Posts pagination after cursor cannot be an empty string",
      sizeError: "Posts pagination page size must be at least 6",
      sortError: "Invalid post sort filter provided",
      statusError: "Invalid post status filter provided",
    },
  ],
  [
    "Expect a validation error when empty whitespace input strings are passed and page size is greater than 30",
    { after: "  ", size: 90, sort: "  ", status: " " },
    {
      afterError: "Posts pagination after cursor cannot be an empty string",
      sizeError: "Posts pagination page size is too large. Maximum is 30",
      sortError: "Invalid post sort filter provided",
      statusError: "Invalid post status filter provided",
    },
  ],
  [
    "Expect a validation error message when the page size, sort and status filters have invalid values",
    {
      after: "12cursor34",
      size: "not-after",
      sort: "invalid-sort",
      status: "invalidStatus",
    },
    {
      afterError: undefined,
      sizeError: "Invalid page size provided. Only numbers allowed",
      sortError: "Invalid post sort filter provided",
      statusError: "Invalid post status filter provided",
    },
  ],
];

export const e2eValidations: [string, Args, IntErrors][] = [
  [
    "Expect a validation error when the after cursor is an empty string and page size is less than 6",
    { after: "", size: 3, sort: "title_asc", status: "Published" },
    {
      afterError: "Posts pagination after cursor cannot be an empty string",
      sizeError: "Posts pagination page size must be at least 6",
      sortError: null,
      statusError: null,
    },
  ],
  [
    "Expect a validation error when the after cursor is an empty whitespace string and page size is more than 30",
    { after: "   ", size: 56, sort: "date_desc", status: "Draft" },
    {
      afterError: "Posts pagination after cursor cannot be an empty string",
      sizeError: "Posts pagination page size is too large. Maximum is 30",
      sortError: null,
      statusError: null,
    },
  ],
];

export const verifyUser: [string, object[]][] = [
  ["Expect an error object if the user could not be verified", []],
  [
    "Expect an error object if the user is unregistered",
    [{ isRegistered: false }],
  ],
];

const dateCreated = "2021-05-17 13:22:43.717+01";
const datePublished = "2021-06-11 09:44:02.213+01";
const lastModified = "2023-02-14 20:18:59.953+01";

export const dbPosts = [
  {
    postId: "post-id-1",
    id: 1,
    title: "post title",
    description: "description",
    excerpt: null,
    content: "<p>content</p>",
    author: { name: "firstName lastName", image: "imageBanner" },
    status: "Draft",
    url: { href: "post-title", slug: "post-title" },
    imageBanner: null,
    dateCreated,
    datePublished: null,
    lastModified,
    views: 0,
    isBinned: false,
    binnedAt: null,
    tags: null,
  },
  {
    postId: "post-id-2",
    id: 2,
    title: "new title",
    description: "new description",
    excerpt: "new excerpt",
    content: "<p>new content</p>",
    author: { name: "firstName lastName", image: null },
    status: "Published",
    url: { href: "new-title", slug: "new-title" },
    imageBanner: "imageBanner",
    dateCreated,
    datePublished,
    lastModified,
    views: 10,
    isBinned: false,
    binnedAt: null,
    tags: [
      { id: "id-1", name: "tag1", dateCreated, lastModified: null },
      { id: "id-2", name: "tag2", dateCreated, lastModified },
      { id: "id-3", name: "tag3", dateCreated, lastModified: null },
    ],
  },
];

export const page: Args = { after: "YnVmZmVy", sort: "date_asc" };
export const intFilters: Args = { after: "YnVmZmVy", size: 15 };

export const e2eFilters1: Args = {
  status: "Draft",
  sort: "date_asc",
  size: 6,
};

export const e2eFilters2: Args = {
  after: "YnVmZmVy",
  sort: "title_desc",
  status: "Unpublished",
  size: 30,
};
