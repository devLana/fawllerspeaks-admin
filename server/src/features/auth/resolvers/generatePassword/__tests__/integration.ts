import { test, expect, describe, jest } from "@jest/globals";

import resolver from "..";

import generatePasswordMail from "../utils/generatePasswordMail";
import {
  email,
  msg,
  validations,
  verifyMail,
} from "../utils/generatePassword.testUtils";
import { MailError } from "@utils";
import { mockContext, info, spyDb } from "@tests";

jest.mock("../utils/generatePasswordMail", () => {
  return jest.fn().mockName("generatePasswordMail");
});

describe("Test generate password resolver", () => {
  describe("Validate user input", () => {
    test.each(validations)("%s", async (_, data, errorMsg) => {
      const result = await resolver({}, { email: data }, mockContext, info);

      expect(generatePasswordMail).not.toHaveBeenCalled();
      expect(result).toHaveProperty("emailError", errorMsg);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Verify e-mail address", () => {
    test.each(verifyMail)("%s", async (_, data) => {
      const spy = spyDb({ rows: data });

      const result = await resolver({}, { email }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({ rows: data });
      expect(generatePasswordMail).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", msg);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Generate new account password", () => {
    test("Should send a confirmation mail with the generated password", async () => {
      const user = { is_registered: false };
      const spy = spyDb({ rows: [user] }).mockReturnValueOnce({ rows: [] });

      const result = await resolver({}, { email }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveLastReturnedWith({ rows: [] });
      expect(generatePasswordMail).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("message", msg);
      expect(result).toHaveProperty("status", "SUCCESS");
    });

    test("Should return an error response if the confirmation mail fails to send", async () => {
      const user = { is_registered: false };
      const spy = spyDb({ rows: [user] }).mockReturnValueOnce({ rows: [] });
      const mock = generatePasswordMail as jest.MockedFunction<() => never>;
      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const result = await resolver({}, { email }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveLastReturnedWith({ rows: [] });

      expect(generatePasswordMail).toHaveBeenCalledTimes(1);
      expect(generatePasswordMail).toThrow("Unable to send mail");
      expect(generatePasswordMail).toThrow(MailError);

      expect(result).toHaveProperty("message", "Unable to send mail");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });
});
