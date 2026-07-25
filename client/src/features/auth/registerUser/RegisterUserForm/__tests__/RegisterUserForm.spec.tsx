import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import RegisterUserForm from "..";
import * as mocks from "./RegisterUserForm.mocks";
import { protectedTestUI } from "@utils/tests/renderUI/protected";

describe("Register User Form", () => {
  describe("Client side form validation", () => {
    it("Expect input fields to have error messages", async () => {
      const { user } = protectedTestUI(<RegisterUserForm />);

      await user.click(screen.getByRole("button", mocks.btn));

      expect(
        screen.getByRole("textbox", mocks.fN)
      ).toHaveAccessibleErrorMessage("Enter first name");

      expect(
        screen.getByRole("textbox", mocks.lN)
      ).toHaveAccessibleErrorMessage("Enter last name");

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        "Enter password"
      );

      expect(screen.getByLabelText(mocks.cPw)).toHaveAccessibleErrorMessage(
        "Enter confirm password"
      );
    });

    it("Password field should have an error message if it has an invalid value", async () => {
      const { user } = protectedTestUI(<RegisterUserForm />);
      const passwordInput = screen.getByLabelText(mocks.pw);

      await user.type(screen.getByLabelText(mocks.pw), "pass");
      await user.click(screen.getByRole("button", mocks.btn));

      expect(passwordInput).toHaveAccessibleErrorMessage(mocks.shortPassword);

      await user.clear(passwordInput);
      await user.type(passwordInput, "Pass!WOrd");
      await user.click(screen.getByRole("button", mocks.btn));

      expect(passwordInput).toHaveAccessibleErrorMessage(mocks.invalidPassword);

      await user.clear(passwordInput);
      await user.type(passwordInput, "PASS!W0RD");
      await user.click(screen.getByRole("button", mocks.btn));

      expect(passwordInput).toHaveAccessibleErrorMessage(mocks.invalidPassword);

      await user.clear(passwordInput);
      await user.type(passwordInput, "pass!w0rd");
      await user.click(screen.getByRole("button", mocks.btn));

      expect(passwordInput).toHaveAccessibleErrorMessage(mocks.invalidPassword);

      await user.clear(passwordInput);
      await user.type(passwordInput, "PassW0rd");
      await user.click(screen.getByRole("button", mocks.btn));

      expect(passwordInput).toHaveAccessibleErrorMessage(mocks.invalidPassword);
    });

    it("Expect confirm password field to have an error message if it does not match the password field", async () => {
      const { user } = protectedTestUI(<RegisterUserForm />);

      await user.type(screen.getByLabelText(mocks.pw), "PaS$W0RD");
      await user.type(screen.getByLabelText(mocks.cPw), "PASSWORD");
      await user.click(screen.getByRole("button", mocks.btn));

      expect(screen.getByLabelText(mocks.cPw)).toHaveAccessibleErrorMessage(
        "Passwords do not match"
      );
    });
  });

  describe("Register user API request", () => {
    it("Expect the app to be able to make an API request", async () => {
      const { user } = protectedTestUI(<RegisterUserForm />);
      const { input, message } = mocks.unsupported;

      await user.type(screen.getByRole("textbox", mocks.fN), input.firstName);
      await user.type(screen.getByRole("textbox", mocks.lN), input.lastName);
      await user.type(screen.getByLabelText(mocks.pw), input.password);
      await user.type(screen.getByLabelText(mocks.cPw), input.password);
      await user.click(screen.getByRole("button", mocks.btn));

      expect(screen.getByRole("button", mocks.btn)).toBeDisabled();
      expect(await screen.findByRole("alert")).toHaveTextContent(message);
      expect(screen.getByRole("button", mocks.btn)).toBeEnabled();
    });

    describe("Validation error API response", () => {
      it("Expect input fields to have an error message", async () => {
        const { user } = protectedTestUI(<RegisterUserForm />);
        const { input } = mocks.validation;

        await user.type(screen.getByRole("textbox", mocks.fN), input.firstName);
        await user.type(screen.getByRole("textbox", mocks.lN), input.lastName);
        await user.type(screen.getByLabelText(mocks.pw), input.password);
        await user.type(screen.getByLabelText(mocks.cPw), input.password);
        await user.click(screen.getByRole("button", mocks.btn));

        await waitFor(() => {
          expect(
            screen.getByRole("textbox", mocks.fN)
          ).toHaveAccessibleErrorMessage(mocks.invalidFirstName);
        });

        expect(
          screen.getByRole("textbox", mocks.lN)
        ).toHaveAccessibleErrorMessage(mocks.invalidLastName);

        expect(screen.getByLabelText(mocks.pw)).toHaveAccessibleErrorMessage(
          mocks.shortPassword
        );

        expect(screen.getByLabelText(mocks.cPw)).toHaveAccessibleErrorMessage(
          "Passwords do not match"
        );
      });
    });

    describe("API request failed with an error", () => {
      it.each(mocks.alerts)("%s", async (_, expected) => {
        const { user } = protectedTestUI(<RegisterUserForm />);
        const { input, message } = expected;

        await user.type(screen.getByRole("textbox", mocks.fN), input.firstName);
        await user.type(screen.getByRole("textbox", mocks.lN), input.lastName);
        await user.type(screen.getByLabelText(mocks.pw), input.password);
        await user.type(screen.getByLabelText(mocks.cPw), input.password);
        await user.click(screen.getByRole("button", mocks.btn));

        expect(await screen.findByRole("alert")).toHaveTextContent(message);
      });
    });

    describe("User verification error", () => {
      it.each(mocks.errorRedirects)("%s", async (_, params, mock) => {
        const router = useRouter();
        const { input } = mock;

        const { user } = protectedTestUI(<RegisterUserForm />);

        await user.type(screen.getByRole("textbox", mocks.fN), input.firstName);
        await user.type(screen.getByRole("textbox", mocks.lN), input.lastName);
        await user.type(screen.getByLabelText(mocks.pw), input.password);
        await user.type(screen.getByLabelText(mocks.cPw), input.password);
        await user.click(screen.getByRole("button", mocks.btn));

        await waitFor(() => {
          expect(router.replace).toHaveBeenCalledExactlyOnceWith(params);
        });
      });
    });

    describe("User registered", () => {
      afterAll(() => {
        const router = useRouter();
        router.query = {};
      });

      it.each(mocks.successRedirects)("%s", async (_, data, mock) => {
        const router = useRouter();
        const { input } = mock;
        router.query = data.query;

        const { user } = protectedTestUI(<RegisterUserForm />);

        await user.type(screen.getByRole("textbox", mocks.fN), input.firstName);
        await user.type(screen.getByRole("textbox", mocks.lN), input.lastName);
        await user.type(screen.getByLabelText(mocks.pw), input.password);
        await user.type(screen.getByLabelText(mocks.cPw), input.password);
        await user.click(screen.getByRole("button", mocks.btn));

        await waitFor(() => {
          expect(router.replace).toHaveBeenCalledExactlyOnceWith(data.page);
        });
      });
    });
  });
});
