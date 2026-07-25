import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import LoginForm from "..";
import * as mocks from "./LoginForm.mocks";
import { renderUI } from "@utils/tests/renderUI";

describe("Login Form", () => {
  describe("Client side form validation", () => {
    it("Expect error messages on the input fields  if the input fields have empty values", async () => {
      const { user } = renderUI(<LoginForm />);

      await user.click(screen.getByRole("button", mocks.loginBtn));

      expect(
        screen.getByRole("textbox", mocks.email),
      ).toHaveAccessibleErrorMessage("Enter an e-mail address");

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        "Enter password",
      );
    });

    it("Email field with an invalid value should have an invalid error message", async () => {
      const { user } = renderUI(<LoginForm />);

      await user.type(screen.getByRole("textbox", mocks.email), "invalid_mail");
      await user.type(screen.getByLabelText(/^password$/i), "testPassword");
      await user.click(screen.getByRole("button", mocks.loginBtn));

      expect(
        screen.getByRole("textbox", mocks.email),
      ).toHaveAccessibleErrorMessage("Invalid e-mail address");

      expect(
        screen.getByLabelText(/^password$/i),
      ).not.toHaveAccessibleErrorMessage();
    });
  });

  describe("Login API request", () => {
    it("Expect the app to be able to make an API request when the form is submitted", async () => {
      const { user } = renderUI(<LoginForm />);
      const { email, msg } = mocks.unsupported;

      await user.type(screen.getByRole("textbox", mocks.email), email);
      await user.type(screen.getByLabelText(/^password$/i), "testPassword");
      await user.click(screen.getByRole("button", mocks.loginBtn));

      expect(screen.getByRole("button", mocks.loginBtn)).toBeDisabled();
      expect(await screen.findByRole("alert")).toHaveTextContent(msg);
      expect(screen.getByRole("button", mocks.loginBtn)).toBeEnabled();
    });

    describe("Validation error API response", () => {
      it("Expect error messages on the form input fields", async () => {
        const { user } = renderUI(<LoginForm />);
        const { email } = mocks.validation;

        await user.type(screen.getByRole("textbox", mocks.email), email);
        await user.type(screen.getByLabelText(/^password$/i), "testPassword");
        await user.click(screen.getByRole("button", mocks.loginBtn));

        await waitFor(() => {
          expect(
            screen.getByRole("textbox", mocks.email),
          ).toHaveAccessibleErrorMessage(mocks.validation.emailError);
        });

        expect(
          screen.getByLabelText(/^password$/i),
        ).toHaveAccessibleErrorMessage(mocks.validation.passwordError);
      });
    });

    describe("Error API response", () => {
      it.each(mocks.errorTable)("%s", async (_, mock) => {
        const { user } = renderUI(<LoginForm />);

        await user.type(screen.getByRole("textbox", mocks.email), mock.email);
        await user.type(screen.getByLabelText(/^password$/i), "testPassword");
        await user.click(screen.getByRole("button", mocks.loginBtn));

        expect(await screen.findByRole("alert")).toHaveTextContent(mock.msg);
      });
    });

    describe("Login request success", () => {
      afterEach(() => {
        const router = useRouter();
        router.query = {};
      });

      it("Expect an unregistered user to be redirected the register page", async () => {
        const { replace } = useRouter();
        const { user } = renderUI(<LoginForm />);
        const { email } = mocks.unregistered;

        await user.type(screen.getByRole("textbox", mocks.email), email);
        await user.type(screen.getByLabelText(/^password$/i), "testPassword");
        await user.click(screen.getByRole("button", mocks.loginBtn));

        await waitFor(() => {
          expect(replace).toHaveBeenCalledExactlyOnceWith("/register");
        });
      });

      it.each(mocks.successTable)("%s", async (_, { query, page }, mock) => {
        const router = useRouter();
        router.query = query;

        const { user } = renderUI(<LoginForm />);

        await user.type(screen.getByRole("textbox", mocks.email), mock.email);
        await user.type(screen.getByLabelText(/^password$/i), "testPassword");
        await user.click(screen.getByRole("button", mocks.loginBtn));

        await waitFor(() => {
          expect(router.push).toHaveBeenCalledExactlyOnceWith(page);
        });
      });
    });
  });
});
