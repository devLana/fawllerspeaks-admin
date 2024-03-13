import { it, describe, expect, beforeEach } from "@jest/globals";

import editPostTag from "..";
import { info, mockContext } from "@tests/resolverArguments";
import spyDb from "@tests/spyDb";
import {
  dateCreated,
  lastModified,
  lowerTag,
  mockData,
  mockTag,
  newTag,
  tag,
  validations,
  verifyUser,
} from "../utils/editPostTag.testUtils";

beforeEach(() => {
  mockContext.user = "logged_in_user_id";
});

describe("Test edit post tag resolver", () => {
  describe("Verify user authentication", () => {
    it("Should return an error response if the user is not logged in", async () => {
      mockContext.user = null;

      const result = await editPostTag({}, tag, mockContext, info);

      expect(result).toHaveProperty("message", "Unable to edit post tag");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    it.each(validations(undefined))("%s", async (_, data, errors) => {
      const result = await editPostTag({}, data, mockContext, info);

      expect(result).toHaveProperty("tagIdError", errors[0]);
      expect(result).toHaveProperty("nameError", errors[1]);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user account", () => {
    it.each(verifyUser)("%s", async (_, data) => {
      const spy = spyDb({ rows: data });

      const result = await editPostTag({}, tag, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({ rows: data });
      expect(result).toHaveProperty("message", "Unable to edit post tag");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify post tag id input", () => {
    it("Should return an error response if the post tag id does not exist", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [] });

      const result = await editPostTag({}, tag, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(result).toHaveProperty(
        "message",
        "The post tag you are trying to edit does not exist"
      );
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Respond with an edited post tag warning object", () => {
    it("Should return the same post tag details if the new post tag name equals the old post tag name", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mockData] });

      const result = await editPostTag({}, tag, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [mockData] });
      expect(result).toHaveProperty("tag", mockData);
      expect(result).toHaveProperty("status", "WARN");
      expect(result).toHaveProperty(
        "message",
        "Post tag not updated. New post tag name is the same as the old one"
      );
    });
  });

  describe("Verify post tag name input", () => {
    it("Should return an error response if the provided post tag name already exists", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mockData] });
      spy.mockReturnValueOnce({ rows: [{ name: newTag.name }] });

      const result = await editPostTag({}, newTag, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [mockData] });
      expect(spy).toHaveNthReturnedWith(3, { rows: [{ name: newTag.name }] });

      expect(result).toHaveProperty(
        "message",
        `A post tag with the name "${newTag.name}" already exists`
      );
      expect(result).toHaveProperty("status", "ERROR");
    });

    it("Should return an error response if a similar post tag name already exists", async () => {
      const data = { name: newTag.name.toUpperCase() };
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mockData] });
      spy.mockReturnValueOnce({ rows: [data] });

      const result = await editPostTag({}, newTag, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [mockData] });
      expect(spy).toHaveNthReturnedWith(3, { rows: [data] });
      expect(result).toHaveProperty(
        "message",
        `A similar post tag, "${data.name}", already exists`
      );
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Edit post tag, Update lastModified field", () => {
    it("Should update the post tag if the new post tag name equals old post tag name but differs by case sensitivity", async () => {
      const data = { ...lowerTag, dateCreated, lastModified: null };
      const returnTag = { ...data, dateCreated, lastModified };

      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [data] });
      spy.mockReturnValueOnce({ rows: [returnTag] });

      const result = await editPostTag({}, tag, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [data] });
      expect(spy).toHaveNthReturnedWith(3, { rows: [returnTag] });
      expect(result).toHaveProperty("tag", returnTag);
      expect(result).toHaveProperty("status", "SUCCESS");
    });

    it("Edits the current post tag to a new name", async () => {
      const data = { name: tag.name, id: tag.tagId, dateCreated, lastModified };

      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [mockTag] });
      spy.mockReturnValueOnce({ rows: [] });
      spy.mockReturnValueOnce({ rows: [data] });

      const result = await editPostTag({}, tag, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [mockTag] });
      expect(spy).toHaveNthReturnedWith(3, { rows: [] });
      expect(spy).toHaveNthReturnedWith(4, { rows: [data] });
      expect(result).toHaveProperty("tag", data);
      expect(result).toHaveProperty("status", "SUCCESS");
    });
  });
});
