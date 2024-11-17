import { describe, expect, it, jest, beforeEach } from "@jest/globals";

import resolver from "..";
import { deleteFiles } from "@utils/deleteFiles";
import * as mocks from "../utils/deletePostContentImages.testUtils";
import spyDb from "@tests/spyDb";
import { mockContext, info } from "@tests/resolverArguments";

type Result = () => Promise<{ error: string | null }>;

jest.mock("@utils/deleteFiles");

beforeEach(() => {
  mockContext.user = "logged_In_User_Id";
});

describe("deletePostContentImages resolver", () => {
  const mockFn = deleteFiles as unknown as jest.MockedFunction<Result>;

  describe("Verify user authentication", () => {
    it("Should return an error response if the user is not logged in", async () => {
      mockContext.user = null;

      const result = await resolver({}, { images: [] }, mockContext, info);

      expect(deleteFiles).not.toHaveBeenCalled();
      expect(result).toHaveProperty("status", "ERROR");

      expect(result).toHaveProperty(
        "message",
        "Unable to delete post content image"
      );
    });
  });

  describe("Validate images user input", () => {
    describe("User input validation", () => {
      it.each(mocks.validations)("%s", async (_, images, errorMsg) => {
        const result = await resolver({}, { images }, mockContext, info);

        expect(deleteFiles).not.toHaveBeenCalled();
        expect(result).toHaveProperty("imagesError", errorMsg);
        expect(result).toHaveProperty("status", "ERROR");
      });
    });

    describe("Images input array validated", () => {
      it("The input uri strings are not storage url strings, Expect an error object response", async () => {
        const images = mocks.nonStorageUris;
        const result = await resolver({}, { images }, mockContext, info);

        expect(deleteFiles).not.toHaveBeenCalled();
        expect(result).toHaveProperty("status", "ERROR");

        expect(result).toHaveProperty(
          "message",
          "Unable to delete post content image"
        );
      });
    });
  });

  describe("Verify user", () => {
    it.each(mocks.verify)("%s", async (_, mock) => {
      const { images } = mocks;
      const spy = spyDb({ rows: mock });
      const result = await resolver({}, { images }, mockContext, info);

      expect(deleteFiles).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: mock });
      expect(result).toHaveProperty("status", "ERROR");

      expect(result).toHaveProperty(
        "message",
        "Unable to delete post content image"
      );
    });
  });

  describe("Delete request failed", () => {
    it("Post content images request failed, Expect an error object response", async () => {
      mockFn.mockResolvedValueOnce({ error: "Request Failed" });

      const { images } = mocks;
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      const result = await resolver({}, { images }, mockContext, info);

      expect(deleteFiles).toHaveBeenCalledTimes(1);
      expect(deleteFiles).toHaveBeenCalledWith(mocks.storageUris);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(result).toHaveProperty("status", "ERROR");

      expect(result).toHaveProperty(
        "message",
        "Unable to delete post content image"
      );
    });
  });

  describe("Images deleted", () => {
    it("Post content images deleted, Expect a success object response", async () => {
      mockFn.mockResolvedValueOnce({ error: null });

      const { images } = mocks;
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      const result = await resolver({}, { images }, mockContext, info);

      expect(deleteFiles).toHaveBeenCalledTimes(1);
      expect(deleteFiles).toHaveBeenCalledWith(mocks.storageUris);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(result).toHaveProperty("status", "SUCCESS");
      expect(result).toHaveProperty("message", "Post content images deleted");
    });
  });
});
