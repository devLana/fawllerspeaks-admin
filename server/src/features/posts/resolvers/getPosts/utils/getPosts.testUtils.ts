import type { InputErrors } from "@types";
import type { QueryGetPostsArgs as Args } from "@resolverTypes";

type IntErrors = InputErrors<NonNullable<Args["filters"] & Args["page"]>>;

export const intValidations: [string, object, IntErrors][] = [
  [
    "Expect a validation error when empty strings and an invalid post tag id is passed",
    {
      page: { cursor: "", type: "" },
      filters: { q: "", postTag: 1.5, sort: "", status: "" },
    },
    {
      cursorError: "Posts pagination cursor is required",
      typeError: "Invalid posts pagination type provided",
      qError: "No posts search filter was provided",
      postTagError: "The provided post tag id must be an integer",
      statusError: "Invalid post status filter provided",
      sortError: "Invalid post sort filter provided",
    },
  ],
  [
    "Expect a validation error when empty whitespace strings and an invalid post tag id is passed",
    {
      page: { cursor: "  ", type: "    " },
      filters: { q: "    ", postTag: 0, sort: "   ", status: "    " },
    },
    {
      cursorError: "Posts pagination cursor is required",
      typeError: "Invalid posts pagination type provided",
      qError: "No posts search filter was provided",
      postTagError: "Only positive post tag id numbers are allowed",
      statusError: "Invalid post status filter provided",
      sortError: "Invalid post sort filter provided",
    },
  ],
  [
    "Expect a validation error message when the cursor is not a base64 string, postTag id is zero, and the type, status and sort filters are invalid",
    {
      page: { cursor: "12cursor34", type: "not-after" },
      filters: { postTag: -484, status: "invalidStatus", sort: "invalid-sort" },
    },
    {
      cursorError: "Invalid posts pagination cursor provided",
      typeError: "Invalid posts pagination type provided",
      qError: undefined,
      postTagError: "Only positive post tag id numbers are allowed",
      statusError: "Invalid post status filter provided",
      sortError: "Invalid post sort filter provided",
    },
  ],
];

export const gqlValidations: [string, object][] = [
  [
    "When invalid input types are provided, Expect the API to throw a GraphQL validation error",
    {
      page: { type: [], cursor: 23 },
      filters: { q: true, sort: false, postTag: {}, status: [] },
    },
  ],
  [
    "When invalid input types are provided to enum input fields, Expect the API to throw a GraphQL validation error",
    {
      page: { type: "", cursor: "   " },
      filters: { sort: "", postTag: "d", status: "" },
    },
  ],
];

export const e2eValidations: [string, Args, object][] = [
  [
    "Expect a validation error when an invalid postTag id, and an empty string is passed to the cursor and q filter",
    {
      page: { cursor: "", type: "before" },
      filters: { q: "", sort: "title_asc", status: "Published" },
    },
    {
      cursorError: "Posts pagination cursor is required",
      typeError: null,
      qError: "No posts search filter was provided",
      postTagError: null,
      statusError: null,
      sortError: null,
    },
  ],
  [
    "Expect a validation error when an invalid postTag id, and an empty whitespace string is passed to the cursor and q filter",
    {
      page: { cursor: "    ", type: "before" },
      filters: { q: "    ", postTag: 0, sort: "title_asc", status: "Draft" },
    },
    {
      cursorError: "Posts pagination cursor is required",
      typeError: null,
      qError: "No posts search filter was provided",
      postTagError: "Only positive post tag id numbers are allowed",
      statusError: null,
      sortError: null,
    },
  ],
  [
    "Expect a validation error when a non-base64 string is passed as the cursor string and a negative id number is passed as the postTag filter",
    {
      page: { cursor: "5757hjbfjh%", type: "after" },
      filters: { q: "q", postTag: -5, sort: "date_asc", status: "Unpublished" },
    },
    {
      cursorError: "Invalid posts pagination cursor provided",
      typeError: null,
      qError: null,
      postTagError: "Only positive post tag id numbers are allowed",
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
  { id: 1, tagId: "id-1", name: "tag1", dateCreated, lastModified: null },
  { id: 2, tagId: "id-2", name: "tag2", dateCreated, lastModified },
  { id: 3, tagId: "id-3", name: "tag3", dateCreated, lastModified: null },
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

export const filters: Args["filters"] = {
  q: "jkghdjkgh",
  status: "Unpublished",
  postTag: 100,
  sort: "title_asc",
};
