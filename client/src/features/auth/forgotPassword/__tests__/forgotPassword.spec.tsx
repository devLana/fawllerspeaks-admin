import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import ForgotPasswordPage from "@pages/forgot-password";
import { renderUI } from "@utils/tests/renderUI";

vi.mock("../ForgotPasswordForm");

describe("Forgot Password Page", () => {
  afterAll(() => {
    const router = useRouter();
    router.query = {};
  });

  it.each([
    [
      "Should display an alert message toast if a malformed password reset token string was provided",
      "invalid",
      "Invalid password reset token",
    ],
    [
      "Should display an alert message toast if a password reset token validation error occurred",
      "validation",
      "Invalid password reset token",
    ],
    [
      "Should display an alert message toast if the password reset token was unknown or had expired",
      "fail",
      "Unable to verify password reset token",
    ],
    [
      "Should display an alert message toast if the password reset token verification response was an unsupported object type",
      "unsupported",
      "Unable to verify password reset token",
    ],
    [
      "Should display an alert message toast if a graphql error was thrown while verifying the password reset token ",
      "api",
      "Unable to verify password reset token",
    ],
    [
      "Should display an alert message toast if a network error failed the password reset token verification",
      "network",
      "Unable to verify password reset token. Please try again later",
    ],
    [
      "Should display an alert message toast if there was an error trying to reset the password",
      "error",
      "There was an error trying to reset your password. Please try again later",
    ],
  ])("%s", (_, status, message) => {
    const router = useRouter();
    router.query = { status };

    renderUI(<ForgotPasswordPage />);

    expect(screen.getByRole("alert")).toHaveTextContent(message);
  });
});
