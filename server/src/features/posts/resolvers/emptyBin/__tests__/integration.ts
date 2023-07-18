import { describe, expect, test, beforeEach } from "@jest/globals";

import emptyBin from "..";

import { mockContext, info, spyDb } from "@tests";
import {
  dbPost1,
  dbPost2,
  name,
  dbPostTags,
  returnPost1,
  returnPost2,
} from "../testsData";

beforeEach(() => {
  mockContext.user = "logged_In_User_Id";
});

describe("Test empty bin resolver", () => {
  test("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await emptyBin({}, {}, mockContext, info);

    expect(result).toHaveProperty(
      "message",
      "Unable to empty all posts from bin"
    );
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each([
    ["unknown user", []],
    ["unregistered user", [{ isRegistered: false }]],
  ])("Should return error on %s", async (_, userData) => {
    const spy = spyDb({ rows: userData });
    spy.mockReturnValueOnce({ rows: [] });

    const data = await emptyBin({}, {}, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: userData });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });

    expect(data).toHaveProperty(
      "message",
      "Unable to empty all posts from bin"
    );
    expect(data).toHaveProperty("status", "ERROR");
  });

  test("Expect nothing to happen if user has no posts in their bin", async () => {
    const spyData = [{ isRegistered: true, name }];
    const message = "You have no posts in your bin to delete";
    const spy = spyDb({ rows: spyData });
    spy.mockReturnValueOnce({ rows: dbPostTags });
    spy.mockReturnValueOnce({ rows: [] });

    const data = await emptyBin({}, {}, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: spyData });
    expect(spy).toHaveNthReturnedWith(2, { rows: dbPostTags });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });

    expect(data).toHaveProperty("message", message);
    expect(data).toHaveProperty("status", "WARN");
  });

  test("Should empty all posts from bin", async () => {
    const spyData = [{ isRegistered: true, name }];
    const spy = spyDb({ rows: spyData });
    spy.mockReturnValueOnce({ rows: dbPostTags });
    spy.mockReturnValueOnce({ rows: [dbPost1, dbPost2] });

    const data = await emptyBin({}, {}, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: spyData });
    expect(spy).toHaveNthReturnedWith(2, { rows: dbPostTags });
    expect(spy).toHaveNthReturnedWith(3, { rows: [dbPost1, dbPost2] });

    expect(data).toHaveProperty("posts", [returnPost1, returnPost2]);
    expect(data).toHaveProperty("status", "SUCCESS");
  });
});
