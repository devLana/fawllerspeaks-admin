import * as React from "react";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import useStatusAlert from "@features/login/hooks/useStatusAlert";
import AlertToast from "@components/AlertToast";
import AuthRootLayout from "@layouts/AuthRootLayout";
import NextLink from "@components/NextLink";
import Card from "@components/Card";
import LoginForm from "@features/login/components/LoginForm";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";

const Login: NextPageWithLayout = () => {
  const { handleCloseAlert, message, open } = useStatusAlert();

  return (
    <>
      <AlertToast
        horizontal="center"
        vertical="top"
        isOpen={open}
        onClose={handleCloseAlert}
        direction="down"
        severity="info"
        content={message}
      />
      <Typography variant="h1">Sign In</Typography>
      <Card>
        <LoginForm />
        <Divider light sx={{ mt: 3.5, mb: 3 }} />
        <Typography align="center">
          <NextLink href="/forgot-password">
            Can&apos;t Remember Your Password?
          </NextLink>
        </Typography>
      </Card>
    </>
  );
};

Login.layout = uiLayout(AuthRootLayout, {
  title: "Log In To FawllerSpeaks Admin",
});

export default Login;
