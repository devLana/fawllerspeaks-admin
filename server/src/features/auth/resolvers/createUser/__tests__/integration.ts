import { describe, test, expect, jest, afterEach } from "@jest/globals";

import createUser from "..";
import createUserMail from "../createUserMail";

import { validations } from "../createUserTestUtils";
import { MailError } from "@utils";
import { mockContext, info, spyDb } from "@tests";

const msg = "A confirmation mail has been sent to the email address provided";

jest.mock("../createUserMail", () => jest.fn().mockName("createUserMail"));

describe("Test create user resolver", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Validate user input", () => {
    test.each(validations)(
      "E-mail validation fails, Return an error for %s e-mail string",
      async (_, email, errorMsg) => {
        const result = await createUser({}, { email }, mockContext, info);

        expect(createUserMail).not.toHaveBeenCalled();

        expect(result).toHaveProperty("emailError", errorMsg);
        expect(result).toHaveProperty("status", "ERROR");
      }
    );
  });

  describe("Create new user", () => {
    test("Verify e-mail address, Return an error if e-mail already exists", async () => {
      const email = "test_mail@example.com";
      const spy = spyDb({ rows: [{ email }] });
      const result = await createUser({}, { email }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith({ rows: [{ email }] });

      expect(createUserMail).not.toHaveBeenCalled();

      expect(result).toHaveProperty("message", msg);
      expect(result).toHaveProperty("status", "ERROR");
    });

    test("Send a confirmation mail if a new user is created", async () => {
      const email = "test_mail@example.com.com";
      const spy = spyDb({ rows: [] }).mockReturnValue({ rows: [] });
      const result = await createUser({}, { email }, mockContext, info);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveLastReturnedWith({ rows: [] });

      expect(createUserMail).toHaveBeenCalledTimes(1);

      expect(result).toHaveProperty("message", msg);
      expect(result).toHaveProperty("status", "SUCCESS");
    });

    test("Confirmation mail fails to send and user is not created, return an error", async () => {
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
