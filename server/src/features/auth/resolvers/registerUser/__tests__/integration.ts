import {
  describe,
  test,
  expect,
  beforeEach,
  jest,
  afterEach,
} from "@jest/globals";

import resolver from "..";

import {
  args,
  dateCreated,
  registerMock,
  validations,
  verifyUser,
} from "../utils/registerUser.testUtils";
import { mockContext, info, spyDb } from "@tests";

describe("Test register user resolver", () => {
  beforeEach(() => {
    mockContext.user = "id_of_this_user";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Verify user authentication", () => {
    test("Should return an error response if the user is not logged in", async () => {
      mockContext.user = null;

      const data = await resolver({}, { userInput: args }, mockContext, info);

      expect(data).toHaveProperty("message", "Unable to register user");
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Validate user input", () => {
    test.each(validations(undefined))("%s", async (_, userInput, errors) => {
      const data = await resolver({}, { userInput }, mockContext, info);

      expect(data).toHaveProperty("firstNameError", errors.firstNameError);
      expect(data).toHaveProperty("lastNameError", errors.lastNameError);
      expect(data).toHaveProperty("passwordError", errors.passwordError);
      expect(data).toHaveProperty(
        "confirmPasswordError",
        errors.confirmPasswordError
      );
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify user", () => {
    test.each(verifyUser)("%s", async (_, mock, errorMessage) => {
      const dbSpy = spyDb({ rows: mock });

      const data = await resolver({}, { userInput: args }, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(1);
      expect(dbSpy).toHaveReturnedWith({ rows: mock });
      expect(data).toHaveProperty("message", errorMessage);
      expect(data).toHaveProperty("status", "ERROR");
    });
  });

  describe("Register user success", () => {
    test("Register an unregistered user, Should respond with the user's details", async () => {
      const dbSpy = spyDb({ rows: registerMock });
      dbSpy.mockReturnValueOnce({ rows: [] });

      const data = await resolver({}, { userInput: args }, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(2);
      expect(dbSpy).toHaveNthReturnedWith(1, { rows: registerMock });
      expect(dbSpy).toHaveNthReturnedWith(2, { rows: [] });
      expect(data).toHaveProperty("user.id", "id_of_this_user");
      expect(data).toHaveProperty("user.email", "test@mail.com");
      expect(data).toHaveProperty("user.firstName", args.firstName);
      expect(data).toHaveProperty("user.lastName", args.lastName);
      expect(data).toHaveProperty("user.image", null);
      expect(data).toHaveProperty("user.isRegistered", true);
      expect(data).toHaveProperty("user.dateCreated", dateCreated);
      expect(data).toHaveProperty("status", "SUCCESS");
    });
  });
});
