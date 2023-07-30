import { describe, test, expect, afterEach, jest } from "@jest/globals";

import resolver from "..";
import { validations } from "../utils/verifyResetTokenTestUtils";
import { mockContext, info, spyDb } from "@tests";

const token = "reset_token";

describe("Test verify reset token resolver", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Validate user input", () => {
    test.each(validations)(
      "Returns error on %s token input",
      async (_, data) => {
        const msg = "Provide password reset token";

        const result = await resolver({}, { token: data }, mockContext, info);

        expect(result).toHaveProperty("tokenError", msg);
        expect(result).toHaveProperty("status", "ERROR");
      }
    );
  });

  describe("Verify provided password reset token", () => {
    test("Return an error object for an unknown password reset token", async () => {
      const dbSpy = spyDb({ rows: [] });
      const msg = "Unable to verify password reset token";

      const result = await resolver({}, { token }, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(1);
      expect(dbSpy).toHaveReturnedWith({ rows: [] });
      expect(result).toHaveProperty("message", msg);
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Return an error object for an unregistered account", async () => {
      const mockData = [{ isRegistered: false }];
      const msg = "Unable to verify password reset token";
      const dbSpy = spyDb({ rows: mockData }).mockReturnValueOnce({ rows: [] });

      const result = await resolver({}, { token }, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(2);
      expect(dbSpy).toHaveNthReturnedWith(1, { rows: mockData });
      expect(dbSpy).toHaveNthReturnedWith(2, { rows: [] });
      expect(result).toHaveProperty("message", msg);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Successfully verify password reset token", () => {
    test("Respond with e-mail and password reset token", async () => {
      const email = "example_email@mail.com";
      const mockData = [{ isRegistered: true, email }];
      const dbSpy = spyDb({ rows: mockData });

      const result = await resolver({}, { token }, mockContext, info);

      expect(dbSpy).toHaveBeenCalledTimes(1);
      expect(dbSpy).toHaveReturnedWith({ rows: mockData });
      expect(result).toHaveProperty("email", email);
      expect(result).toHaveProperty("resetToken", token);
      expect(result).toHaveProperty("status", "SUCCESS");
    });
  });
});
