// import { Worker } from "node:worker_threads";

// import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import { describe, expect, it, beforeEach } from "@jest/globals";

import deletePostTags from "..";
// import deletePostTagsWorker from "../deletePostTagsWorker";
import {
  tag1,
  tag2,
  tag3,
  tag4,
  tagIds,
  uuid,
  validations,
  verifyUser,
} from "../utils/deletePostTags.testUtils";
import spyDb from "@tests/spyDb";
import { mockContext, info } from "@tests/resolverArguments";

// jest.mock("../deletePostTagsWorker");
// jest.mock("node:worker_threads");

beforeEach(() => {
  mockContext.user = "logged_In_User_Id";
});

describe("Test delete post tags resolver", () => {
  describe("Verify user authentication", () => {
    it("Should return an error response if the user is not logged in", async () => {
      mockContext.user = null;

      const result = await deletePostTags(
        {},
        { tagIds: [uuid, uuid, uuid] },
        mockContext,
        info
      );

      // expect(Worker).not.toHaveBeenCalled();
      // expect(deletePostTagsWorker).not.toHaveBeenCalled();

      expect(result).toHaveProperty("message", "Unable to delete post tags");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    it.each(validations)("Returns error for %s", async (_, data, errorMsg) => {
      const result = await deletePostTags(
        {},
        { tagIds: data },
        mockContext,
        info
      );

      // expect(Worker).not.toHaveBeenCalled();
      // expect(deletePostTagsWorker).not.toHaveBeenCalled();

      expect(result).toHaveProperty("tagIdsError", errorMsg);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    it.each(verifyUser)("%s", async (_, data, ids, tagOrTags) => {
      const spy = spyDb({ rows: data });

      const result = await deletePostTags(
        {},
        { tagIds: ids },
        mockContext,
        info
      );

      // expect(Worker).not.toHaveBeenCalled();
      // expect(deletePostTagsWorker).not.toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: data });
      expect(result).toHaveProperty(
        "message",
        `Unable to delete post ${tagOrTags}`
      );
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Delete post tags", () => {
    it("Should delete all post tags provided in the input array", async () => {
      const mock = [tag1, tag2, tag3, tag4];
      const returnMock = [tag1.id, tag2.id, tag3.id, tag4.id];
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: mock });

      const result = await deletePostTags({}, { tagIds }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: mock });
      expect(result).toHaveProperty("tagIds", returnMock);
      expect(result).toHaveProperty("status", "SUCCESS");

      // expect(Worker).toHaveBeenCalledTimes(1);
      // expect(deletePostTagsWorker).toHaveBeenCalledTimes(1);
      // expect(deletePostTagsWorker).toHaveBeenCalledWith(mock);
    });

    it("Delete post tags, Return a message if at least one post tag could not be deleted", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [tag2, tag4] });

      const result = await deletePostTags({}, { tagIds }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [tag2, tag4] });
      expect(result).toHaveProperty("tagIds", [tag2.id, tag4.id]);
      expect(result).toHaveProperty("status", "WARN");
      expect(result).toHaveProperty(
        "message",
        "tag2 and 1 other post tag deleted. 2 post tags could not be deleted"
      );

      // expect(Worker).toHaveBeenCalledTimes(1);
      // expect(deletePostTagsWorker).toHaveBeenCalledTimes(1);
      // expect(deletePostTagsWorker).toHaveBeenCalledWith([tag2, tag4]);
    });
  });

  describe("No post tag was deleted", () => {
    it("Should return an error response if no post tag could be deleted", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: [] });

      const result = await deletePostTags({}, { tagIds }, mockContext, info);

      // expect(Worker).not.toHaveBeenCalled();
      // expect(deletePostTagsWorker).not.toHaveBeenCalled();

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: [] });
      expect(result).toHaveProperty("status", "ERROR");
      expect(result).toHaveProperty(
        "message",
        "The provided post tags could not be deleted"
      );
    });
  });
});
