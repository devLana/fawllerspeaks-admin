import { randomUUID } from "node:crypto";

import { it, describe, expect, beforeEach } from "@jest/globals";

import editPostTag from "..";
import { spyDb, info, mockContext } from "@tests";

const tag = { name: "NAME", tagId: randomUUID() };
const lowerTag = { name: "name", id: tag.tagId };
const newTag = { ...tag, name: "new name" };

beforeEach(() => {
  mockContext.user = "logged_in_user_id";
});

describe("Test edit post tag resolver", () => {
  it("Should return error on logged out user", async () => {
    mockContext.user = null;

    const result = await editPostTag({}, tag, mockContext, info);

    expect(result).toHaveProperty("message", "Unable to edit post tag");
    expect(result).toHaveProperty("status", "ERROR");
  });

  it.each([
    [
      "empty name & tagId inputs",
      { name: "", tagId: "" },
      ["Provide post tag id", "Provide post tag name"],
    ],
    [
      "empty whitespace name & tag id inputs",
      { name: "  ", tagId: "    " },
      ["Provide post tag id", "Provide post tag name"],
    ],
    [
      "invalid tag id",
      { name: "new tag name", tagId: "invalid_uuid" },
      ["Invalid post tag id", undefined],
    ],
  ])("Returns error for %s", async (_, data, errors) => {
    const result = await editPostTag({}, data, mockContext, info);

    expect(result).toHaveProperty("tagIdError", errors[0]);
    expect(result).toHaveProperty("nameError", errors[1]);
    expect(result).toHaveProperty("status", "ERROR");
  });

  it.each([
    ["unknown", []],
    ["unregistered", [{ isRegistered: false }]],
  ])("Should return error for %s user", async (_, data) => {
    const spy = spyDb({ rows: data });

    const result = await editPostTag({}, tag, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith({ rows: data });

    expect(result).toHaveProperty("message", "Unable to edit post tag");
    expect(result).toHaveProperty("status", "ERROR");
  });

  it("Should return an error if post tag id is unknown", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [] });

    const result = await editPostTag({}, tag, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });

    expect(result).toHaveProperty("message", "Unable to edit unknown post tag");
    expect(result).toHaveProperty("status", "ERROR");
  });

  it("Returns post tag if the new tag name equals old tag name", async () => {
    const tag1 = {
      name: tag.name,
      id: tag.tagId,
      dateCreated: Date.now(),
      lastModified: null,
    };

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [tag1] });

    const result = await editPostTag({}, tag, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [tag1] });

    expect(result).toHaveProperty("tag", tag1);
    expect(result).toHaveProperty("status", "SUCCESS");
  });

  it("Updates post tag(case-insensitive)", async () => {
    const tag1 = {
      ...lowerTag,
      dateCreated: Date.now(),
      lastModified: null,
    };

    const tag2 = {
      name: tag.name,
      id: tag.tagId,
      dateCreated: Date.now(),
      lastModified: Date.now(),
    };

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [tag1] });
    spy.mockReturnValueOnce({ rows: [tag2] });

    const result = await editPostTag({}, tag, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [tag1] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [tag2] });

    expect(result).toHaveProperty("tag", tag2);
    expect(result).toHaveProperty("status", "SUCCESS");
  });

  it("Returns error if provided post tag name already exists", async () => {
    const tag1 = {
      name: tag.name,
      id: tag.tagId,
      dateCreated: Date.now(),
      lastModified: null,
    };

    const tag2 = { name: newTag.name };

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [tag1] });
    spy.mockReturnValueOnce({ rows: [tag2] });

    const result = await editPostTag({}, newTag, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [tag1] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [tag2] });

    expect(result).toHaveProperty(
      "message",
      `A post tag with the name "${newTag.name}" already exists`
    );
    expect(result).toHaveProperty("status", "ERROR");
  });

  it("Returns error if a similar post tag name already exists", async () => {
    const tag1 = {
      name: tag.name,
      id: tag.tagId,
      dateCreated: Date.now(),
      lastModified: null,
    };

    const tag2 = { name: newTag.name.toUpperCase() };

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [tag1] });
    spy.mockReturnValueOnce({ rows: [tag2] });

    const result = await editPostTag({}, newTag, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [tag1] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [tag2] });

    expect(result).toHaveProperty(
      "message",
      `A similar post tag, "${tag2.name}", already exists`
    );
    expect(result).toHaveProperty("status", "ERROR");
  });

  it("Edits the current post tag to a new name", async () => {
    const tag1 = {
      name: newTag.name,
      id: newTag.tagId,
      dateCreated: Date.now(),
      lastModified: null,
    };

    const tag2 = {
      name: tag.name,
      id: tag.tagId,
      dateCreated: Date.now(),
      lastModified: Date.now(),
    };

    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [tag1] });
    spy.mockReturnValueOnce({ rows: [] });
    spy.mockReturnValueOnce({ rows: [tag2] });

    const result = await editPostTag({}, tag, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [tag1] });
    expect(spy).toHaveNthReturnedWith(3, { rows: [] });
    expect(spy).toHaveNthReturnedWith(4, { rows: [tag2] });

    expect(result).toHaveProperty("tag", tag2);
    expect(result).toHaveProperty("status", "SUCCESS");
  });
});
