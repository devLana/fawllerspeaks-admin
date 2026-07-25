import { useState } from "react";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { useForgotPasswordStatusAlert } from "@hooks/auth/forgotPassword/useForgotPasswordStatusAlert";
import NextLink from "@components/ui/NextLink";
import Card from "@features/auth/components/Card";
import ForgotPasswordForm from "@features/auth/forgotPassword/components/ForgotPasswordForm";
import ForgotPasswordSuccess from "@features/auth/forgotPassword/components/ForgotPasswordSuccess";
import authPageLayout from "@utils/layouts/authPageLayout";

export const ForgotPassword = () => {
  const [view, setView] = useState<"form" | "success">("form");
  useForgotPasswordStatusAlert();

  if (view === "success") return <ForgotPasswordSuccess />;

  return (
    <>
      <Typography variant="h1" align="center" id="page-title">
        Forgot Password
      </Typography>
      <Card>
        <Typography align="center" sx={{ mb: "1.5rem" }}>
          Can&apos;t remember your password? Enter your e-mail below to have a
          password reset link sent to you
        </Typography>
        <ForgotPasswordForm onSuccess={() => setView("success")} />
        <Divider sx={{ opacity: 0.6, mt: 3.5, mb: 3 }} />
        <Typography align="center">
          Still Remember Your Password?&nbsp;
          <NextLink href="/login">Login</NextLink>
        </Typography>
      </Card>
    </>
  );
};

export default authPageLayout(ForgotPassword, {
  title: "Forgot Password - Request For Password Reset Link",
});
