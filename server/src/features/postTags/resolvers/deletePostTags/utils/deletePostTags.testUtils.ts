import { randomUUID } from "node:crypto";

export const uuid = randomUUID();
export const tagIds = [randomUUID(), randomUUID(), randomUUID(), randomUUID()];

const dateCreated = "2022-11-07 13:22:43.717+01";
const dateModified = "2022-12-15 02:00:15.126+01";

const mockTag1 = { id: tagIds[0], name: "tag1" };
const mockTag2 = { id: tagIds[1], name: "tag2" };
const mockTag3 = { id: tagIds[2], name: "tag3" };
const mockTag4 = { id: tagIds[3], name: "tag4" };

export const tag1 = { ...mockTag1, dateCreated, lastModified: null };
export const tag2 = { ...mockTag2, dateCreated, lastModified: dateModified };
export const tag3 = { ...mockTag3, dateCreated, lastModified: null };
export const tag4 = { ...mockTag4, dateCreated, lastModified: null };

export const gqlValidate: [string, unknown][] = [
  ["Should throw a graphql validation error for a null input", null],
  ["Should throw a graphql validation error for an undefined input", undefined],
  ["Should throw a graphql validation error for a boolean input", true],
  [
    "Should throw a graphql validation error for an array of invalid inputs",
    [false, 90, {}, []],
  ],
];

export const validations: [string, string[], string][] = [
  [
    "Should return a validation error if the input array is empty",
    [],
    "No post tag provided",
  ],
  [
    "Should return a validation error for an array of empty strings or empty whitespace strings",
    ["", "   "],
    "Input tag ids cannot be empty strings",
  ],
  [
    "Should return a validation error if the strings in the input array are not unique ids",
    [randomUUID(), uuid, uuid],
    "No duplicate tags allowed. Input tag ids must be unique",
  ],
  [
    "Should return a validation error if the array input contains an invalid post tag id",
    ["id1", "id2"],
    "Invalid post tag id",
  ],
];

export const verifyUser: [
  string,
  Record<string, boolean>[],
  string[],
  string
][] = [
  ["Should return an error response if the user is unknown", [], [uuid], "tag"],
  [
    "Should return an error response if the user is unregistered",
    [{ isRegistered: false }],
    [uuid, randomUUID()],
    "tags",
  ],
];
