import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import Login from "@pages/login";
import {
  handleAuthHeader,
  refreshTokenHandler,
  userIdHandler,
  renderTestUI,
} from "@utils/renderTestUI";
import { SESSION_ID } from "@utils/constants";
import {
  validation,
  errorTable,
  successTable,
  redirectStatus,
} from "../utils/login.mocks";

describe("Login Page", () => {
  const emailLabel = { name: /e-?mail/i };

  describe("Redirect from other pages, get status param url query", () => {
    afterAll(() => {
      const router = useRouter();
      router.query = {};
    });

    it.each(redirectStatus)("%s", (_, status, message) => {
      const router = useRouter();
      router.query = { status };

      renderTestUI(<Login />);

      expect(screen.getByRole("alert")).toHaveTextContent(message);
      expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardInfo");
    });
  });

  describe("On client side validation of login form", () => {
    it("Display appropriate error messages if input fields are empty", async () => {
      const { user } = renderTestUI(<Login />);

      await user.click(screen.getByRole("button", { name: /login/i }));

      expect(
        screen.getByRole("textbox", emailLabel)
      ).toHaveAccessibleErrorMessage("Enter an e-mail address");

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        "Enter password"
      );
    });

    it("Show invalid email error message if email input string is invalid", async () => {
      const { user } = renderTestUI(<Login />);

      await user.type(screen.getByRole("textbox", emailLabel), "invalid_email");
      await user.type(screen.getByLabelText(/^password$/i), "testing_password");
      await user.click(screen.getByRole("button", { name: /login/i }));

      expect(
        screen.getByRole("textbox", emailLabel)
      ).toHaveAccessibleErrorMessage("Invalid e-mail address");

      expect(
        screen.getByLabelText(/^password$/i)
      ).not.toHaveAccessibleErrorMessage("Enter password");
    });
  });

  describe("If server responds with an error object type or an unsupported object type after login request", () => {
    it("Set error messages on appropriate form input fields", async () => {
      localStorage.setItem(SESSION_ID, validation.sessionId);
      const { user } = renderTestUI(<Login />, validation.gql());
      const { sessionIdError, email, password } = validation;

      await user.type(screen.getByRole("textbox", emailLabel), email);
      await user.type(screen.getByLabelText(/^password$/i), password);
      await user.click(screen.getByRole("button", { name: /login/i }));

      expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();

      await waitFor(() => {
        expect(
          screen.getByRole("textbox", emailLabel)
        ).toHaveAccessibleErrorMessage(validation.emailError);
      });

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        validation.passwordError
      );

      expect(screen.getByRole("alert")).toHaveTextContent(sessionIdError);
      expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardError");

      expect(screen.getByRole("textbox", emailLabel)).toHaveFocus();
      expect(screen.getByRole("button", { name: /login/i })).toBeEnabled();
      localStorage.removeItem(SESSION_ID);
    });

    it.each(errorTable)("Show an alert message if %s", async (_, error) => {
      const { user } = renderTestUI(<Login />, error.gql());
      const { message, email, password } = error;

      await user.type(screen.getByRole("textbox", emailLabel), email);
      await user.type(screen.getByLabelText(/^password$/i), password);
      await user.click(screen.getByRole("button", { name: /login/i }));

      expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();

      const alert = await screen.findByRole("alert");

      expect(alert).toHaveTextContent(message);
      expect(alert).toHaveClass("MuiAlert-standardError");
      expect(screen.getByRole("button", { name: /login/i })).toBeEnabled();
    });
  });

  describe("If login request is successful", () => {
    afterEach(() => {
      localStorage.removeItem(SESSION_ID);
    });

    it.each(successTable)("%s", async (_, { mock, page }) => {
      const { user } = renderTestUI(<Login />, mock.gql());
      const { replace } = useRouter();

      await user.type(screen.getByRole("textbox", emailLabel), mock.email);
      await user.type(screen.getByLabelText(/^password$/i), mock.password);
      await user.click(screen.getByRole("button", { name: /login/i }));

      expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();

      await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
      expect(replace).toHaveBeenCalledWith(page);

      expect(localStorage.getItem(SESSION_ID)).toBe(mock.sessionId);
      expect(handleAuthHeader).toHaveBeenCalledTimes(1);
      expect(handleAuthHeader).toHaveBeenCalledWith("accessToken");
      expect(userIdHandler).toHaveBeenCalledTimes(1);
      expect(userIdHandler).toHaveBeenCalledWith("User:user_id");
      expect(refreshTokenHandler).toHaveBeenCalledTimes(1);
      expect(refreshTokenHandler).toHaveBeenCalledWith("accessToken");
      expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
    });
  });
});
