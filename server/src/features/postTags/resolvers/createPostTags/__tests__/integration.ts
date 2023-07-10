import { describe, expect, it, beforeEach } from "@jest/globals";

import createPostTags from "..";
import { mockContext, info, spyDb } from "@tests";

const tags = ["tag1", "tag2", "tag3", "tag4"];

const tag1 = {
  id: "100",
  name: tags[0],
  dateCreated: 1,
  lastModified: null,
};

const tag2 = {
  id: "500",
  name: tags[1],
  dateCreated: 10,
  lastModified: null,
};

const tag3 = {
  id: "21",
  name: tags[2],
  dateCreated: 235,
  lastModified: null,
};

const tag4 = {
  id: "436921",
  name: tags[3],
  dateCreated: 51244,
  lastModified: null,
};

beforeEach(() => {
  mockContext.user = "logged_In_User_Id";
});

describe("Test create post tags resolver", () => {
  it("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await createPostTags({}, { tags }, mockContext, info);

    expect(result).toHaveProperty("message", "Unable to create post tags");
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
      ["tag1", "tag 1"],
      "Input tags can only contain unique tags",
    ],
    [
      "array input that exceeds maximum limit of 10",
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"],
      "Input tags can only contain at most 10 tags",
    ],
  ])("Returns error for %s", async (_, data, errorMsg) => {
    const result = await createPostTags({}, { tags: data }, mockContext, info);

    expect(result).toHaveProperty("tagsError", errorMsg);
    expect(result).toHaveProperty("status", "ERROR");
  });

  it.each([
    ["unknown user", [], ["tag1", "tag2"], "tags"],
    ["unregistered user account", [{ isRegistered: false }], ["tag1"], "tag"],
  ])("Should return error on %s", async (_, data, inputTags, msg) => {
    const spy = spyDb({ rows: data });

    const result = await createPostTags(
      {},
      { tags: inputTags },
      mockContext,
      info
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveNthReturnedWith(1, { rows: data });

    expect(result).toHaveProperty("message", `Unable to create post ${msg}`);
    expect(result).toHaveProperty("status", "ERROR");
  });

  it("Creates post tags from input array", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] })
      .mockReturnValueOnce({ rows: [] })
      .mockReturnValueOnce({ rows: [tag1, tag2, tag3, tag4] });

    const result = await createPostTags({}, { tags }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [tag1, tag2, tag3, tag4] });

    expect(result).toHaveProperty("tags", [tag1, tag2, tag3, tag4]);
    expect(result).toHaveProperty("status", "SUCCESS");
  });

  it("Should return warning message if at least one input post tag already exists", async () => {
    const errorMsg =
      "2 post tags created. 'tag1' and 1 other post tag have already been created";

    const spy = spyDb({ rows: [{ isRegistered: true }] })
      .mockReturnValueOnce({ rows: [tag1, tag2] })
      .mockReturnValueOnce({ rows: [tag3, tag4] });

    const result = await createPostTags({}, { tags }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [tag1, tag2] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [tag3, tag4] });

    expect(result).toHaveProperty("tags", [tag3, tag4]);
    expect(result).toHaveProperty("message", errorMsg);
    expect(result).toHaveProperty("status", "WARN");
  });

  it("Should return error if all input post tags already exists", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [tag1, tag2, tag3, tag4] });

    const result = await createPostTags({}, { tags }, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [tag1, tag2, tag3, tag4] });

    expect(result).not.toHaveProperty("tags");

    expect(result).toHaveProperty(
      "message",
      "The provided post tags have already been created"
    );
    expect(result).toHaveProperty("status", "ERROR");
  });
});
