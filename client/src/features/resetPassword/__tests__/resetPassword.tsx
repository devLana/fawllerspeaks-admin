import { useRouter } from "next/router";
import type { GetServerSidePropsContext as GssPContext } from "next";

import { screen, waitFor } from "@testing-library/react";

import ResetPassword, { getServerSideProps } from "@pages/reset-password";
import apolloClient from "@lib/apolloClient";
import { renderTestUI } from "@utils/renderTestUI";
import {
  type MutateResult,
  resetTableOne,
  resetTableThree,
  resetTableTwo,
  resetUnregistered as rUnregistered,
  resetValidation1 as rValidation,
  verified,
  verifyErrorObjects,
  verifyErrors,
  verifyProps,
  verifyValidate,
  msg,
} from "../utils/resetPassword.mocks";

jest.mock("@lib/apolloClient");

describe("Reset Password", () => {
  describe("ResetPassword page - getServerSideProps", () => {
    describe("Validate password reset token", () => {
      it.each(verifyValidate)("%s", async (_, tId, status) => {
        const context = { query: { tId } } as unknown as GssPContext;

        const result = await getServerSideProps(context);

        expect(result).not.toHaveProperty("props");
        expect(result).toHaveProperty(
          "redirect.destination",
          `/forgot-password?status=${status}`
        );
      });
    });

    describe("Verify password reset token", () => {
      type Mutate = jest.MockedObject<{ mutate: () => Promise<MutateResult> }>;

      const context = { query: { tId: "userToken" } } as unknown as GssPContext;
      const mockClient = apolloClient() as unknown as Mutate;

      describe("Verification resolves with an error/unsupported object type", () => {
        it.each(verifyErrorObjects)("%s", async (_, data, destination) => {
          mockClient.mutate.mockResolvedValue({ data, errors: undefined });

          const result = await getServerSideProps(context);

          expect(result).not.toHaveProperty("props");
          expect(result).toHaveProperty("redirect.destination", destination);
        });
      });

      describe("Verification rejects with an error", () => {
        it.each(verifyErrors)("%s", async (_, errors, status) => {
          mockClient.mutate.mockResolvedValue({ data: undefined, errors });

          const result = await getServerSideProps(context);

          expect(result).not.toHaveProperty("props");
          expect(result).toHaveProperty(
            "redirect.destination",
            `/forgot-password?status=${status}`
          );
        });
      });

      describe.each(verifyProps)("%s", (_, title, { data, props }) => {
        it(`${title}`, async () => {
          mockClient.mutate.mockResolvedValue({ data, errors: undefined });

          const result = await getServerSideProps(context);

          expect(result).not.toHaveProperty("redirect");
          expect(result).toHaveProperty("props", props);
        });
      });
    });
  });

  describe("ResetPassword page is pre-rendered with server side data", () => {
    it("User account is unregistered, Display an information dialog box", async () => {
      renderTestUI(<ResetPassword isUnregistered />);

      const presentation = await screen.findByRole("presentation");

      expect(presentation).toBeInTheDocument();
      expect(presentation).toHaveTextContent(
        "It appears you are trying to reset the password of an unregistered account."
      );
    });

    it("Display the e-mail address of the account in a readonly textbox", async () => {
      renderTestUI(<ResetPassword verified={verified} />);

      const textbox = await screen.findByRole("textbox", { name: /e-?mail/i });

      expect(textbox).toHaveDisplayValue(verified.email);
    });
  });

  describe("ResetPassword Page", () => {
    const resetButton = { name: /^reset password$/i };

    describe("Client-side form validation, Show input field error messages", () => {
      it("If all input fields are empty", async () => {
        const { user } = renderTestUI(<ResetPassword verified={verified} />);

        await user.click(screen.getByRole("button", resetButton));

        expect(screen.getByLabelText(/^password$/i)).toHaveErrorMessage(
          "Enter password"
        );

        expect(screen.getByLabelText(/^confirm password$/i)).toHaveErrorMessage(
          "Enter confirm password"
        );
      });

      it("When the password field has an invalid value", async () => {
        const { user } = renderTestUI(<ResetPassword verified={verified} />);

        await user.type(screen.getByLabelText(/^password$/i), "pass");
        await user.click(screen.getByRole("button", resetButton));
        expect(screen.getByLabelText(/^password$/i)).toHaveErrorMessage(
          "Password must be at least 8 characters long"
        );

        await user.clear(screen.getByLabelText(/^password$/i));
        await user.type(screen.getByLabelText(/^password$/i), "Pass!WOrd");
        await user.click(screen.getByRole("button", resetButton));
        expect(screen.getByLabelText(/^password$/i)).toHaveErrorMessage(msg);

        await user.clear(screen.getByLabelText(/^password$/i));
        await user.type(screen.getByLabelText(/^password$/i), "PASS!W0RD");
        await user.click(screen.getByRole("button", resetButton));
        expect(screen.getByLabelText(/^password$/i)).toHaveErrorMessage(msg);

        await user.clear(screen.getByLabelText(/^password$/i));
        await user.type(screen.getByLabelText(/^password$/i), "pass!w0rd");
        await user.click(screen.getByRole("button", resetButton));
        expect(screen.getByLabelText(/^password$/i)).toHaveErrorMessage(msg);

        await user.clear(screen.getByLabelText(/^password$/i));
        await user.type(screen.getByLabelText(/^password$/i), "PassW0rd");
        await user.click(screen.getByRole("button", resetButton));
        expect(screen.getByLabelText(/^password$/i)).toHaveErrorMessage(msg);
      });

      it("If passwords do not match", async () => {
        const { user } = renderTestUI(<ResetPassword verified={verified} />);
        const confirmPassword = screen.getByLabelText(/^confirm password$/i);

        await user.type(screen.getByLabelText(/^password$/i), "PassW0!rd");
        await user.type(confirmPassword, "password");
        await user.click(screen.getByRole("button", resetButton));

        expect(confirmPassword).toHaveErrorMessage("Passwords do not match");
      });
    });

    describe("Reset password request is sent to server", () => {
      it("Show input field error messages if password validation fails", async () => {
        const { user } = renderTestUI(
          <ResetPassword verified={verified} />,
          rValidation.gql()
        );

        const password = screen.getByLabelText(/^password$/i);
        const confirmPassword = screen.getByLabelText(/^confirm Password$/i);
        const { confirmPasswordError, passwordError } = rValidation;

        await user.type(password, rValidation.password);
        await user.type(confirmPassword, rValidation.password);
        await user.click(screen.getByRole("button", resetButton));

        expect(screen.getByRole("button", resetButton)).toBeDisabled();

        await waitFor(() => expect(password).toHaveErrorMessage(passwordError));

        expect(confirmPassword).toHaveErrorMessage(confirmPasswordError);
        expect(password).toHaveFocus();
        expect(screen.getByRole("button", resetButton)).toBeEnabled();
      });

      it.each(resetTableOne)("%s", async (_, status, mock) => {
        const { push } = useRouter();
        const { password } = mock;

        const { user } = renderTestUI(
          <ResetPassword verified={verified} />,
          mock.gql()
        );

        await user.type(screen.getByLabelText(/^password$/i), password);
        await user.type(screen.getByLabelText(/^confirm Password$/i), password);
        await user.click(screen.getByRole("button", resetButton));

        expect(screen.getByRole("button", resetButton)).toBeDisabled();

        await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
        expect(push).toHaveBeenCalledWith(`/forgot-password?status=${status}`);
      });

      it.each(resetTableTwo)("%s", async (_, status, mock) => {
        const { push } = useRouter();
        const { password } = mock;

        const { user } = renderTestUI(
          <ResetPassword verified={verified} />,
          mock.gql()
        );

        await user.type(screen.getByLabelText(/^password$/i), password);
        await user.type(screen.getByLabelText(/^confirm Password$/i), password);
        await user.click(screen.getByRole("button", resetButton));

        expect(screen.getByRole("button", resetButton)).toBeDisabled();

        await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
        expect(push).toHaveBeenCalledWith(`/forgot-password?status=${status}`);
      });
    });

    describe("Reset password request responds with an unregistered error", () => {
      it("Display an information dialog box", async () => {
        const { password } = rUnregistered;

        const { user } = renderTestUI(
          <ResetPassword verified={verified} />,
          rUnregistered.gql()
        );

        await user.type(screen.getByLabelText(/^password$/i), password);
        await user.type(screen.getByLabelText(/^confirm Password$/i), password);
        await user.click(screen.getByRole("button", resetButton));

        expect(screen.getByRole("button", resetButton)).toBeDisabled();

        const presentation = await screen.findByRole("presentation");

        expect(presentation).toBeInTheDocument();
        expect(presentation).toHaveTextContent(
          "It appears you are trying to reset the password of an unregistered account."
        );
      });
    });

    describe("User password is successfully reset", () => {
      it.each(resetTableThree)("Display %s", async (_, status, mock) => {
        const { password } = mock;

        const { user } = renderTestUI(
          <ResetPassword verified={verified} />,
          mock.gql()
        );

        await user.type(screen.getByLabelText(/^password$/i), password);
        await user.type(screen.getByLabelText(/^confirm Password$/i), password);
        await user.click(screen.getByRole("button", resetButton));

        expect(screen.getByRole("button", resetButton)).toBeDisabled();

        expect(await screen.findByRole("presentation")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveClass(status);
      });
    });
  });
});
