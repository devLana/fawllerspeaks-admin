import { screen, waitFor } from "@testing-library/react";

import ForgotPasswordForm from "..";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./ForgotPasswordForm.mocks";
import type { MockFunc } from "@appTypes";

describe("Forgot Password Form", () => {
  const mockFn = vi.fn<MockFunc>().mockName("onSuccess");

  describe("Client side form validation", () => {
    it("Expect an email error message if the email field has an empty value", async () => {
      const { user } = renderUI(<ForgotPasswordForm onSuccess={mockFn} />);

      await user.click(screen.getByRole("button", mocks.btn));

      expect(
        screen.getByRole("textbox", mocks.box)
      ).toHaveAccessibleErrorMessage("Enter an e-mail address");
    });

    it("Expect an invalid email error message if the user enters an invalid email", async () => {
      const { user } = renderUI(<ForgotPasswordForm onSuccess={mockFn} />);

      await user.type(screen.getByRole("textbox", mocks.box), "invalid_email");
      await user.click(screen.getByRole("button", mocks.btn));

      expect(
        screen.getByRole("textbox", mocks.box)
      ).toHaveAccessibleErrorMessage("Invalid e-mail address");
    });
  });

  describe("Forgot password API request", () => {
    it("Expect an API request to be made when the form is submitted", async () => {
      const { user } = renderUI(<ForgotPasswordForm onSuccess={mockFn} />);
      const { email, message } = mocks.unsupported;

      await user.type(screen.getByRole("textbox", mocks.box), email);
      await user.click(screen.getByRole("button", mocks.btn));

      expect(screen.getByRole("button", mocks.btn)).toBeDisabled();
      expect(await screen.findByRole("alert")).toHaveTextContent(message);
      expect(screen.getByRole("button", mocks.btn)).toBeEnabled();
      expect(mockFn).not.toHaveBeenCalled();
    });

    describe("Input validation error API response", () => {
      it("Expect an error message on the email input field", async () => {
        const { message, email } = mocks.validation;
        const { user } = renderUI(<ForgotPasswordForm onSuccess={mockFn} />);

        await user.type(screen.getByRole("textbox", mocks.box), email);
        await user.click(screen.getByRole("button", mocks.btn));

        await waitFor(() => {
          expect(
            screen.getByRole("textbox", mocks.box)
          ).toHaveAccessibleErrorMessage(message);
        });

        expect(mockFn).not.toHaveBeenCalled();
      });
    });

    describe("API error response", () => {
      it.each(mocks.testTable)("%s", async (_, expected) => {
        const { user } = renderUI(<ForgotPasswordForm onSuccess={mockFn} />);

        await user.type(screen.getByRole("textbox", mocks.box), expected.email);
        await user.click(screen.getByRole("button", mocks.btn));

        await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
          expected.message
        );

        expect(mockFn).not.toHaveBeenCalled();
      });
    });

    describe("Forgot password request success", () => {
      it("Expect the view to change to the success UI", async () => {
        const { user } = renderUI(<ForgotPasswordForm onSuccess={mockFn} />);

        await user.type(screen.getByRole("textbox", mocks.box), mocks.ok.email);
        await user.click(screen.getByRole("button", mocks.btn));

        await waitFor(() => expect(mockFn).toHaveBeenCalledOnce());
      });
    });
  });
});
