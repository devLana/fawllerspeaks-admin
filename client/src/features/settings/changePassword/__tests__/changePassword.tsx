import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import ChangePassword from "@pages/settings/password";
import { renderTestUI } from "@utils/renderTestUI";
import {
  alertTable,
  redirectTable,
  validation,
} from "../utils/changePassword.mocks";

describe("Change Password", () => {
  const btnName = { name: /^change password$/i };

  describe("Client side form validation", () => {
    it("Display error messages for empty input fields", async () => {
      const { user } = renderTestUI(<ChangePassword />);

      await user.click(screen.getByRole("button", btnName));

      expect(screen.getByLabelText(/^current password$/i)).toHaveErrorMessage(
        "Enter current password"
      );

      expect(screen.getByLabelText(/^new password$/i)).toHaveErrorMessage(
        "Enter new password"
      );

      expect(
        screen.getByLabelText(/^confirm new password$/i)
      ).toHaveErrorMessage("Enter confirm password");
    });

    it("New password field has an invalid value, Display an error message", async () => {
      const msg =
        "New password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol";

      const { user } = renderTestUI(<ChangePassword />);

      await user.type(screen.getByLabelText(/^new password$/i), "pass");
      await user.click(screen.getByRole("button", btnName));
      expect(screen.getByLabelText(/^new password$/i)).toHaveErrorMessage(
        "New Password must be at least 8 characters long"
      );

      await user.clear(screen.getByLabelText(/^new password$/i));
      await user.type(screen.getByLabelText(/^new password$/i), "Pass!WOrd");
      await user.click(screen.getByRole("button", btnName));
      expect(screen.getByLabelText(/^new password$/i)).toHaveErrorMessage(msg);

      await user.clear(screen.getByLabelText(/^new password$/i));
      await user.type(screen.getByLabelText(/^new password$/i), "PASS!W0RD");
      await user.click(screen.getByRole("button", btnName));
      expect(screen.getByLabelText(/^new password$/i)).toHaveErrorMessage(msg);

      await user.clear(screen.getByLabelText(/^new password$/i));
      await user.type(screen.getByLabelText(/^new password$/i), "pass!w0rd");
      await user.click(screen.getByRole("button", btnName));
      expect(screen.getByLabelText(/^new password$/i)).toHaveErrorMessage(msg);

      await user.clear(screen.getByLabelText(/^new password$/i));
      await user.type(screen.getByLabelText(/^new password$/i), "PassW0rd");
      await user.click(screen.getByRole("button", btnName));
      expect(screen.getByLabelText(/^new password$/i)).toHaveErrorMessage(msg);
    });

    it("Display a confirm new password error message if passwords do not match", async () => {
      const { user } = renderTestUI(<ChangePassword />);
      const confirmNewPwd = screen.getByLabelText(/^confirm new password$/i);

      await user.type(screen.getByLabelText(/^new password$/i), "Pass!W0rd");
      await user.type(confirmNewPwd, "password");
      await user.click(screen.getByRole("button", btnName));

      expect(confirmNewPwd).toHaveErrorMessage("Passwords do not match");
    });
  });

  describe("Make change password request to the server", () => {
    describe("Server response is an input validation error", () => {
      it("Display the appropriate form field error messages", async () => {
        const { user } = renderTestUI(<ChangePassword />, validation.gql());
        const currentPassword = screen.getByLabelText(/^current password$/i);
        const newPassword = screen.getByLabelText(/^new password$/i);
        const confirmNewPwd = screen.getByLabelText(/^confirm new password$/i);

        await user.type(currentPassword, validation.currentPassword);
        await user.type(newPassword, validation.password);
        await user.type(confirmNewPwd, validation.password);
        await user.click(screen.getByRole("button", btnName));

        expect(screen.getByRole("button", btnName)).toBeDisabled();

        await waitFor(() => {
          expect(currentPassword).toHaveErrorMessage(
            validation.currentPasswordError
          );
        });

        expect(newPassword).toHaveErrorMessage(validation.newPasswordError);

        expect(confirmNewPwd).toHaveErrorMessage(
          validation.confirmNewPasswordError
        );

        expect(currentPassword).toHaveFocus();
        expect(screen.getByRole("button", btnName)).toBeEnabled();
      });
    });

    describe("Server responds with an error object type", () => {
      it.each(redirectTable)("%s", async (_, [pathname, status], mock) => {
        const { replace } = useRouter();

        const { user } = renderTestUI(<ChangePassword />, mock.gql());
        const currentPassword = screen.getByLabelText(/^current password$/i);
        const newPassword = screen.getByLabelText(/^new password$/i);
        const confirmNewPwd = screen.getByLabelText(/^confirm new password$/i);

        await user.type(currentPassword, mock.currentPassword);
        await user.type(newPassword, mock.password);
        await user.type(confirmNewPwd, mock.password);
        await user.click(screen.getByRole("button", btnName));

        expect(screen.getByRole("button", btnName)).toBeDisabled();

        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));

        expect(replace).toHaveBeenCalledWith(`${pathname}?status=${status}`);
        expect(screen.getByRole("button", btnName)).toBeDisabled();
      });
    });

    describe("Render an alert toast box", () => {
      it.each(alertTable)("%s", async (_, mock) => {
        const { user } = renderTestUI(<ChangePassword />, mock.gql());
        const currentPassword = screen.getByLabelText(/^current password$/i);
        const newPassword = screen.getByLabelText(/^new password$/i);
        const confirmNewPwd = screen.getByLabelText(/^confirm new password$/i);

        await user.type(currentPassword, mock.currentPassword);
        await user.type(newPassword, mock.password);
        await user.type(confirmNewPwd, mock.password);
        await user.click(screen.getByRole("button", btnName));

        expect(screen.getByRole("button", btnName)).toBeDisabled();

        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();

        expect(screen.getByRole("alert")).toHaveTextContent(mock.message);
        expect(screen.getByRole("button", btnName)).toBeEnabled();
      });
    });
  });
});
