import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import RegisterUserForm from "..";
import * as mocks from "./RegisterUserForm.mocks";
import { renderUI } from "@utils/tests/renderUI";

describe("Register User Form", () => {
  describe("Client side form validation", () => {
    it("Input fields should have error messages if they have empty values", async () => {
      const { user } = renderUI(<RegisterUserForm />);

      await user.click(screen.getByRole("button", { name: /^register$/i }));

      expect(
        screen.getByRole("textbox", { name: /^first name$/i })
      ).toHaveAccessibleErrorMessage("Enter first name");

      expect(
        screen.getByRole("textbox", { name: /^last name$/i })
      ).toHaveAccessibleErrorMessage("Enter last name");

      expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleErrorMessage(
        "Enter password"
      );

      expect(
        screen.getByLabelText(/^confirm password$/i)
      ).toHaveAccessibleErrorMessage("Enter confirm password");
    });

    it("Password field should have an error message if it has an invalid value", async () => {
      const { user } = renderUI(<RegisterUserForm />);
      const password = screen.getByLabelText(/^password$/i);

      await user.type(password, "pass");
      await user.click(screen.getByRole("button", { name: /^register$/i }));

      expect(password).toHaveAccessibleErrorMessage(mocks.shortPassword);

      await user.clear(password);
      await user.type(password, "Pass!WOrd");
      await user.click(screen.getByRole("button", { name: /^register$/i }));

      expect(password).toHaveAccessibleErrorMessage(mocks.invalidPassword);

      await user.clear(password);
      await user.type(password, "PASS!W0RD");
      await user.click(screen.getByRole("button", { name: /^register$/i }));

      expect(password).toHaveAccessibleErrorMessage(mocks.invalidPassword);

      await user.clear(password);
      await user.type(password, "pass!w0rd");
      await user.click(screen.getByRole("button", { name: /^register$/i }));

      expect(password).toHaveAccessibleErrorMessage(mocks.invalidPassword);

      await user.clear(password);
      await user.type(password, "PassW0rd");
      await user.click(screen.getByRole("button", { name: /^register$/i }));

      expect(password).toHaveAccessibleErrorMessage(mocks.invalidPassword);
    });

    it("Confirm password field should have an error message if it does not match the password field", async () => {
      const { user } = renderUI(<RegisterUserForm />);
      const confirmPassword = screen.getByLabelText(/^confirm password$/i);

      await user.type(screen.getByLabelText(/^password$/i), "PaS$W0RD");
      await user.type(confirmPassword, "PASSWORD");
      await user.click(screen.getByRole("button", { name: /^register$/i }));

      expect(confirmPassword).toHaveAccessibleErrorMessage(
        "Passwords do not match"
      );
    });
  });

  describe("Register user API request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("API request failed with an input validation error", () => {
      it("Expect input fields to have an error message", async () => {
        const { user } = renderUI(<RegisterUserForm />);

        await mocks.dryEvents(user, mocks.validation.input);

        await expect(
          screen.findByRole("textbox", { name: /^first name$/i })
        ).resolves.toHaveAccessibleErrorMessage(mocks.invalidFirstName);

        expect(
          screen.getByRole("textbox", { name: /^last name$/i })
        ).toHaveAccessibleErrorMessage(mocks.invalidLastName);

        expect(
          screen.getByLabelText(/^password$/i)
        ).toHaveAccessibleErrorMessage(mocks.shortPassword);

        expect(
          screen.getByLabelText(/^confirm password$/i)
        ).toHaveAccessibleErrorMessage("Passwords do not match");

        expect(
          screen.getByRole("textbox", { name: /^first name$/i })
        ).toHaveFocus();

        expect(
          screen.getByRole("button", { name: /^register$/i })
        ).toBeEnabled();
      });
    });

    describe("API request failed with an error or an unsupported object type", () => {
      it.each(mocks.alerts)("%s", async (_, expected) => {
        const { user } = renderUI(<RegisterUserForm />);

        await mocks.dryEvents(user, expected.input);

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent(expected.message);

        expect(
          screen.getByRole("button", { name: /^register$/i })
        ).toBeEnabled();
      });
    });

    describe("Redirect the user for a user verification error response", () => {
      it.each(mocks.errorRedirects)("%s", async (_, params, mock) => {
        const router = useRouter();
        const { user } = renderUI(<RegisterUserForm />);

        await mocks.dryEvents(user, mock.input);
        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(params);
      });
    });

    describe("User registered", () => {
      afterAll(() => {
        const router = useRouter();
        router.query = {};
      });

      it.each(mocks.successRedirects)("%s", async (_, data, mock) => {
        const router = useRouter();
        router.query = data.query;

        const { user } = renderUI(<RegisterUserForm />);

        await mocks.dryEvents(user, mock.input);
        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(data.page);
      });
    });
  });
});
