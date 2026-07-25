import { setupServer } from "msw/node";

import { forgotPasswordHandler } from "@features/auth/forgotPassword/components/ForgotPasswordForm/__tests__/ForgotPasswordForm.mocks";
import { loginHandler } from "@features/auth/login/LoginForm/__tests__/LoginForm.mocks";
import { registerUserHandler } from "@features/auth/registerUser/RegisterUserForm/__tests__/RegisterUserForm.mocks";
import { verifyResetHandler } from "@features/auth/verifyResetToken/__tests__/verifyResetToken.mocks";
import { resetPasswordHandler } from "@features/auth/resetPassword/components/ResetPasswordForm/__tests__/ResetPasswordForm.mocks";

export const testServer = setupServer(
  forgotPasswordHandler,
  loginHandler,
  registerUserHandler,
  verifyResetHandler,
  resetPasswordHandler
);
