import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import ResetPassword from "@pages/reset-password";
import { renderUI } from "@testUtils/renderUI";
import * as mocks from "./mocks/resetPassword.mocks";

describe("Reset Password", () => {
  describe("Pre-render reset password page with server side data", () => {
    it("User account is unregistered, Should render an information dialog box", () => {
      renderUI(<ResetPassword isUnregistered />);
      expect(screen.getByText(mocks.msg2)).toBeInTheDocument();
    });

    it("Should display the user's e-mail address in a readonly textbox", () => {
      renderUI(<ResetPassword verified={mocks.data} />);

      expect(
        screen.getByRole("textbox", { name: /^e-?mail$/i })
      ).toHaveDisplayValue(mocks.data.email);
    });
  });

  describe("Reset Password Page", () => {
    const resetButton = { name: /^reset password$/i };

    describe("Client side form validation", () => {
      it("Input fields should have an error message if the field value is empty", async () => {
        const { user } = renderUI(<ResetPassword verified={mocks.data} />);

        await user.click(screen.getByRole("button", resetButton));

        expect(
          screen.getByLabelText(/^password$/i)
        ).toHaveAccessibleErrorMessage("Enter password");

        expect(
          screen.getByLabelText(/^confirm password$/i)
        ).toHaveAccessibleErrorMessage("Enter confirm password");
      });

      it("The password field should have an error message if it has an invalid value", async () => {
        const { user } = renderUI(<ResetPassword verified={mocks.data} />);

        await user.type(screen.getByLabelText(/^password$/i), "pass");
        await user.click(screen.getByRole("button", resetButton));
        expect(
          screen.getByLabelText(/^password$/i)
        ).toHaveAccessibleErrorMessage(
          "Password must be at least 8 characters long"
        );

        await user.clear(screen.getByLabelText(/^password$/i));
        await user.type(screen.getByLabelText(/^password$/i), "Pass!WOrd");
        await user.click(screen.getByRole("button", resetButton));
        expect(
          screen.getByLabelText(/^password$/i)
        ).toHaveAccessibleErrorMessage(mocks.msg1);

        await user.clear(screen.getByLabelText(/^password$/i));
        await user.type(screen.getByLabelText(/^password$/i), "PASS!W0RD");
        await user.click(screen.getByRole("button", resetButton));
        expect(
          screen.getByLabelText(/^password$/i)
        ).toHaveAccessibleErrorMessage(mocks.msg1);

        await user.clear(screen.getByLabelText(/^password$/i));
        await user.type(screen.getByLabelText(/^password$/i), "pass!w0rd");
        await user.click(screen.getByRole("button", resetButton));
        expect(
          screen.getByLabelText(/^password$/i)
        ).toHaveAccessibleErrorMessage(mocks.msg1);

        await user.clear(screen.getByLabelText(/^password$/i));
        await user.type(screen.getByLabelText(/^password$/i), "PassW0rd");
        await user.click(screen.getByRole("button", resetButton));
        expect(
          screen.getByLabelText(/^password$/i)
        ).toHaveAccessibleErrorMessage(mocks.msg1);
      });

      it("The confirm password field should have an error message if it does not match the password field", async () => {
        const { user } = renderUI(<ResetPassword verified={mocks.data} />);
        const confirmPassword = screen.getByLabelText(/^confirm password$/i);

        await user.type(screen.getByLabelText(/^password$/i), "PassW0!rd");
        await user.type(confirmPassword, "password");
        await user.click(screen.getByRole("button", resetButton));

        expect(confirmPassword).toHaveAccessibleErrorMessage(
          "Passwords do not match"
        );
      });
    });

    describe("Make a reset password request to the api", () => {
      beforeAll(() => {
        mocks.server.listen({ onUnhandledRequest: "error" });
      });

      afterAll(() => {
        mocks.server.close();
      });

      describe("Api request received a validation error response", () => {
        it("Api response is a validation error, Input field should have error messages", async () => {
          const { user } = renderUI(<ResetPassword verified={mocks.data} />);
          const password = screen.getByLabelText(/^password$/i);
          const confirmPassword = screen.getByLabelText(/^confirm Password$/i);

          await user.type(password, mocks.validation1.password);
          await user.type(confirmPassword, mocks.validation1.password);
          await user.click(screen.getByRole("button", resetButton));

          expect(screen.getByRole("button", resetButton)).toBeDisabled();

          await waitFor(() => {
            expect(password).toHaveAccessibleErrorMessage(mocks.msg3);
          });

          expect(confirmPassword).toHaveAccessibleErrorMessage(mocks.msg4);
          expect(password).toHaveFocus();
          expect(screen.getByRole("button", resetButton)).toBeEnabled();
        });
      });

      describe("The api responds with an error or an unsupported object type", () => {
        it.each(mocks.redirects)("%s", async (_, status, mock) => {
          const { user } = renderUI(<ResetPassword verified={mocks.data} />);
          const { push } = useRouter();

          await user.type(screen.getByLabelText(/^password$/i), mock.password);

          await user.type(
            screen.getByLabelText(/^confirm Password$/i),
            mock.password
          );

          await user.click(screen.getByRole("button", resetButton));

          expect(screen.getByRole("button", resetButton)).toBeDisabled();

          await waitFor(() => expect(push).toHaveBeenCalledTimes(1));

          expect(push).toHaveBeenCalledWith(
            `/forgot-password?status=${status}`
          );

          expect(screen.getByRole("button", resetButton)).toBeDisabled();
        });
      });

      describe("The user's account is unregistered", () => {
        it("Should render an information dialog box", async () => {
          const { password } = mocks.unregistered;
          const { user } = renderUI(<ResetPassword verified={mocks.data} />);

          await user.type(screen.getByLabelText(/^password$/i), password);

          await user.type(
            screen.getByLabelText(/^confirm Password$/i),
            password
          );

          await user.click(screen.getByRole("button", resetButton));

          expect(screen.getByRole("button", resetButton)).toBeDisabled();

          await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
            "Unregistered Account"
          );

          expect(screen.getByText(mocks.msg2)).toBeInTheDocument();
        });
      });

      describe("User password is successfully reset", () => {
        it.each(mocks.alerts)("%s", async (_, className, mock) => {
          const { password } = mock;
          const { user } = renderUI(<ResetPassword verified={mocks.data} />);

          await user.type(screen.getByLabelText(/^password$/i), password);

          await user.type(
            screen.getByLabelText(/^confirm Password$/i),
            password
          );

          await user.click(screen.getByRole("button", resetButton));

          expect(screen.getByRole("button", resetButton)).toBeDisabled();
          expect(await screen.findByRole("alert")).toHaveClass(className);

          expect(screen.getByRole("alert")).toHaveTextContent(
            "Password Reset Successful"
          );

          expect(
            screen.getByText("Your password has been reset.")
          ).toBeInTheDocument();
        });
      });
    });
  });
});
