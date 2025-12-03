import { randomUUID } from "node:crypto";

type Tuple = [string, string[], string];

const UUID = randomUUID();
export const postIds = [UUID, randomUUID(), randomUUID(), randomUUID()];

export const validationsTable: Tuple[] = [
  ["empty input array", [], "No post ids provided"],
  [
    "array of empty whitespace & empty id strings",
    ["   ", ""],
    "Input post ids cannot be empty values",
  ],
  [
    "array of duplicate id strings",
    [UUID, UUID],
    "Input post ids can only contain unique ids",
  ],
  [
    "array input that exceeds maximum limit of 10",
    [
      ...postIds,
      randomUUID(),
      randomUUID(),
      randomUUID(),
      randomUUID(),
      randomUUID(),
      randomUUID(),
      randomUUID(),
    ],
    "Input post ids can only contain at most 10 ids",
  ],
  ["array input with invalid uuid post ids", ["id1", "id2"], "Invalid post id"],
];
