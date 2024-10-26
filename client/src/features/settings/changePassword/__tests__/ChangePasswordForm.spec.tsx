import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import ChangePasswordForm from "../ChangePasswordForm";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./ChangePasswordForm.mocks";

describe("Change Password Form", () => {
  const btnName = { name: /^change password$/i };

  describe("Client side form validation", () => {
    it("Input fields should have an error message if the values are empty strings", async () => {
      const { user } = renderUI(<ChangePasswordForm />);

      await user.click(screen.getByRole("button", btnName));

      expect(
        screen.getByLabelText(/^current password$/i)
      ).toHaveAccessibleErrorMessage("Enter current password");

      expect(
        screen.getByLabelText(/^new password$/i)
      ).toHaveAccessibleErrorMessage("Enter new password");

      expect(
        screen.getByLabelText(/^confirm new password$/i)
      ).toHaveAccessibleErrorMessage("Enter confirm password");
    });

    it("New password field should have an error message if it has an invalid value", async () => {
      const msg =
        "New password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol";

      const { user } = renderUI(<ChangePasswordForm />);
      const newPassword = screen.getByLabelText(/^new password$/i);

      await user.type(newPassword, "pass");
      await user.click(screen.getByRole("button", btnName));

      expect(newPassword).toHaveAccessibleErrorMessage(
        "New Password must be at least 8 characters long"
      );

      await user.clear(newPassword);
      await user.type(newPassword, "Pass!WOrd");
      await user.click(screen.getByRole("button", btnName));

      expect(newPassword).toHaveAccessibleErrorMessage(msg);

      await user.clear(newPassword);
      await user.type(newPassword, "PASS!W0RD");
      await user.click(screen.getByRole("button", btnName));

      expect(newPassword).toHaveAccessibleErrorMessage(msg);

      await user.clear(newPassword);
      await user.type(newPassword, "pass!w0rd");
      await user.click(screen.getByRole("button", btnName));

      expect(newPassword).toHaveAccessibleErrorMessage(msg);

      await user.clear(newPassword);
      await user.type(newPassword, "PassW0rd");
      await user.click(screen.getByRole("button", btnName));

      expect(newPassword).toHaveAccessibleErrorMessage(msg);
    });

    it("The confirm new password field should have an error message if it does not match the password field", async () => {
      const { user } = renderUI(<ChangePasswordForm />);
      const confirmNewPwd = screen.getByLabelText(/^confirm new password$/i);

      await user.type(screen.getByLabelText(/^new password$/i), "Pass!W0rd");
      await user.type(confirmNewPwd, "password");
      await user.click(screen.getByRole("button", btnName));

      expect(confirmNewPwd).toHaveAccessibleErrorMessage(
        "Passwords do not match"
      );
    });
  });

  describe("Change password API request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("API responds with an input validation error", () => {
      it("Expect input fields to have an error message", async () => {
        const { user } = renderUI(<ChangePasswordForm />);
        const currentPassword = screen.getByLabelText(/^current password$/i);
        const newPassword = screen.getByLabelText(/^new password$/i);
        const confirmNewPwd = screen.getByLabelText(/^confirm new password$/i);

        await user.type(currentPassword, mocks.currentPassword);
        await user.type(newPassword, mocks.validation.password);
        await user.type(confirmNewPwd, mocks.validation.password);
        await user.click(screen.getByRole("button", btnName));

        expect(screen.getByRole("button", btnName)).toBeDisabled();

        await waitFor(() => {
          expect(currentPassword).toHaveAccessibleErrorMessage(
            mocks.currentErrorMsg
          );
        });

        expect(newPassword).toHaveAccessibleErrorMessage(mocks.newErrorMsg);

        expect(confirmNewPwd).toHaveAccessibleErrorMessage(
          mocks.confirmErrorMsg
        );

        expect(currentPassword).toHaveFocus();
        expect(screen.getByRole("button", btnName)).toBeEnabled();
      });
    });

    describe("Redirect the user to an authentication page", () => {
      it.each(mocks.redirects)("%s", async (_, { params, pathname }, mock) => {
        const router = useRouter();
        router.pathname = pathname;

        const { user } = renderUI(<ChangePasswordForm />);
        const currentPassword = screen.getByLabelText(/^current password$/i);
        const newPassword = screen.getByLabelText(/^new password$/i);
        const confirmNewPwd = screen.getByLabelText(/^confirm new password$/i);

        await user.type(currentPassword, mocks.currentPassword);
        await user.type(newPassword, mock.password);
        await user.type(confirmNewPwd, mock.password);
        await user.click(screen.getByRole("button", btnName));

        expect(screen.getByRole("button", btnName)).toBeDisabled();

        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(params);
        expect(screen.getByRole("button", btnName)).toBeDisabled();
      });
    });

    describe.each(mocks.alerts)("%s", (_, tables) => {
      it.each(tables)("%s", async (__, mock) => {
        const { user } = renderUI(<ChangePasswordForm />);
        const currentPassword = screen.getByLabelText(/^current password$/i);
        const newPassword = screen.getByLabelText(/^new password$/i);
        const confirmNewPwd = screen.getByLabelText(/^confirm new password$/i);

        await user.type(currentPassword, mocks.currentPassword);
        await user.type(newPassword, mock.password);
        await user.type(confirmNewPwd, mock.password);
        await user.click(screen.getByRole("button", btnName));

        expect(screen.getByRole("button", btnName)).toBeDisabled();
        expect(await screen.findByRole("alert")).toHaveTextContent(mock.msg);
        expect(screen.getByRole("button", btnName)).toBeEnabled();
      });
    });
  });
});
