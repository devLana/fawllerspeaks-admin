import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";

import RegisterUser from "@pages/register";
import * as mocks from "./registerUser.mocks";
import { renderUI } from "@testUtils/renderUI";

describe("Register User Page", () => {
  const dryEvents = async (user: UserEvent, input: mocks.Input) => {
    await user.type(
      screen.getByRole("textbox", { name: /^first name$/i }),
      input.firstName
    );
    await user.type(
      screen.getByRole("textbox", { name: /^last name$/i }),
      input.lastName
    );
    await user.type(screen.getByLabelText(/^password$/i), input.password);
    await user.type(
      screen.getByLabelText(/^confirm password$/i),
      input.password
    );
    await user.click(screen.getByRole("button", { name: /^register$/i }));

    expect(screen.getByRole("button", { name: /^register$/i })).toBeDisabled();
  };

  describe("App is redirected to the register page with a status token", () => {
    it("Should display an alert message toast if the status token is 'unregistered'", () => {
      const router = useRouter();
      router.query = { status: "unregistered" };

      renderUI(<RegisterUser />);

      expect(screen.getByRole("alert")).toHaveTextContent(
        "You need to register your account before you can perform that action"
      );
      expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardInfo");

      router.query = {};
    });
  });

  describe("Client side form validation", () => {
    it("Input fields should have error messages if they have empty values", async () => {
      const { user } = renderUI(<RegisterUser />);

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
      const { user } = renderUI(<RegisterUser />);
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
      const { user } = renderUI(<RegisterUser />);
      const confirmPassword = screen.getByLabelText(/^confirm password$/i);

      await user.type(screen.getByLabelText(/^password$/i), "PaS$W0RD");
      await user.type(confirmPassword, "PASSWORD");
      await user.click(screen.getByRole("button", { name: /^register$/i }));

      expect(confirmPassword).toHaveAccessibleErrorMessage(
        "Passwords do not match"
      );
    });
  });

  describe("Make a register user api request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("APi request failed with a validation error", () => {
      it("Input fields should have an error message", async () => {
        const { user } = renderUI(<RegisterUser />);
        const fName = screen.getByRole("textbox", { name: /^first name$/i });

        await dryEvents(user, mocks.validation.input);

        await waitFor(() => {
          expect(fName).toHaveAccessibleErrorMessage(mocks.invalidFirstName);
        });

        expect(
          screen.getByRole("textbox", { name: /^last name$/i })
        ).toHaveAccessibleErrorMessage(mocks.invalidLastName);

        expect(
          screen.getByLabelText(/^password$/i)
        ).toHaveAccessibleErrorMessage(mocks.shortPassword);

        expect(
          screen.getByLabelText(/^confirm password$/i)
        ).toHaveAccessibleErrorMessage("Passwords do not match");

        expect(fName).toHaveFocus();

        expect(
          screen.getByRole("button", { name: /^register$/i })
        ).toBeEnabled();
      });
    });

    describe("Api request failed with an error or an unsupported object type", () => {
      it.each(mocks.alerts)("%s", async (_, expected) => {
        const { user } = renderUI(<RegisterUser />);

        await dryEvents(user, expected.input);

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent(expected.message);
        expect(alert).toHaveClass("MuiAlert-standardError");
        expect(
          screen.getByRole("button", { name: /^register$/i })
        ).toBeEnabled();
      });
    });

    describe("Redirect the user for a user verification error response", () => {
      it.each(mocks.errorRedirects)("%s", async (_, path, mock) => {
        const router = useRouter();
        const { user } = renderUI(<RegisterUser />);

        await dryEvents(user, mock.input);

        await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
        expect(router.replace).toHaveBeenCalledWith(path);
      });
    });

    describe("User registered", () => {
      it.each(mocks.successRedirects)("%s", async (_, data, mock) => {
        const router = useRouter();
        router.query = data.query;

        const { user } = renderUI(<RegisterUser />);

        await dryEvents(user, mock.input);

        await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
        expect(router.replace).toHaveBeenCalledWith(data.page);
      });
    });
  });
});
