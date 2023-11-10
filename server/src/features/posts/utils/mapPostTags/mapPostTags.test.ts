import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

import mapPostTags from ".";
import type { PostTag } from "@resolverTypes";

const map = new Map<string, PostTag>();
const dateCreated = new Date().toISOString();
const lastModified = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

const postTags: PostTag[] = [
  { id: "1", name: "tag1", dateCreated, lastModified: null },
  { id: "2", name: "tag2", dateCreated, lastModified },
  { id: "3", name: "tag3", dateCreated, lastModified },
  { id: "4", name: "tag4", dateCreated, lastModified },
  { id: "5", name: "tag5", dateCreated, lastModified: null },
];

beforeAll(() => {
  postTags.forEach(postTag => {
    map.set(postTag.id, postTag);
  });
});

afterAll(() => {
  map.clear();
});

describe("Posts | Post tags mapper", () => {
  test("Returns an array of post tags mapped from an array of post tag ids", () => {
    const tags = ["1", "2", "3", "4", "5"];
    const result = mapPostTags(tags, map);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toStrictEqual(postTags);
  });

  test("Should be null on array of unknown tag ids", () => {
    const tags = ["7", "8", "9", "10", "11"];
    const result = mapPostTags(tags, map);

    expect(result).toBeNull();
  });
});
