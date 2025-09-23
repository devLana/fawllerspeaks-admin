import type { QueryGetPostsArgs } from "@apiTypes";
import objectsAreEqual from ".";

describe("objectsAreEqual", () => {
  it("Expect objects with the same properties to be equal", () => {
    const obj1: QueryGetPostsArgs = {
      after: "cursor-1",
      size: 12,
      sort: "date_asc",
      status: "Published",
    };

    const obj2: QueryGetPostsArgs = {
      status: "Published",
      after: "cursor-1",
      sort: "date_asc",
      size: 12,
    };

    const result1 = objectsAreEqual(obj1, obj2);

    expect(result1).toBe(true);

    const obj3: QueryGetPostsArgs = {
      size: 12,
      sort: "date_asc",
      status: "Published",
    };

    const obj4: QueryGetPostsArgs = {
      sort: "date_asc",
      status: "Published",
      size: 12,
    };

    const result2 = objectsAreEqual(obj3, obj4);

    expect(result2).toBe(true);
  });

  it("Expect objects with different properties to be unequal", () => {
    const obj1: QueryGetPostsArgs = {
      after: "cursor-1",
      size: 12,
      sort: "date_asc",
      status: "Published",
    };

    const obj2: QueryGetPostsArgs = {
      after: "cursor-1",
      sort: "date_asc",
      size: 12,
    };

    const result1 = objectsAreEqual(obj1, obj2);

    expect(result1).toBe(false);

    const obj3: QueryGetPostsArgs = {
      size: 12,
      sort: "date_asc",
      after: "cursor-1",
    };

    const obj4: QueryGetPostsArgs = {
      sort: "date_asc",
      status: "Published",
      size: 12,
    };

    const result2 = objectsAreEqual(obj3, obj4);

    expect(result2).toBe(false);
  });
});
