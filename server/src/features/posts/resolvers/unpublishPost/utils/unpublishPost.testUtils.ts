import { randomUUID } from "node:crypto";

export const UUID = randomUUID();
export const userId = "logged_in_user_id";

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

export const verify: [string, Record<string, unknown>[]][] = [
  ["Expect an error object if the user is unknown", []],
  [
    "Expect an error object if the logged in user is unregistered",
    [{ isRegistered: false }],
  ],
];

export const verifyPost: [string, [string, object[], string]][] = [
  [
    "Verify post id",
    [
      "Expect an error object if the post id is unknown",
      [],
      "Unable to unpublish post",
    ],
  ],
  [
    "Verify post status",
    [
      "Expect an error object if the user tries to unpublish a Draft post",
      [{ isDraft: true }],
      "A Draft post cannot be unpublished",
    ],
  ],
];

export const post = {
  id: UUID,
  title: "title",
  description: "description",
  excerpt: "excerpt",
  content: "<p>html content</p>",
  author: { image: null, name: "Ade Lana" },
  status: "Unpublished",
  url: { href: "title", slug: "title" },
  imageBanner: null,
  dateCreated: "2021-05-17 13:22:43.717+01",
  datePublished: null,
  lastModified: "2022-01-23 04:16:37.424+01",
  views: 10,
  binnedAt: null,
  tags: [
    { id: "1", name: "tag1" },
    { id: "2", name: "tag2" },
    { id: "3", name: "tag3" },
    { id: "4", name: "tag4" },
  ],
};

export const dbPost = { ...post, isDraft: false };
