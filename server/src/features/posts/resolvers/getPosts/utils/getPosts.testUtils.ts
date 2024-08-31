import type { InputErrors } from "@types";
import type { QueryGetPostsArgs as Args } from "@resolverTypes";

type IntErrors = InputErrors<NonNullable<Args["filters"] & Args["page"]>>;

export const intValidations: [string, object, IntErrors][] = [
  [
    "Expect a validation error when empty input strings are passed",
    { page: { cursor: "", type: "" }, filters: { sort: "", status: "" } },
    {
      cursorError: "Posts pagination cursor is required",
      typeError: "Invalid posts pagination type provided",
      statusError: "Invalid post status filter provided",
      sortError: "Invalid post sort filter provided",
    },
  ],
  [
    "Expect a validation error when empty whitespace input strings are passed",
    { page: { cursor: "  ", type: " " }, filters: { sort: "  ", status: " " } },
    {
      cursorError: "Posts pagination cursor is required",
      typeError: "Invalid posts pagination type provided",
      statusError: "Invalid post status filter provided",
      sortError: "Invalid post sort filter provided",
    },
  ],
  [
    "Expect a validation error message when the page type, status and sort filters are invalid",
    {
      page: { cursor: "12cursor34", type: "not-after" },
      filters: { status: "invalidStatus", sort: "invalid-sort" },
    },
    {
      cursorError: undefined,
      typeError: "Invalid posts pagination type provided",
      statusError: "Invalid post status filter provided",
      sortError: "Invalid post sort filter provided",
    },
  ],
];

export const gqlValidations: [string, object][] = [
  [
    "When invalid input types are provided, Expect the API to throw a GraphQL validation error",
    { page: { type: [], cursor: 23 }, filters: { sort: false, status: [] } },
  ],
  [
    "When invalid input types are provided to enum input fields, Expect the API to throw a GraphQL validation error",
    { page: { type: "", cursor: "cursor" }, filters: { sort: "", status: "" } },
  ],
];

export const e2eValidations: [string, Args, object][] = [
  [
    "Expect a validation error when an empty string is passed to the cursor, postTag and q filters",
    {
      page: { cursor: "", type: "before" },
      filters: { sort: "title_asc", status: "Published" },
    },
    {
      cursorError: "Posts pagination cursor is required",
      typeError: null,
      statusError: null,
      sortError: null,
    },
  ],
  [
    "Expect a validation error when an empty whitespace string is passed to the cursor, postTag and q filters",
    {
      page: { cursor: "   ", type: "before" },
      filters: { sort: "title_asc", status: "Draft" },
    },
    {
      cursorError: "Posts pagination cursor is required",
      typeError: null,
      statusError: null,
      sortError: null,
    },
  ],
];

export const page: Args["page"] = { cursor: "YnVmZmVy", type: "after" };

const dateCreated = "2021-05-17 13:22:43.717+01";
const datePublished = "2021-06-11 09:44:02.213+01";
const lastModified = "2023-02-14 20:18:59.953+01";

export const tags = [
  { id: "id-1", name: "tag1", dateCreated, lastModified: null },
  { id: "id-2", name: "tag2", dateCreated, lastModified },
  { id: "id-3", name: "tag3", dateCreated, lastModified: null },
];

export const dbPosts = [
  {
    postId: "post-id-1",
    id: 1,
    title: "post title",
    description: "description",
    excerpt: null,
    content: "<p>content</p>",
    author: "firstName lastName imageBanner",
    status: "Draft",
    url: "post-title",
    imageBanner: null,
    dateCreated,
    datePublished: null,
    lastModified,
    views: 0,
    isInBin: false,
    isDeleted: false,
    tags: null,
  },
  {
    postId: "post-id-2",
    id: 2,
    title: "new title",
    description: "new description",
    excerpt: "new excerpt",
    content: "<p>new content</p>",
    author: "firstName lastName ",
    status: "Published",
    url: "new title",
    imageBanner: "imageBanner",
    dateCreated,
    datePublished,
    lastModified,
    views: 10,
    isInBin: false,
    isDeleted: false,
    tags,
  },
];

const filters: Args["filters"] = { status: "Unpublished" };
export const intFilters: Args["filters"] = { ...filters, sort: "date_asc" };
export const e2eFilters: Args["filters"] = { ...filters, sort: "title_asc" };
