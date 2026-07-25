import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import { ForgotPassword } from "@pages/forgot-password";
import { renderUI } from "@utils/tests/renderUI";

vi.mock("../ForgotPasswordForm");

describe("Forgot Password Page", () => {
  afterAll(() => {
    const router = useRouter();
    router.query = {};
  });

  it.each([
    [
      "Expect an alert message toast if a network error occurred while trying to reset a password",
      "network",
      "We cannot verify your password reset token at this time. Please try again later",
    ],
    [
      "Expect an alert message toast if there was an error while trying to reset the password",
      "error",
      "You cannot reset your password right now. Please try again later",
    ],
  ])("%s", (_, status, message) => {
    const router = useRouter();
    router.query = { status };

    renderUI(<ForgotPassword />);

    expect(screen.getByRole("alert")).toHaveTextContent(message);
  });
});
