import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import ResetPasswordForm from "..";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./ResetPasswordForm.mocks";
import type { ResetPasswordFormProps } from "@appTypes/auth/resetPassword";

describe("Reset Password Form", () => {
  const mockOnSuccess = vi.fn().mockName("onSuccess");

  const props: ResetPasswordFormProps = {
    email: "reset_password_test@mail.org",
    resetToken: "VERIFIED_PASSWORD_RESET_TOKEN",
    onSuccess: mockOnSuccess,
  };

  describe("Client side form validation", () => {
    it("Expect the input fields to have an error message", async () => {
      const { user } = renderUI(<ResetPasswordForm {...props} />);

      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        "Enter password"
      );

      expect(
        screen.getByLabelText(/^confirm password$/i)
      ).toHaveAccessibleErrorMessage("Enter confirm password");
    });

    it("Expect the password field to have an error message if it has an invalid value", async () => {
      const { user } = renderUI(<ResetPasswordForm {...props} />);

      await user.type(screen.getByLabelText(/^password$/i), "pass");
      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        "Password must be at least 8 characters long"
      );

      await user.clear(screen.getByLabelText(/^password$/i));
      await user.type(screen.getByLabelText(/^password$/i), "Pass!WOrd");
      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        mocks.MSG
      );

      await user.clear(screen.getByLabelText(/^password$/i));
      await user.type(screen.getByLabelText(/^password$/i), "PASS!W0RD");
      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        mocks.MSG
      );

      await user.clear(screen.getByLabelText(/^password$/i));
      await user.type(screen.getByLabelText(/^password$/i), "pass!w0rd");
      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        mocks.MSG
      );

      await user.clear(screen.getByLabelText(/^password$/i));
      await user.type(screen.getByLabelText(/^password$/i), "PassW0rd");
      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        mocks.MSG
      );
    });

    it("Expect the confirm password field to have an error message if its value does not match the password field", async () => {
      const { user } = renderUI(<ResetPasswordForm {...props} />);
      const confirmPassword = screen.getByLabelText(/^confirm password$/i);

      await user.type(screen.getByLabelText(/^password$/i), "PassW0!rd");
      await user.type(confirmPassword, "password");
      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(confirmPassword).toHaveAccessibleErrorMessage(
        "Passwords do not match"
      );
    });
  });

  describe("Reset password API request", () => {
    it("Expect the user to be able to make an API request", async () => {
      const { user } = renderUI(<ResetPasswordForm {...props} />);
      const { push } = useRouter();

      await user.type(screen.getByLabelText(/^password$/i), mocks.unsupported);
      await user.type(
        screen.getByLabelText(/^confirm Password$/i),
        mocks.unsupported
      );

      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(screen.getByRole("button", mocks.resetButton)).toBeDisabled();

      await waitFor(() => {
        expect(push).toHaveBeenCalledExactlyOnceWith({
          pathname: "/forgot-password",
          query: { status: "error" },
        });
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    describe("Input validation error", () => {
      it("Expect all relevant input fields to have an error message", async () => {
        const { user } = renderUI(<ResetPasswordForm {...props} />);
        const password = screen.getByLabelText(/^password$/i);
        const confirmPassword = screen.getByLabelText(/^confirm Password$/i);

        await user.type(password, mocks.validate1);
        await user.type(confirmPassword, mocks.validate1);
        await user.click(screen.getByRole("button", mocks.resetButton));

        await waitFor(() => {
          expect(password).toHaveAccessibleErrorMessage(mocks.msg1);
        });

        expect(confirmPassword).toHaveAccessibleErrorMessage(mocks.msg2);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });

    describe("The API responds with an error object type", () => {
      it.each(mocks.redirects)("%s", async (_, status, pwd) => {
        const { user } = renderUI(<ResetPasswordForm {...props} />);
        const { push } = useRouter();

        await user.type(screen.getByLabelText(/^password$/i), pwd);
        await user.type(screen.getByLabelText(/^confirm Password$/i), pwd);
        await user.click(screen.getByRole("button", mocks.resetButton));

        await waitFor(() => {
          expect(push).toHaveBeenCalledExactlyOnceWith({
            pathname: "/forgot-password",
            query: { status },
          });
        });

        expect(mockOnSuccess).not.toHaveBeenCalledOnce();
      });
    });

    describe("User password is successfully reset", () => {
      it("Expect the page view to be changed to the password reset success view", async () => {
        const { success } = mocks;
        const { user } = renderUI(<ResetPasswordForm {...props} />);

        await user.type(screen.getByLabelText(/^password$/i), success);
        await user.type(screen.getByLabelText(/^confirm Password$/i), success);
        await user.click(screen.getByRole("button", mocks.resetButton));

        await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledOnce());
      });
    });
  });
});
