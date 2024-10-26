import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import ResetPasswordForm from "..";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./ResetPasswordForm.mocks";
import type { ResetPasswordFormProps } from "types/resetPassword";

describe("Reset Password Form", () => {
  const mockHandleView = vi.fn().mockName("handleView");

  const props: ResetPasswordFormProps = {
    email: "reset_password_test@mail.org",
    resetToken: "VERIFIED_PASSWORD_RESET_TOKEN",
    handleView: mockHandleView,
  };

  describe("Client side form validation", () => {
    it("Input fields should have an error message if the field value is empty", async () => {
      const { user } = renderUI(<ResetPasswordForm {...props} />);

      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        "Enter password"
      );

      expect(
        screen.getByLabelText(/^confirm password$/i)
      ).toHaveAccessibleErrorMessage("Enter confirm password");
    });

    it("The password field should have an error message if it has an invalid value", async () => {
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
        mocks.msg1
      );

      await user.clear(screen.getByLabelText(/^password$/i));
      await user.type(screen.getByLabelText(/^password$/i), "PASS!W0RD");
      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        mocks.msg1
      );

      await user.clear(screen.getByLabelText(/^password$/i));
      await user.type(screen.getByLabelText(/^password$/i), "pass!w0rd");
      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        mocks.msg1
      );

      await user.clear(screen.getByLabelText(/^password$/i));
      await user.type(screen.getByLabelText(/^password$/i), "PassW0rd");
      await user.click(screen.getByRole("button", mocks.resetButton));

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        mocks.msg1
      );
    });

    it("The confirm password field should have an error message if it does not match the password field", async () => {
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
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("API request received an input validation error response", () => {
      it("Expect all relevant input fields to have an error message", async () => {
        const { user } = renderUI(<ResetPasswordForm {...props} />);
        const password = screen.getByLabelText(/^password$/i);
        const confirmPassword = screen.getByLabelText(/^confirm Password$/i);

        await user.type(password, mocks.validation1.password);
        await user.type(confirmPassword, mocks.validation1.password);
        await user.click(screen.getByRole("button", mocks.resetButton));

        expect(screen.getByRole("button", mocks.resetButton)).toBeDisabled();

        await waitFor(() => {
          expect(password).toHaveAccessibleErrorMessage(mocks.msg2);
        });

        expect(confirmPassword).toHaveAccessibleErrorMessage(mocks.msg3);
        expect(password).toHaveFocus();
        expect(mockHandleView).not.toHaveBeenCalledOnce();
        expect(screen.getByRole("button", mocks.resetButton)).toBeEnabled();
      });
    });

    describe("The API responds with an error or an unsupported object type", () => {
      it.each(mocks.redirects)("%s", async (_, status, mock) => {
        const { user } = renderUI(<ResetPasswordForm {...props} />);
        const { push } = useRouter();

        await user.type(screen.getByLabelText(/^password$/i), mock.password);

        await user.type(
          screen.getByLabelText(/^confirm Password$/i),
          mock.password
        );

        await user.click(screen.getByRole("button", mocks.resetButton));

        expect(screen.getByRole("button", mocks.resetButton)).toBeDisabled();

        await waitFor(() => expect(push).toHaveBeenCalledOnce());

        expect(push).toHaveBeenCalledWith({
          pathname: "/forgot-password",
          query: { status },
        });

        expect(mockHandleView).not.toHaveBeenCalledOnce();
        expect(screen.getByRole("button", mocks.resetButton)).toBeDisabled();
      });
    });

    describe.each(mocks.views)("%s", (_, table) => {
      it.each(table)("%s", async (__, mock, view) => {
        const { password } = mock;
        const { user } = renderUI(<ResetPasswordForm {...props} />);

        await user.type(screen.getByLabelText(/^password$/i), password);
        await user.type(screen.getByLabelText(/^confirm Password$/i), password);
        await user.click(screen.getByRole("button", mocks.resetButton));

        expect(screen.getByRole("button", mocks.resetButton)).toBeDisabled();

        await waitFor(() => expect(mockHandleView).toHaveBeenCalledOnce());

        expect(mockHandleView).toHaveBeenCalledWith(view);
        expect(screen.getByRole("button", mocks.resetButton)).toBeDisabled();
      });
    });
  });
});
