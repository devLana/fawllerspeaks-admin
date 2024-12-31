import { describe, it, expect, beforeEach, jest } from "@jest/globals";

import editProfile from "..";
import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import spyDb from "@tests/spyDb";
import { mockContext, info } from "@tests/resolverArguments";
import * as mocks from "../utils/editProfile.testUtils";
import deleteSession from "@utils/deleteSession";

jest.mock("@lib/supabase/supabaseEvent");

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true).mockName("supabaseEvent.emit");

describe("Test edit profile resolver", () => {
  beforeEach(() => {
    mockContext.user = "insane_user_id";
  });

  describe("Verify user authentication", () => {
    it("Should return an error response if the user is not logged in", async () => {
      mockContext.user = null;

      const result = await editProfile({}, mocks.args, mockContext, info);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("message", "Unable to edit user profile");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    it.each(mocks.validations(undefined))("%s", async (_, data, errors) => {
      const result = await editProfile({}, data, mockContext, info);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(result).toHaveProperty("firstNameError", errors.firstNameError);
      expect(result).toHaveProperty("lastNameError", errors.lastNameError);
      expect(result).toHaveProperty("imageError", errors.imageError);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    it.each(mocks.verify)("%s", async (_, data) => {
      spyDb({ rows: data });

      const result = await editProfile({}, mocks.args, mockContext, info);

      expect(result).toHaveProperty("message", "Unable to edit user profile");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Edit the user's profile data, Return updated user details", () => {
    it("Should edit the user's profile without an image", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true, image: null }] });
      spy.mockReturnValueOnce({ rows: [mocks.userData1] });

      const data = await editProfile({}, mocks.args, mockContext, info);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data).toHaveProperty("user.id", "insane_user_id");
      expect(data).toHaveProperty("user.email", "it@mail.com");
      expect(data).toHaveProperty("user.firstName", mocks.args.firstName);
      expect(data).toHaveProperty("user.lastName", mocks.args.lastName);
      expect(data).toHaveProperty("user.image", null);
      expect(data).toHaveProperty("user.isRegistered", true);
      expect(data).toHaveProperty("user.dateCreated", mocks.dateCreated);
      expect(data).toHaveProperty("status", "SUCCESS");
    });

    it("Should edit the user's profile with an image", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true, image: null }] });
      spy.mockReturnValueOnce({ rows: [mocks.userData2] });

      const input = { ...mocks.args, image: mocks.image };
      const data = await editProfile({}, input, mockContext, info);

      expect(mockEvent).not.toHaveBeenCalled();
      expect(data).toHaveProperty("user.id", "insane_user_id");
      expect(data).toHaveProperty("user.email", "it@mail.com");
      expect(data).toHaveProperty("user.firstName", mocks.args.firstName);
      expect(data).toHaveProperty("user.lastName", mocks.args.lastName);
      expect(data).toHaveProperty("user.image", mocks.userData2.image);
      expect(data).toHaveProperty("user.isRegistered", true);
      expect(data).toHaveProperty("user.dateCreated", mocks.dateCreated);
      expect(data).toHaveProperty("status", "SUCCESS");
    });

    it("Should edit user's profile and delete any previously saved image link", async () => {
      const spy = spyDb({ rows: [{ isRegistered: true, image: "old/image" }] });
      spy.mockReturnValueOnce({ rows: [mocks.userData2] });

      await editProfile({}, { ...mocks.args, image: null }, mockContext, info);

      expect(mockEvent).toHaveBeenCalledTimes(1);
    });
  });
});
