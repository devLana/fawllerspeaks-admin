import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import Login from "@pages/login";
import {
  authHeaderHandler,
  refreshTokenHandler,
  userIdHandler,
  renderTestUI,
} from "@utils/renderTestUI";
import { SESSION_ID } from "@utils/constants";
import {
  validationError,
  loginErrorTable,
  loginSuccessTable,
  redirectStatus,
  EMAIL,
  PASSWORD,
} from "../utils/loginMocks";

describe("Login Page", () => {
  beforeAll(() => {
    const router = useRouter();
    router.pathname = "/login";
  });

  describe("Redirect from other pages, get status param url query", () => {
    afterAll(() => {
      const router = useRouter();
      router.query = {};
    });

    it.each(redirectStatus)("%s", (_, status) => {
      const router = useRouter();
      router.query = { status };

      renderTestUI(<Login />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(
        "You are unable to perform that action. Please log in"
      );
    });
  });

  describe("On client side validation of login form", () => {
    it("Display appropriate error messages if input fields are empty", async () => {
      const { user } = renderTestUI(<Login />);

      await user.click(screen.getByRole("button", { name: "Login" }));

      expect(screen.getByText("Enter an e-mail address")).toBeInTheDocument();
      expect(screen.getByText("Enter password")).toBeInTheDocument();
    });

    it("Show invalid email error message if email input string is invalid", async () => {
      const { user } = renderTestUI(<Login />);

      await user.type(screen.getByLabelText(/e-?mail/i), "invalid_email");
      await user.type(screen.getByLabelText("Password"), "testing_password");
      await user.click(screen.getByRole("button", { name: "Login" }));

      expect(screen.getByText("Invalid e-mail address")).toBeInTheDocument();
      expect(screen.queryByText("Enter password")).not.toBeInTheDocument();
    });
  });

  describe("If server responds with an error object type or an unsupported object type after login request", () => {
    it("Set error messages on appropriate form input fields", async () => {
      const { user } = renderTestUI(<Login />, validationError.gql());
      const { emailError, passwordError } = validationError;

      await user.type(screen.getByLabelText(/e-?mail/i), EMAIL);
      await user.type(screen.getByLabelText("Password"), PASSWORD);
      await user.click(screen.getByRole("button", { name: "Login" }));

      expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();

      await expect(screen.findByText(emailError)).resolves.toBeInTheDocument();
      expect(screen.getByText(passwordError)).toBeInTheDocument();

      expect(screen.getByLabelText(/e-?mail/i)).toHaveFocus();
      expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
    });

    it.each(loginErrorTable)(
      "Show an alert message if %s",
      async (_, error) => {
        const { user } = renderTestUI(<Login />, error.gql());
        const { message } = error;

        await user.type(screen.getByLabelText(/e-?mail/i), EMAIL);
        await user.type(screen.getByLabelText("Password"), PASSWORD);
        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();

        expect(await screen.findByRole("alert")).toHaveTextContent(message);
        expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
      }
    );
  });

  describe("If login request is successful", () => {
    afterEach(() => {
      localStorage.removeItem(SESSION_ID);
    });

    it.each(loginSuccessTable)(
      "Redirect %s user to the %s page",
      async (_, __, { mock, page }) => {
        const { user } = renderTestUI(<Login />, mock.gql());
        const { replace } = useRouter();

        await user.type(screen.getByLabelText(/e-?mail/i), EMAIL);
        await user.type(screen.getByLabelText("Password"), PASSWORD);
        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();

        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
        expect(replace).toHaveBeenCalledWith(page);

        expect(localStorage.getItem(SESSION_ID)).toBe(mock.sessionId);
        expect(authHeaderHandler).toHaveBeenCalledTimes(1);
        expect(authHeaderHandler).toHaveBeenCalledWith("accessToken");
        expect(userIdHandler).toHaveBeenCalledTimes(1);
        expect(userIdHandler).toHaveBeenCalledWith("User:user_id");
        expect(refreshTokenHandler).toHaveBeenCalledTimes(1);
        expect(refreshTokenHandler).toHaveBeenCalledWith("accessToken");
      }
    );
  });
});
