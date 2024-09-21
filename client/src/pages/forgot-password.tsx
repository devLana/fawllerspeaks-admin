import * as React from "react";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import useStatusAlert from "@hooks/forgotPassword/useStatusAlert";
import AuthRootLayout from "@layouts/AuthRootLayout";
import NextLink from "@components/NextLink";
import AlertToast from "@features/auth/components/AlertToast";
import Down from "@components/SlideTransitions/Down";
import Card from "@features/auth/components/Card";
import UnregisteredUserAlert from "@features/auth/components/UnregisteredUserAlert";
import ForgotPasswordForm from "@features/auth/forgotPassword/components/ForgotPasswordForm";
import ForgotPasswordSuccess from "@features/auth/forgotPassword/components/ForgotPasswordSuccess";
import uiLayout from "@utils/layouts/uiLayout";
import type { AuthPageView, NextPageWithLayout } from "@types";

const ForgotPassword: NextPageWithLayout = () => {
  const [view, setView] = React.useState<AuthPageView>("form");
  const { open, message, handleCloseAlert } = useStatusAlert();

  if (view === "success") return <ForgotPasswordSuccess />;

  if (view === "unregistered error") {
    return (
      <UnregisteredUserAlert>
        It appears the account belonging to the e-mail address you provided has
        not been registered yet.
      </UnregisteredUserAlert>
    );
  }

  return (
    <>
      <AlertToast
        horizontal="center"
        vertical="top"
        isOpen={open}
        onClose={handleCloseAlert}
        transition={Down}
        severity="info"
        content={message}
      />
      <Typography variant="h1" align="center">
        Forgot Password
      </Typography>
      <Card>
        <Typography align="center" sx={{ mb: "1.5rem" }}>
          Can&apos;t remember your password? Enter your e-mail below to have a
          password reset link sent to you
        </Typography>
        <ForgotPasswordForm setView={setView} />
        <Divider light sx={{ mt: 3.5, mb: 3 }} />
        <Typography align="center">
          Still Remember Your Password?&nbsp;
          <NextLink href="/login">Login</NextLink>
        </Typography>
      </Card>
    </>
  );
};

ForgotPassword.layout = uiLayout(AuthRootLayout, {
  title: "Forgot Password - Request For Password Reset Link",
});

export default ForgotPassword;
