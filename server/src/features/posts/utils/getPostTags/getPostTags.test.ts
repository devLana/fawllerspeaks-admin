import { describe, expect, test } from "@jest/globals";
import { spyDb } from "@tests";
import getPostTags from ".";
import { db } from "@lib/db";

const tags1 = ["1", "2", "3", "4", "5"];
const tags2 = ["7", "8", "9", "10", "11"];

const postTags = [
  { tagId: "1", name: "tag1", dateCreated: 746472, lastModified: null },
  { tagId: "2", name: "tag2", dateCreated: 9532, lastModified: 34566 },
  { tagId: "3", name: "tag3", dateCreated: 234, lastModified: 12245 },
  { tagId: "4", name: "tag4", dateCreated: 7876, lastModified: 123567 },
  { tagId: "5", name: "tag5", dateCreated: 123432, lastModified: null },
];

describe("Posts | Get Posts tags", () => {
  test("Returns an array of post tags from an array of post tag ids", async () => {
    const spy = spyDb({ rows: postTags });

    const result = await getPostTags(db, tags1);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith({ rows: postTags });

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(5);
  });

  test("Should return null for an array of unknown post tag ids", async () => {
    const spy = spyDb({ rows: [] });

    const result = await getPostTags(db, tags2);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith({ rows: [] });

    expect(result).toBeNull();
  });
});
