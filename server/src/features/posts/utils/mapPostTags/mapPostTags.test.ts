import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

import mapPostTags from ".";

import type { PostTag } from "@resolverTypes";

const map = new Map<string, PostTag>();

const postTags: PostTag[] = [
  { id: "1", name: "tag1", dateCreated: 746472, lastModified: null },
  { id: "2", name: "tag2", dateCreated: 9532, lastModified: 34566 },
  { id: "3", name: "tag3", dateCreated: 234, lastModified: 12245 },
  { id: "4", name: "tag4", dateCreated: 7876, lastModified: 123567 },
  { id: "5", name: "tag5", dateCreated: 123432, lastModified: null },
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
