import { randomUUID } from "node:crypto";
import { Worker } from "node:worker_threads";

import { describe, expect, it, beforeEach, jest } from "@jest/globals";

import deletePostTags from "..";
// import deletePostTagsWorker from "../deletePostTagsWorker";
import { mockContext, info, spyDb } from "@tests";

const uuid = randomUUID();
const tagIds = [randomUUID(), randomUUID(), randomUUID(), randomUUID()];
const dateCreated = "2022-11-07 13:22:43.717+01";
const returnDateCreated = "2022-11-07T12:22:43.717Z";
const dateModified = "2022-12-15 02:00:15.126+01";
const returnDateModified = "2022-12-15T01:00:15.126Z";

const mockTag1 = { id: tagIds[0], name: "tag1" };
const mockTag2 = { id: tagIds[1], name: "tag2" };
const mockTag3 = { id: tagIds[2], name: "tag3" };
const mockTag4 = { id: tagIds[3], name: "tag4" };

const dbTag1 = { ...mockTag1, dateCreated, lastModified: null };
const dbTag2 = { ...mockTag2, dateCreated, lastModified: dateModified };
const dbTag3 = { ...mockTag3, dateCreated, lastModified: null };
const dbTag4 = { ...mockTag4, dateCreated, lastModified: null };

const tag1 = {
  ...mockTag1,
  dateCreated: returnDateCreated,
  lastModified: null,
};

const tag2 = {
  ...mockTag2,
  dateCreated: returnDateCreated,
  lastModified: returnDateModified,
};

const tag3 = {
  ...mockTag3,
  dateCreated: returnDateCreated,
  lastModified: null,
};

const tag4 = {
  ...mockTag4,
  dateCreated: returnDateCreated,
  lastModified: null,
};

// jest.mock("../deletePostTagsWorker");
jest.mock("node:worker_threads");

beforeEach(() => {
  mockContext.user = "logged_In_User_Id";
});

describe("Test delete post tags resolver", () => {
  it("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await deletePostTags(
      {},
      { tagIds: [uuid, uuid, uuid] },
      mockContext,
      info
    );

    expect(Worker).not.toHaveBeenCalled();
    // expect(deletePostTagsWorker).not.toHaveBeenCalled();

    expect(result).toHaveProperty("message", "Unable to delete post tags");
    expect(result).toHaveProperty("status", "ERROR");
  });

  it.each([
    ["empty input array", [], "No post tags were provided"],
    [
      "array of empty whitespace & empty strings",
      ["   ", ""],
      "Input tags cannot contain empty values",
    ],
    [
      "array of duplicate input strings",
      [uuid, uuid],
      "Input tags can only contain unique tag ids",
    ],
    [
      "array input that exceeds maximum limit of 10",
      [
        ...tagIds,
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
      ],
      "Input tags can only contain at most 10 tags",
    ],
    [
      "array input with invalid uuid post tags",
      ["id1", "id2"],
      "Invalid post tag id",
    ],
  ])("Returns error for %s", async (_, data, errorMsg) => {
    const result = await deletePostTags(
      {},
      { tagIds: data },
      mockContext,
      info
    );

    expect(Worker).not.toHaveBeenCalled();
    // expect(deletePostTagsWorker).not.toHaveBeenCalled();

    expect(result).toHaveProperty("tagIdsError", errorMsg);
    expect(result).toHaveProperty("status", "ERROR");
  });

  it.each([
    ["unknown user", [], [uuid], "tag"],
    [
      "unregistered user account",
      [{ isRegistered: false }],
      [uuid, randomUUID()],
      "tags",
    ],
  ])("Should return error on %s", async (_, data, ids, tagOrTags) => {
    const spy = spyDb({ rows: data });

    const result = await deletePostTags({}, { tagIds: ids }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveNthReturnedWith(1, { rows: data });

    expect(Worker).not.toHaveBeenCalled();
    // expect(deletePostTagsWorker).not.toHaveBeenCalled();

    expect(result).toHaveProperty(
      "message",
      `Unable to delete post ${tagOrTags}`
    );
    expect(result).toHaveProperty("status", "ERROR");
  });

  it("Deletes all post tags provided in the input array", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [dbTag1, dbTag2, dbTag3, dbTag4] });

    const result = await deletePostTags({}, { tagIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, {
      rows: [dbTag1, dbTag2, dbTag3, dbTag4],
    });

    expect(result).toHaveProperty("tags", [tag1, tag2, tag3, tag4]);
    expect(result).toHaveProperty("status", "SUCCESS");

    expect(Worker).toHaveBeenCalledTimes(1);
    // expect(deletePostTagsWorker).toHaveBeenCalledTimes(1);
    // expect(deletePostTagsWorker).toHaveBeenCalledWith([tag1, tag2, tag3, tag4]);
  });

  it("Should return warning message if at least one post tag could not be deleted", async () => {
    const testTagIds = [dbTag2, dbTag4];
    const errorMsg =
      "tag2 and 1 other post tag deleted. 2 post tags could not be deleted";

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: testTagIds });

    const result = await deletePostTags({}, { tagIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: testTagIds });

    expect(result).toHaveProperty("tags", [tag2, tag4]);
    expect(result).toHaveProperty("message", errorMsg);
    expect(result).toHaveProperty("status", "WARN");

    expect(Worker).toHaveBeenCalledTimes(1);
    // expect(deletePostTagsWorker).toHaveBeenCalledTimes(1);
    // expect(deletePostTagsWorker).toHaveBeenCalledWith([tag2, tag4]);
  });

  it("Should return error if no post tag could be deleted", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [] });

    const result = await deletePostTags({}, { tagIds }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });

    expect(Worker).not.toHaveBeenCalled();
    // expect(deletePostTagsWorker).not.toHaveBeenCalled();

    expect(result).toHaveProperty(
      "message",
      "The provided post tags could not be deleted"
    );
    expect(result).toHaveProperty("status", "ERROR");
  });
});
