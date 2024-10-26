import { screen } from "@testing-library/react";

import ResetPassword from "@pages/reset-password";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./mocks/resetPassword.mocks";

vi.mock("../components/ResetPasswordForm");

describe("Reset Password Page", () => {
  it("The page is pre-rendered with unregistered user data, Expect an information alert box", () => {
    renderUI(<ResetPassword isUnregistered />);

    expect(screen.queryByRole("form", mocks.form)).not.toBeInTheDocument();
    expect(screen.getByText(mocks.msg)).toBeInTheDocument();
  });

  it("The page is pre-rendered with the user's email and password reset token, Expect the reset password form to be displayed", () => {
    renderUI(<ResetPassword verified={mocks.verified} />);

    expect(screen.getByRole("form", mocks.form)).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /^e-?mail$/i })
    ).toHaveDisplayValue(mocks.verified.email);
  });
});
