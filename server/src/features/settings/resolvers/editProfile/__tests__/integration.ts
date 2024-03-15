import {
  describe,
  test,
  expect,
  beforeEach,
  jest,
  afterEach,
} from "@jest/globals";

import editProfile from "..";
import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import spyDb from "@tests/spyDb";
import { mockContext, info } from "@tests/resolverArguments";
import {
  args,
  dateCreated,
  editSuccess,
  validations,
  verify,
} from "../utils/editProfile.testUtils";
import deleteSession from "@utils/deleteSession";

jest.mock("@lib/supabase/supabaseEvent");

jest.mock("@utils/deleteSession", () => {
  return jest.fn().mockName("deleteSession");
});

const mockEvent = jest.spyOn(supabaseEvent, "emit");
mockEvent.mockImplementation(() => true);

describe("Test edit profile resolver", () => {
  beforeEach(() => {
    mockContext.user = "insane_user_id";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Verify user authentication", () => {
    test("Should return an error response if the user is not logged in", async () => {
      mockContext.user = null;

      const result = await editProfile({}, args, mockContext, info);

      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("message", "Unable to edit user profile");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    test.each(validations(undefined))("%s", async (_, data, errors) => {
      const result = await editProfile({}, data, mockContext, info);

      expect(result).toHaveProperty("firstNameError", errors.firstNameError);
      expect(result).toHaveProperty("lastNameError", errors.lastNameError);
      expect(result).toHaveProperty("imageError", errors.imageError);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    test.each(verify)("%s", async (_, data) => {
      const spy = spyDb({ rows: data });
      const result = await editProfile({}, args, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({ rows: data });
      expect(result).toHaveProperty("message", "Unable to edit user profile");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Edit the user's profile data, Return updated user details", () => {
    test.each(editSuccess)("%s", async (_, input, image) => {
      const mock = [{ email: "test@mail.com", dateCreated, image }];
      const spy = spyDb({ rows: [{ isRegistered: true }] });
      spy.mockReturnValueOnce({ rows: mock });

      const data = await editProfile({}, input, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
      expect(spy).toHaveNthReturnedWith(2, { rows: mock });
      expect(data).toHaveProperty("user.id", "insane_user_id");
      expect(data).toHaveProperty("user.email", "test@mail.com");
      expect(data).toHaveProperty("user.firstName", args.firstName);
      expect(data).toHaveProperty("user.lastName", args.lastName);
      expect(data).toHaveProperty("user.image", image);
      expect(data).toHaveProperty("user.isRegistered", true);
      expect(data).toHaveProperty("user.dateCreated", dateCreated);
      expect(data).toHaveProperty("status", "SUCCESS");
    });
  });
});
