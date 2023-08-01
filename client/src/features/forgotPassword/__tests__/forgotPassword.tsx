import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import ForgotPassword from "@pages/forgot-password";
import { renderTestUI } from "@utils/renderTestUI";
import {
  EMAIL,
  registration,
  statusTable,
  success,
  testTable,
  unsupported,
  validation,
} from "../utils/forgotPassword.mocks";

describe("Forgot Password Page", () => {
  const textBox = { name: /e-?mail/i };
  const name = "Send Reset Link";

  describe("After redirect from reset password page, get status token from page url query", () => {
    afterAll(() => {
      const router = useRouter();
      router.query = {};
    });

    it.each(statusTable)(
      "Display an alert message if %s",
      (_, status, message) => {
        const router = useRouter();
        router.query = { status };

        renderTestUI(<ForgotPassword />);

        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(message);
      }
    );
  });

  describe("On client side validation of the forgot password form", () => {
    it("Display email error message if email field is empty", async () => {
      const { user } = renderTestUI(<ForgotPassword />);

      await user.click(screen.getByRole("button", { name }));

      expect(screen.getByRole("textbox", textBox)).toHaveErrorMessage(
        "Enter an e-mail address"
      );
    });

    it("Display invalid email error message when user enters an invalid email", async () => {
      const { user } = renderTestUI(<ForgotPassword />);

      await user.type(screen.getByRole("textbox"), "invalid_email");
      await user.click(screen.getByRole("button", { name }));

      expect(screen.getByRole("textbox", textBox)).toHaveErrorMessage(
        "Invalid e-mail address"
      );
    });
  });

  describe("Server responds with an error object type", () => {
    it("Set an error on the email field if error is a validation error", async () => {
      const { user } = renderTestUI(<ForgotPassword />, validation.gql());
      const { emailError } = validation;

      await user.type(screen.getByRole("textbox", textBox), EMAIL);
      await user.click(screen.getByRole("button", { name }));

      expect(screen.getByRole("button", { name })).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByRole("textbox", textBox)).toHaveErrorMessage(
          emailError
        );
      });

      expect(screen.getByRole("textbox")).toHaveFocus();
      expect(screen.getByRole("button", { name })).toBeEnabled();
    });

    it.each(testTable)("Show an alert message if %s", async (_, expected) => {
      const { user } = renderTestUI(<ForgotPassword />, expected.gql);
      const { message } = expected;

      await user.type(screen.getByRole("textbox", textBox), EMAIL);
      await user.click(screen.getByRole("button", { name }));

      expect(screen.getByRole("button", { name })).toBeDisabled();

      await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();

      expect(screen.getByRole("alert")).toHaveTextContent(message);
      expect(screen.getByRole("button", { name })).toBeEnabled();
    });

    it("Show an info dialog box if email is for an unregistered account", async () => {
      const { user } = renderTestUI(<ForgotPassword />, registration.gql());

      await user.type(screen.getByRole("textbox", textBox), EMAIL);
      await user.click(screen.getByRole("button", { name }));

      expect(screen.getByRole("button", { name })).toBeDisabled();

      expect(await screen.findByRole("presentation")).toBeInTheDocument();
      expect(screen.getByRole("presentation")).toHaveTextContent(
        "It appears the account belonging to the e-mail address you provided has not been registered yet"
      );
    });
  });

  describe("On success response from the server", () => {
    it("Display a success dialog box", async () => {
      const { user } = renderTestUI(<ForgotPassword />, success.gql());
      const alertMessage = "Request Link Sent";

      await user.type(screen.getByRole("textbox", textBox), EMAIL);
      await user.click(screen.getByRole("button", { name }));

      expect(screen.getByRole("button", { name })).toBeDisabled();

      expect(await screen.findByRole("presentation")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(alertMessage);
    });
  });

  describe("If server responds with an unsupported object type", () => {
    it("Show an error alert message", async () => {
      const { user } = renderTestUI(<ForgotPassword />, unsupported.gql());
      const { message } = unsupported;

      await user.type(screen.getByRole("textbox", textBox), EMAIL);
      await user.click(screen.getByRole("button", { name }));

      expect(screen.getByRole("button", { name })).toBeDisabled();

      await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();

      expect(screen.getByRole("alert")).toHaveTextContent(message);
      expect(screen.getByRole("button", { name })).toBeEnabled();
    });
  });
});
