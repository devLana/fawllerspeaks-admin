import { randomUUID } from "node:crypto";

interface Input {
  tagId: string;
  name: string;
}

type InputErrors = [string | null | undefined, string | null | undefined];
type Validations = [string, Input, InputErrors][];

export const gqlValidations: [string, Record<string, unknown>][] = [
  [
    "Should throw a graphql validation error for null inputs",
    { tagId: null, name: null },
  ],
  [
    "Should throw a graphql validation error for undefined inputs",
    { tagId: undefined, name: undefined },
  ],
  [
    "Should throw a graphql validation error for boolean inputs",
    { tagId: false, name: true },
  ],
  [
    "Should throw a graphql validation error for number inputs",
    { tagId: 200, name: 123 },
  ],
];

export const validations = (nullOrUndefined: null | undefined): Validations => [
  [
    "Should return a validation error for empty tag id and name input strings",
    { tagId: "", name: "" },
    ["Provide post tag id", "Provide post tag name"],
  ],
  [
    "Should return a validation error for empty whitespace tag id and name input strings",
    { tagId: " ", name: "    " },
    ["Provide post tag id", "Provide post tag name"],
  ],
  [
    "Should return a validation error for an invalid post tag id",
    { tagId: "tagId", name: "name" },
    ["Invalid post tag id", nullOrUndefined],
  ],
];

export const tag = { name: "NAME", tagId: randomUUID() };
export const lowerTag = { name: "na_me", id: tag.tagId };
export const newTag = { ...tag, name: "new tag name" };
export const dateCreated = "2022-11-07 13:22:43.717+01";
export const lastModified = "2022-12-15 02:00:15.126+01";

export const mockData = {
  name: tag.name,
  id: tag.tagId,
  tagId: 3456,
  dateCreated,
  lastModified: null,
};

export const mockTag = {
  name: newTag.name,
  id: newTag.tagId,
  tagId: 1045,
  dateCreated,
  lastModified: null,
};

export const verifyUser: [string, Record<string, boolean>[]][] = [
  ["Should return an error response if the user is unknown", []],
  [
    "Should return an error response if the user is unregistered",
    [{ isRegistered: false }],
  ],
];
