import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import ForgotPassword from "@pages/forgot-password";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./forgotPassword.mocks";

describe("Forgot Password Page", () => {
  const textBox = { name: /e-?mail/i };
  const name = "Send Reset Link";

  describe("On redirect from the reset password page", () => {
    afterAll(() => {
      const router = useRouter();
      router.query = {};
    });

    it.each(mocks.statusTable)("%s", (_, status, message) => {
      const router = useRouter();
      router.query = { status };

      renderUI(<ForgotPassword />);

      expect(screen.getByRole("alert")).toHaveTextContent(message);
      expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardInfo");
    });
  });

  describe("Client side forgot password form validation", () => {
    it("Should display an email error message if the email field has an empty value", async () => {
      const { user } = renderUI(<ForgotPassword />);

      await user.click(screen.getByRole("button", { name }));

      expect(screen.getByRole("textbox", textBox)).toHaveAccessibleErrorMessage(
        "Enter an e-mail address"
      );
    });

    it("Should display an invalid email error message when the user enters an invalid email", async () => {
      const { user } = renderUI(<ForgotPassword />);

      await user.type(screen.getByRole("textbox"), "invalid_email");
      await user.click(screen.getByRole("button", { name }));

      expect(screen.getByRole("textbox", textBox)).toHaveAccessibleErrorMessage(
        "Invalid e-mail address"
      );
    });
  });

  describe("Make forgot password api request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("Api response is a validation error", () => {
      it("Should set an error message on the email input field", async () => {
        const { user } = renderUI(<ForgotPassword />);
        const { message, email } = mocks.validation;

        await user.type(screen.getByRole("textbox", textBox), email);
        await user.click(screen.getByRole("button", { name }));

        expect(screen.getByRole("button", { name })).toBeDisabled();

        await waitFor(() => {
          expect(
            screen.getByRole("textbox", textBox)
          ).toHaveAccessibleErrorMessage(message);
        });

        expect(screen.getByRole("textbox")).toHaveFocus();
        expect(screen.getByRole("button", { name })).toBeEnabled();
      });
    });

    describe("Api response is an error or an unsupported object type", () => {
      it.each(mocks.testTable)("%s", async (_, expected) => {
        const { user } = renderUI(<ForgotPassword />);

        await user.type(screen.getByRole("textbox", textBox), expected.email);
        await user.click(screen.getByRole("button", { name }));

        expect(screen.getByRole("button", { name })).toBeDisabled();

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent(expected.message);
        expect(alert).toHaveClass("MuiAlert-standardError");
        expect(screen.getByRole("button", { name })).toBeEnabled();
      });
    });

    describe("Provided email belongs to an unregistered account", () => {
      it("Should render an info dialog box", async () => {
        const { user } = renderUI(<ForgotPassword />);
        const { email, message } = mocks.registration;

        await user.type(screen.getByRole("textbox", textBox), email);
        await user.click(screen.getByRole("button", { name }));

        expect(screen.getByRole("button", { name })).toBeDisabled();
        await expect(screen.findByText(message)).resolves.toBeInTheDocument();
      });
    });

    describe("On forgot password request success", () => {
      it("Should render a success dialog box", async () => {
        const { user } = renderUI(<ForgotPassword />);
        const { email, message } = mocks.success;

        await user.type(screen.getByRole("textbox", textBox), email);
        await user.click(screen.getByRole("button", { name }));

        expect(screen.getByRole("button", { name })).toBeDisabled();

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent("Request Link Sent");
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });
  });
});
