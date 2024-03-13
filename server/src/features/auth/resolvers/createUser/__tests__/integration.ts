import { describe, test, expect, jest, afterEach } from "@jest/globals";

import createUser from "..";

import createUserMail from "../utils/createUserMail";
import { msg, validations } from "../utils/createUser.testUtils";
import { MailError } from "@utils/Errors";
import spyDb from "@tests/spyDb";
import { mockContext, info } from "@tests/resolverArguments";

jest.mock("../utils/createUserMail", () => {
  return jest.fn().mockName("createUserMail");
});

describe("Test create user resolver", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Validate user input", () => {
    test.each(validations)("%s", async (_, email, errorMsg) => {
      const result = await createUser({}, { email }, mockContext, info);

      expect(createUserMail).not.toHaveBeenCalled();
      expect(result).toHaveProperty("emailError", errorMsg);
      expect(result).toHaveProperty("status", "ERROR");
    });
  });

  describe("Create a new user", () => {
    test("Should verify e-mail address and return an error response if the user e-mail already exists", async () => {
      const email = "test_mail@example.com";
      const spy = spyDb({ rows: [{ email }] });

      const result = await createUser({}, { email }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({ rows: [{ email }] });
      expect(createUserMail).not.toHaveBeenCalled();
      expect(result).toHaveProperty("message", msg);
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("A new user is created, Should send a confirmation mail", async () => {
      const email = "test_mail@example.com.com";
      const spy = spyDb({ rows: [] }).mockReturnValue({ rows: [] });

      const result = await createUser({}, { email }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveLastReturnedWith({ rows: [] });
      expect(createUserMail).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty("message", msg);
      expect(result).toHaveProperty("status", "SUCCESS");
    });

    test("Should respond with an error if the confirmation mail fails to send", async () => {
      const email = "test_mail@example.com";
      const spy = spyDb({ rows: [] }).mockReturnValue({ rows: [] });
      const mock = createUserMail as jest.MockedFunction<() => never>;
      mock.mockImplementation(() => {
        throw new MailError("Unable to send mail");
      });

      const result = await createUser({}, { email }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveLastReturnedWith({ rows: [] });
      expect(createUserMail).toHaveBeenCalledTimes(1);
      expect(createUserMail).toThrow(MailError);
      expect(createUserMail).toThrow("Unable to send mail");
      expect(result).toHaveProperty("message", "Unable to send mail");
      expect(result).toHaveProperty("status", "ERROR");
    });
  });
});
