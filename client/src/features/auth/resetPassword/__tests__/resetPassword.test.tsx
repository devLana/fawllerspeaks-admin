import { screen } from "@testing-library/react";

import { ResetPassword } from "@pages/reset-password";
import { renderUI } from "@utils/tests/renderUI";

vi.mock("../components/ResetPasswordForm");

describe("Reset Password Page", () => {
  const email = "reset_password_test@mail.org";
  const resetToken = "VERIFIED_PASSWORD_RESET_TOKEN";

  it("The page is pre-rendered with the user's email and password reset token, Expect the reset password form to be displayed", () => {
    renderUI(<ResetPassword email={email} resetToken={resetToken} />);

    expect(
      screen.getByRole("form", { name: /^reset your password$/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /^e-?mail$/i })
    ).toHaveDisplayValue(email);
  });
});
