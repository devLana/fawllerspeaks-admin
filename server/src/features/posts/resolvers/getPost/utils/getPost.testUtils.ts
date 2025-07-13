import { randomUUID } from "node:crypto";

type GQL = [
  string,
  boolean | number | [] | Record<string, unknown> | undefined | null
];

export const validations: [string, string][] = [
  [
    "Expect an error object response when the slug input provided is an empty string",
    "",
  ],
  [
    "Expect an error object response when the slug input provided is an empty whitespace string",
    "   ",
  ],
];

export const gqlValidations: GQL[] = [
  [
    "Expect the API to throw a query validation error if the slug input value is null",
    null,
  ],
  [
    "Expect the API to throw a query validation error if the slug input value is undefined",
    undefined,
  ],
  [
    "Expect the API to throw a query validation error if the slug input value is a number",
    59,
  ],
  [
    "Expect the API to throw a query validation error if the slug input is a boolean value",
    true,
  ],
  [
    "Expect the API to throw a query validation error if the slug input is an array",
    [],
  ],
  [
    "Expect the API to throw a query validation error if the slug input is an object",
    {},
  ],
];

const dateCreated = "2021-05-17T12:22:43.717Z";
const lastModified = "2021-05-27T12:22:43.717Z";

export const data = {
  id: randomUUID(),
  title: "post title",
  description: "post description",
  excerpt: "post excerpt",
  content: "post content",
  author: "Author Name image/url/string",
  status: "Unpublished",
  url: "blog-post-slug",
  imageBanner: null,
  dateCreated,
  datePublished: null,
  lastModified,
  views: 10,
  binnedAt: null,
  tags: [
    { id: "1", name: "tag1", dateCreated, lastModified },
    { id: "2", name: "tag2", dateCreated, lastModified },
    { id: "3", name: "tag3", dateCreated, lastModified },
  ],
};
