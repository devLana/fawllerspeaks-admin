import { it, describe, expect, beforeEach } from "@jest/globals";

import getPostTags from "..";
import spyDb from "@tests/spyDb";
import { info, mockContext } from "@tests/resolverArguments";
import { tags, verifyUser } from "../utils/getPostTags.testUtils";

beforeEach(() => {
  mockContext.user = "logged_in_user_id";
});

describe("Test getPostTags resolver", () => {
  describe("Verify user authentication", () => {
    it("Should return an error response if the user is not logged in", async () => {
      mockContext.user = null;

      const result = await getPostTags({}, {}, mockContext, info);

      expect(result).toHaveProperty("message", "Unable to get post tags");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    it.each(verifyUser)("%s", async (_, data) => {
      const spy = spyDb({ rows: data });

      const result = await getPostTags({}, {}, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({ rows: data });
      expect(result).toHaveProperty("message", "Unable to get post tags");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  it("Should return all post tags", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValue({ rows: tags });

    const result = await getPostTags({}, {}, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: tags });
    expect(result).toHaveProperty("tags", tags);
    expect(result).toHaveProperty("status", "SUCCESS");
  });
});
