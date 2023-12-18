import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import Login from "@pages/login";
import {
  refreshTokenHandler,
  userIdHandler,
  renderUI,
} from "@utils/tests/renderUI";
import { SESSION_ID } from "@utils/constants";
import * as mocks from "../utils/login.mocks";

describe("Login Page", () => {
  const emailLabel = { name: /^e-?mail$/i };

  describe("Get status param url query on redirect from other pages", () => {
    afterAll(() => {
      const router = useRouter();
      router.query = {};
    });

    it.each(mocks.redirectStatus)("%s", (_, status, message) => {
      const router = useRouter();
      router.query = { status };

      renderUI(<Login />);

      expect(screen.getByRole("alert")).toHaveTextContent(message);
      expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardInfo");
    });
  });

  describe("Client side form validation", () => {
    it("Input fields should have error messages if the values are empty", async () => {
      const { user } = renderUI(<Login />);

      await user.click(screen.getByRole("button", mocks.loginName));

      expect(
        screen.getByRole("textbox", emailLabel)
      ).toHaveAccessibleErrorMessage("Enter an e-mail address");

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        "Enter password"
      );
    });

    it("Email field with an invalid value should have an invalid error message", async () => {
      const { user } = renderUI(<Login />);

      await user.type(screen.getByRole("textbox", emailLabel), "invalid_email");
      await user.type(screen.getByLabelText(/^password$/i), mocks.PASSWORD);
      await user.click(screen.getByRole("button", mocks.loginName));

      expect(
        screen.getByRole("textbox", emailLabel)
      ).toHaveAccessibleErrorMessage("Invalid e-mail address");

      expect(
        screen.getByLabelText(/^password$/i)
      ).not.toHaveAccessibleErrorMessage("Enter password");
    });
  });

  describe("Make a login request to the api", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("Api response is an input validation error", () => {
      it("Should set error messages on the appropriate form input fields", async () => {
        const { user } = renderUI(<Login />);
        const { sessionIdError, email } = mocks.validation;

        await user.type(screen.getByRole("textbox", emailLabel), email);
        await user.type(screen.getByLabelText(/^password$/i), mocks.PASSWORD);
        await user.click(screen.getByRole("button", mocks.loginName));

        expect(screen.getByRole("button", mocks.loginName)).toBeDisabled();

        await waitFor(() => {
          expect(
            screen.getByRole("textbox", emailLabel)
          ).toHaveAccessibleErrorMessage(mocks.validation.emailError);
        });

        expect(
          screen.getByLabelText(/^password$/i)
        ).toHaveAccessibleErrorMessage(mocks.validation.passwordError);

        expect(screen.getByRole("alert")).toHaveTextContent(sessionIdError);
        expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardError");

        expect(screen.getByRole("textbox", emailLabel)).toHaveFocus();
        expect(screen.getByRole("button", mocks.loginName)).toBeEnabled();
      });
    });

    describe("The api responded with an error or an unsupported object type", () => {
      it.each(mocks.errorTable)("%s", async (_, mock) => {
        const { user } = renderUI(<Login />);

        await user.type(screen.getByRole("textbox", emailLabel), mock.email);
        await user.type(screen.getByLabelText(/^password$/i), mocks.PASSWORD);
        await user.click(screen.getByRole("button", mocks.loginName));

        expect(screen.getByRole("button", mocks.loginName)).toBeDisabled();

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent(mock.message);
        expect(alert).toHaveClass("MuiAlert-standardError");
        expect(screen.getByRole("button", mocks.loginName)).toBeEnabled();
      });
    });

    describe("Login request success", () => {
      afterEach(() => {
        localStorage.removeItem(SESSION_ID);
      });

      it.each(mocks.successTable)("%s", async (_, page, mock) => {
        const { user } = renderUI(<Login />);
        const { replace } = useRouter();

        await user.type(screen.getByRole("textbox", emailLabel), mock.email);
        await user.type(screen.getByLabelText(/^password$/i), mocks.PASSWORD);
        await user.click(screen.getByRole("button", mocks.loginName));

        expect(screen.getByRole("button", mocks.loginName)).toBeDisabled();

        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
        expect(replace).toHaveBeenCalledWith(page);
        expect(localStorage.getItem(SESSION_ID)).toBe("USER_DATA_SESSION_ID");
        expect(userIdHandler).toHaveBeenCalledTimes(1);
        expect(userIdHandler).toHaveBeenCalledWith("User:user_id");
        expect(refreshTokenHandler).toHaveBeenCalledTimes(1);
        expect(refreshTokenHandler).toHaveBeenCalledWith("accessToken");
        expect(screen.getByRole("button", mocks.loginName)).toBeDisabled();
      });
    });
  });
});
