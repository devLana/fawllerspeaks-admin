import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { useLoginStatusAlert } from "@hooks/auth/login/useLoginStatusAlert";
import NextLink from "@components/ui/NextLink";
import Card from "@features/auth/components/Card";
import LoginForm from "@features/auth/login/LoginForm";
import authPageLayout from "@utils/layouts/authPageLayout";

export const Login = () => {
  useLoginStatusAlert();

  return (
    <>
      <Typography variant="h1" id="page-title">
        Sign In
      </Typography>
      <Card>
        <LoginForm />
        <Divider sx={{ opacity: 0.6, mt: 3.5, mb: 3 }} />
        <Typography align="center">
          <NextLink href="/forgot-password">
            Can&apos;t Remember Your Password?
          </NextLink>
        </Typography>
      </Card>
    </>
  );
};

export default authPageLayout(Login, {
  title: "Log In To FawllerSpeaks Admin",
});
