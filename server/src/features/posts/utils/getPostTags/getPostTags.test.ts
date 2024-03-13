import { describe, expect, test } from "@jest/globals";
import spyDb from "@tests/spyDb";
import getPostTags from ".";
import { db } from "@lib/db";

const tags1 = ["1", "2", "3", "4", "5"];
const tags2 = ["7", "8", "9"];

const dateCreated = "2022-11-07 13:22:43.717+01";
export const lastModified = "2022-12-15 02:00:15.126+01";

const postTags = [
  { tagId: "1", name: "tag1", dateCreated, lastModified: null },
  { tagId: "2", name: "tag2", dateCreated, lastModified },
  { tagId: "3", name: "tag3", dateCreated, lastModified },
  { tagId: "4", name: "tag4", dateCreated, lastModified },
  { tagId: "5", name: "tag5", dateCreated, lastModified: null },
];

describe("Posts | Get Posts tags", () => {
  test("Returns an array of post tags from an array of post tag ids", async () => {
    const spy = spyDb({ rows: postTags });

    const result = await getPostTags(db, tags1);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith({ rows: postTags });
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(5);
    expect(result).toStrictEqual(postTags);
  });

  test("Should return null for an array of unknown post tag ids", async () => {
    const spy = spyDb({ rows: [] });

    const result = await getPostTags(db, tags2);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith({ rows: [] });
    expect(result).toBeNull();
  });
});
