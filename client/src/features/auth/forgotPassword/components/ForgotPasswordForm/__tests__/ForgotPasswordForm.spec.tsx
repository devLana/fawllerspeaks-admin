import { screen, waitFor } from "@testing-library/react";

import ForgotPasswordForm from "..";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./ForgotPasswordForm.mocks";

describe("Forgot Password Form", () => {
  const textBox = { name: /e-?mail/i };
  const name = "Send Reset Link";
  const mockFn = vi.fn().mockName("handleView");

  describe("Client side forgot password form validation", () => {
    it("Should display an email error message if the email field has an empty value", async () => {
      const { user } = renderUI(<ForgotPasswordForm handleView={mockFn} />);

      await user.click(screen.getByRole("button", { name }));

      expect(screen.getByRole("textbox", textBox)).toHaveAccessibleErrorMessage(
        "Enter an e-mail address"
      );
    });

    it("Should display an invalid email error message when the user enters an invalid email", async () => {
      const { user } = renderUI(<ForgotPasswordForm handleView={mockFn} />);

      await user.type(screen.getByRole("textbox"), "invalid_email");
      await user.click(screen.getByRole("button", { name }));

      expect(screen.getByRole("textbox", textBox)).toHaveAccessibleErrorMessage(
        "Invalid e-mail address"
      );
    });
  });

  describe("Forgot password API request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("API response is an input validation error", () => {
      it("Should set an error message on the email input field", async () => {
        const { user } = renderUI(<ForgotPasswordForm handleView={mockFn} />);
        const { message, email } = mocks.validation;

        await user.type(screen.getByRole("textbox", textBox), email);
        await user.click(screen.getByRole("button", { name }));

        expect(screen.getByRole("button", { name })).toBeDisabled();

        await waitFor(() => {
          expect(
            screen.getByRole("textbox", textBox)
          ).toHaveAccessibleErrorMessage(message);
        });

        expect(mockFn).not.toHaveBeenCalled();
        expect(screen.getByRole("textbox")).toHaveFocus();
        expect(screen.getByRole("button", { name })).toBeEnabled();
      });
    });

    describe("API response is an error or an unsupported object type", () => {
      it.each(mocks.testTable)("%s", async (_, expected) => {
        const { user } = renderUI(<ForgotPasswordForm handleView={mockFn} />);

        await user.type(screen.getByRole("textbox", textBox), expected.email);
        await user.click(screen.getByRole("button", { name }));

        expect(screen.getByRole("button", { name })).toBeDisabled();

        expect(await screen.findByRole("alert")).toHaveTextContent(
          expected.message
        );

        expect(mockFn).not.toHaveBeenCalled();
        expect(screen.getByRole("button", { name })).toBeEnabled();
      });
    });

    describe.each(mocks.viewTable)("%s", (_, { title, email, view }) => {
      it(title, async () => {
        const { user } = renderUI(<ForgotPasswordForm handleView={mockFn} />);

        await user.type(screen.getByRole("textbox", textBox), email);
        await user.click(screen.getByRole("button", { name }));

        expect(screen.getByRole("button", { name })).toBeDisabled();

        await waitFor(() => expect(mockFn).toHaveBeenCalledOnce());

        expect(mockFn).toHaveBeenCalledWith(view);
      });
    });
  });
});
