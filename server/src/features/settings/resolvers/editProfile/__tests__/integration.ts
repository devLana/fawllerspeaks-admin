import { describe, test, expect, beforeEach } from "@jest/globals";

import editProfile from "..";
import { mockContext, info, spyDb } from "@tests";

const args = { firstName: "Ade", lastName: "Lana" };

beforeEach(() => {
  mockContext.user = "insane_user_id";
});

describe("Test edit profile resolver", () => {
  test("Returns error on logged out user", async () => {
    mockContext.user = null;

    const arg = { firstName: "", lastName: "" };

    const result = await editProfile({}, arg, mockContext, info);

    expect(result).toHaveProperty("message", "Unable to edit user profile");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each([
    [
      "empty input values",
      { firstName: "", lastName: "" },
      { firstNameError: "Enter first name", lastNameError: "Enter last name" },
    ],
    [
      "empty whitespace input values",
      { firstName: "    ", lastName: "   " },
      { firstNameError: "Enter first name", lastNameError: "Enter last name" },
    ],
    [
      "invalid first name and last name",
      { firstName: "John3", lastName: "12sam" },
      {
        firstNameError: "First name cannot contain numbers",
        lastNameError: "Last name cannot contain numbers",
      },
    ],
  ])("Returns error on %s", async (_, data, errors) => {
    const result = await editProfile({}, data, mockContext, info);

    expect(result).toHaveProperty("firstNameError", errors.firstNameError);
    expect(result).toHaveProperty("lastNameError", errors.lastNameError);
    expect(result).toHaveProperty("status", "ERROR");
  });

  test.each([
    ["unknown", []],
    ["unregistered", [{ isRegistered: false }]],
  ])("Returns error on %s user", async (_, data) => {
    const spy = spyDb({ rows: data });
    const result = await editProfile({}, args, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith({ rows: data });

    expect(result).toHaveProperty("message", "Unable to edit user profile");
    expect(result).toHaveProperty("status", "ERROR");
  });

  test("Should edit profile and update user", async () => {
    const spy = spyDb({ rows: [{ isRegistered: true }] });
    spy.mockReturnValueOnce({ rows: [] });

    const result = await editProfile({}, args, mockContext, info);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveNthReturnedWith(1, { rows: [{ isRegistered: true }] });
    expect(spy).toHaveNthReturnedWith(2, { rows: [] });

    expect(result).toHaveProperty("id", "insane_user_id");
    expect(result).toHaveProperty("firstName", args.firstName);
    expect(result).toHaveProperty("lastName", args.lastName);
    expect(result).toHaveProperty("status", "SUCCESS");
  });
});
