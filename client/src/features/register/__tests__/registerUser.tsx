import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";

import RegisterUser from "@pages/register";
import {
  FIRST_NAME,
  LAST_NAME,
  PASSWORD,
  SESSIONID,
  invalidFirstName,
  invalidLastName,
  invalidPassword,
  shortPassword,
  success,
  table1,
  table2,
  validationOne,
  validationTwo,
} from "../utils/registerUser.mocks";
import { renderTestUI } from "@utils/renderTestUI";
import { SESSION_ID } from "@utils/constants";

describe("Register User Page", () => {
  beforeEach(() => {
    localStorage.setItem(SESSION_ID, SESSIONID);
  });

  const dryEvents = async (user: UserEvent) => {
    await user.type(
      screen.getByRole("textbox", { name: /^first name$/i }),
      FIRST_NAME
    );

    await user.type(
      screen.getByRole("textbox", { name: /^last name$/i }),
      LAST_NAME
    );

    await user.type(screen.getByLabelText(/^password$/i), PASSWORD);
    await user.type(screen.getByLabelText(/^confirm password$/i), PASSWORD);
    await user.click(screen.getByRole("button", { name: /^register$/i }));

    expect(screen.getByRole("button", { name: /^register$/i })).toBeDisabled();
  };

  describe("Client side form validation", () => {
    it("Display error messages for empty input fields", async () => {
      const { user } = renderTestUI(<RegisterUser />);

      await user.click(screen.getByRole("button", { name: /^register$/i }));

      expect(
        screen.getByRole("textbox", { name: /^first name$/i })
      ).toHaveErrorMessage("Enter first name");

      expect(
        screen.getByRole("textbox", { name: /^last name$/i })
      ).toHaveErrorMessage("Enter last name");

      expect(screen.getByLabelText(/^password$/i)).toHaveErrorMessage(
        "Enter password"
      );

      expect(screen.getByLabelText(/^confirm password$/i)).toHaveErrorMessage(
        "Enter confirm password"
      );
    });

    it("Display an error message for invalid password", async () => {
      const { user } = renderTestUI(<RegisterUser />);
      const password = screen.getByLabelText(/^password$/i);

      await user.type(password, "pass");
      await user.click(screen.getByRole("button", { name: /^register$/i }));
      expect(password).toHaveErrorMessage(shortPassword);

      await user.clear(password);
      await user.type(password, "Pass!WOrd");
      await user.click(screen.getByRole("button", { name: /^register$/i }));
      expect(password).toHaveErrorMessage(invalidPassword);

      await user.clear(password);
      await user.type(password, "PASS!W0RD");
      await user.click(screen.getByRole("button", { name: /^register$/i }));
      expect(password).toHaveErrorMessage(invalidPassword);

      await user.clear(password);
      await user.type(password, "pass!w0rd");
      await user.click(screen.getByRole("button", { name: /^register$/i }));
      expect(password).toHaveErrorMessage(invalidPassword);

      await user.clear(password);
      await user.type(password, "PassW0rd");
      await user.click(screen.getByRole("button", { name: /^register$/i }));
      expect(password).toHaveErrorMessage(invalidPassword);
    });

    it("Display an error message if passwords do not match", async () => {
      const { user } = renderTestUI(<RegisterUser />);
      const confirmPassword = screen.getByLabelText(/^confirm password$/i);

      await user.type(screen.getByLabelText(/^password$/i), PASSWORD);
      await user.type(confirmPassword, "PASSWORD");
      await user.click(screen.getByRole("button", { name: /^register$/i }));

      expect(confirmPassword).toHaveErrorMessage("Passwords do not match");
    });

    it("Display an error message if first and last names are invalid", async () => {
      const { user } = renderTestUI(<RegisterUser />);
      const firstName = screen.getByRole("textbox", { name: /^first name$/i });
      const lastName = screen.getByRole("textbox", { name: /^last name$/i });

      await user.type(firstName, "John123");
      await user.type(lastName, "4D5o6e7");
      await user.click(screen.getByRole("button", { name: /^register$/i }));

      expect(firstName).toHaveErrorMessage(invalidFirstName);
      expect(lastName).toHaveErrorMessage(invalidLastName);
    });
  });

  describe("Server responds with an error/unsupported object response", () => {
    describe("Validation errors", () => {
      it("Show input error messages for empty fields validation error", async () => {
        const { user } = renderTestUI(<RegisterUser />, validationOne.gql());
        const fName = screen.getByRole("textbox", { name: /^first name$/i });

        await dryEvents(user);

        await waitFor(() => {
          expect(fName).toHaveErrorMessage("Enter first name");
        });

        expect(
          screen.getByRole("textbox", { name: /^last name$/i })
        ).toHaveErrorMessage("Enter last name");

        expect(screen.getByLabelText(/^password$/i)).toHaveErrorMessage(
          "Enter password"
        );

        expect(fName).toHaveFocus();

        expect(
          screen.getByRole("button", { name: /^register$/i })
        ).toBeEnabled();
      });

      it("Show input error messages for invalid fields validation error", async () => {
        const { user } = renderTestUI(<RegisterUser />, validationTwo.gql());
        const fName = screen.getByRole("textbox", { name: /^first name$/i });

        await dryEvents(user);

        await waitFor(() => {
          expect(fName).toHaveErrorMessage(invalidFirstName);
        });

        expect(
          screen.getByRole("textbox", { name: /^last name$/i })
        ).toHaveErrorMessage(invalidLastName);

        expect(screen.getByLabelText(/^password$/i)).toHaveErrorMessage(
          shortPassword
        );

        expect(screen.getByLabelText(/^confirm password$/i)).toHaveErrorMessage(
          "Passwords do not match"
        );

        expect(fName).toHaveFocus();

        expect(
          screen.getByRole("button", { name: /^register$/i })
        ).toBeEnabled();
      });
    });

    describe("Display an alert box", () => {
      it.each(table1)("%s", async (_, expected) => {
        const { user } = renderTestUI(<RegisterUser />, expected.gql());

        await dryEvents(user);

        expect(await screen.findByRole("alert")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(expected.message);
        expect(
          screen.getByRole("button", { name: /^register$/i })
        ).toBeEnabled();
      });
    });

    describe("Redirect the user to another page", () => {
      it.each(table2)(
        "Redirect to the %s page if the user %s",
        async (_, __, { path, expected }) => {
          const router = useRouter();
          const { user } = renderTestUI(<RegisterUser />, expected.gql());

          await dryEvents(user);

          await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
          expect(router.replace).toHaveBeenCalledWith(path);
        }
      );
    });
  });

  describe("Successful user registration", () => {
    it("Update apollo cache and redirect to the home(dashboard) page", async () => {
      const router = useRouter();
      const { user } = renderTestUI(<RegisterUser />, success.gql());

      await dryEvents(user);

      await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });

  afterAll(() => {
    localStorage.removeItem(SESSION_ID);
  });
});
