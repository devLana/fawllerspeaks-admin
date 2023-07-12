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
  beforeAll(() => {
    const router = useRouter();
    router.pathname = "/register";
  });

  beforeEach(() => {
    localStorage.setItem(SESSION_ID, SESSIONID);
  });

  const dryEvents = async (user: UserEvent) => {
    const button = await screen.findByRole("button", { name: "Register" });

    await user.type(screen.getByLabelText("First Name"), FIRST_NAME);
    await user.type(screen.getByLabelText("Last Name"), LAST_NAME);
    await user.type(screen.getByLabelText("Password"), PASSWORD);
    await user.type(screen.getByLabelText("Confirm Password"), PASSWORD);
    await user.click(button);

    expect(button).toBeDisabled();
  };

  describe("Client side form validation", () => {
    it("Display error messages for empty input fields", async () => {
      const { user } = renderTestUI(<RegisterUser />);
      const button = await screen.findByRole("button", { name: "Register" });

      await user.click(button);

      expect(screen.getByText("Enter first name")).toBeInTheDocument();
      expect(screen.getByText("Enter last name")).toBeInTheDocument();
      expect(screen.getByText("Enter password")).toBeInTheDocument();
      expect(screen.getByText("Enter confirm password")).toBeInTheDocument();
    });

    it("Display an error message for invalid password", async () => {
      const { user } = renderTestUI(<RegisterUser />);
      const button = await screen.findByRole("button", { name: "Register" });
      const password = screen.getByLabelText("Password");

      await user.type(password, "pass");
      await user.click(button);
      expect(screen.getByText(shortPassword)).toBeInTheDocument();

      await user.clear(password);
      await user.type(password, "Pass!WOrd");
      await user.click(button);
      expect(screen.getByText(invalidPassword)).toBeInTheDocument();

      await user.clear(password);
      await user.type(password, "PASS!W0RD");
      await user.click(button);
      expect(screen.getByText(invalidPassword)).toBeInTheDocument();

      await user.clear(password);
      await user.type(password, "pass!w0rd");
      await user.click(button);
      expect(screen.getByText(invalidPassword)).toBeInTheDocument();

      await user.clear(password);
      await user.type(password, "PassW0rd");
      await user.click(button);
      expect(screen.getByText(invalidPassword)).toBeInTheDocument();
    });

    it("Display an error message if passwords do not match", async () => {
      const { user } = renderTestUI(<RegisterUser />);
      const button = await screen.findByRole("button", { name: "Register" });

      await user.type(screen.getByLabelText("Password"), PASSWORD);
      await user.type(screen.getByLabelText("Confirm Password"), "PASSWORD");
      await user.click(button);

      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    it("Display an error message if first and last names are invalid", async () => {
      const { user } = renderTestUI(<RegisterUser />);
      const button = await screen.findByRole("button", { name: "Register" });

      await user.type(screen.getByLabelText("First Name"), "John123");
      await user.type(screen.getByLabelText("Last Name"), "4D5o6e7");
      await user.click(button);

      expect(screen.getByText(invalidFirstName)).toBeInTheDocument();
      expect(screen.getByText(invalidLastName)).toBeInTheDocument();
    });
  });

  describe("Server responds with an error/unsupported object response", () => {
    describe("Validation errors", () => {
      it("Show input error messages for a validation error", async () => {
        const { user } = renderTestUI(<RegisterUser />, validationOne.gql());

        await dryEvents(user);

        expect(await screen.findByText("Enter first name")).toBeInTheDocument();

        expect(screen.getByText("Enter last name")).toBeInTheDocument();
        expect(screen.getByText("Enter password")).toBeInTheDocument();
        expect(screen.getByLabelText("First Name")).toHaveFocus();
        expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
      });

      it("Show input error messages for invalid input validation errors", async () => {
        const { user } = renderTestUI(<RegisterUser />, validationTwo.gql());

        await dryEvents(user);

        expect(await screen.findByText(invalidFirstName)).toBeInTheDocument();

        expect(screen.getByText(invalidLastName)).toBeInTheDocument();
        expect(screen.getByText(shortPassword)).toBeInTheDocument();
        expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
        expect(screen.getByLabelText("First Name")).toHaveFocus();
        expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
      });
    });

    describe("Display an alert box", () => {
      it.each(table1)("%s", async (_, expected) => {
        const { user } = renderTestUI(<RegisterUser />, expected.gql());

        await dryEvents(user);

        expect(await screen.findByRole("alert")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(expected.message);
        expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
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
