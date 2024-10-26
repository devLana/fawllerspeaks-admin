import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import LoginForm from "..";
import { SESSION_ID } from "@utils/constants";
import {
  refreshTokenHandler,
  userIdHandler,
  renderUI,
} from "@utils/tests/renderUI";
import * as mocks from "./LoginForm.mocks";

describe("Login Form", () => {
  const emailLabel = { name: /^e-?mail$/i };

  describe("Client side form validation", () => {
    it("Input fields should have error messages if the values are empty", async () => {
      const { user } = renderUI(<LoginForm />);

      await user.click(screen.getByRole("button", mocks.loginName));

      expect(
        screen.getByRole("textbox", emailLabel)
      ).toHaveAccessibleErrorMessage("Enter an e-mail address");

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        "Enter password"
      );
    });

    it("Email field with an invalid value should have an invalid error message", async () => {
      const { user } = renderUI(<LoginForm />);

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

  describe("Login API request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("API response is an input validation error", () => {
      it("Should set error messages on the appropriate form input fields", async () => {
        const { user } = renderUI(<LoginForm />);
        const { email } = mocks.validation;

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

        expect(screen.getByRole("textbox", emailLabel)).toHaveFocus();
        expect(screen.getByRole("button", mocks.loginName)).toBeEnabled();
      });
    });

    describe("The API responded with an error or an unsupported object type", () => {
      it.each(mocks.errorTable)("%s", async (_, mock) => {
        const { user } = renderUI(<LoginForm />);

        await user.type(screen.getByRole("textbox", emailLabel), mock.email);
        await user.type(screen.getByLabelText(/^password$/i), mocks.PASSWORD);
        await user.click(screen.getByRole("button", mocks.loginName));

        expect(screen.getByRole("button", mocks.loginName)).toBeDisabled();
        expect(await screen.findByRole("alert")).toHaveTextContent(mock.msg);
        expect(screen.getByRole("button", mocks.loginName)).toBeEnabled();
      });
    });

    describe("Login request success", () => {
      afterEach(() => {
        const router = useRouter();
        router.query = {};
        localStorage.removeItem(SESSION_ID);
      });

      it("Should redirect an unregistered user to the register page", async () => {
        const { replace } = useRouter();
        const { user } = renderUI(<LoginForm />);

        await user.type(
          screen.getByRole("textbox", emailLabel),
          mocks.unRegistered.email
        );

        await user.type(screen.getByLabelText(/^password$/i), mocks.PASSWORD);
        await user.click(screen.getByRole("button", mocks.loginName));

        expect(screen.getByRole("button", mocks.loginName)).toBeDisabled();

        await waitFor(() => expect(replace).toHaveBeenCalledOnce());

        expect(replace).toHaveBeenCalledWith("/register");
        expect(localStorage.getItem(SESSION_ID)).toBe("USER_DATA_SESSION_ID");
        expect(userIdHandler).toHaveBeenCalledOnce();
        expect(userIdHandler).toHaveBeenCalledWith("User:user_id");
        expect(refreshTokenHandler).toHaveBeenCalledOnce();
        expect(refreshTokenHandler).toHaveBeenCalledWith("accessToken");
        expect(screen.getByRole("button", mocks.loginName)).toBeDisabled();
      });

      it.each(mocks.successTable)("%s", async (_, { query, page }, mock) => {
        const router = useRouter();
        router.query = query;

        const { user } = renderUI(<LoginForm />);

        await user.type(screen.getByRole("textbox", emailLabel), mock.email);
        await user.type(screen.getByLabelText(/^password$/i), mocks.PASSWORD);
        await user.click(screen.getByRole("button", mocks.loginName));

        expect(screen.getByRole("button", mocks.loginName)).toBeDisabled();

        await waitFor(() => expect(router.push).toHaveBeenCalledOnce());

        expect(router.push).toHaveBeenCalledWith(page);
        expect(localStorage.getItem(SESSION_ID)).toBe("USER_DATA_SESSION_ID");
        expect(userIdHandler).toHaveBeenCalledOnce();
        expect(userIdHandler).toHaveBeenCalledWith("User:user_id");
        expect(refreshTokenHandler).toHaveBeenCalledOnce();
        expect(refreshTokenHandler).toHaveBeenCalledWith("accessToken");
        expect(screen.getByRole("button", mocks.loginName)).toBeDisabled();
      });
    });
  });
});
