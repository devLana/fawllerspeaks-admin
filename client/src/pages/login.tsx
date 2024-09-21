import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import useStatusAlert from "@hooks/login/useStatusAlert";
import AlertToast from "@features/auth/components/AlertToast";
import Down from "@components/SlideTransitions/Down";
import AuthRootLayout from "@layouts/AuthRootLayout";
import NextLink from "@components/NextLink";
import Card from "@features/auth/components/Card";
import LoginForm from "@features/auth/login/LoginForm";
import uiLayout from "@utils/layouts/uiLayout";
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
        transition={Down}
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
