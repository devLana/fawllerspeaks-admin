import * as React from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import Typography from "@mui/material/Typography";

import AuthRootLayout from "@layouts/AuthRootLayout";
import Card from "@features/auth/components/Card";
import UnregisteredUserAlert from "@features/auth/components/UnregisteredUserAlert";
import ResetPasswordForm from "@features/auth/resetPassword/components/ResetPasswordForm";
import ResetPasswordSuccess from "@features/auth/resetPassword/components/ResetPasswordSuccess";
import verifyPasswordResetToken from "@features/auth/resetPassword/api/verifyPasswordResetToken";
import uiLayout from "@utils/layouts/uiLayout";
import type { NextPageWithLayout } from "@types";
import type { ResetPasswordPageData, View } from "types/resetPassword";

type GssP = GetServerSideProps<ResetPasswordPageData>;
type ResetPasswordPage = NextPageWithLayout<InferGetServerSidePropsType<GssP>>;

const ResetPassword: ResetPasswordPage = ({ isUnregistered, verified }) => {
  const [view, setView] = React.useState<View>("form");

  if (isUnregistered || view === "unregistered error") {
    return (
      <UnregisteredUserAlert>
        It appears you are trying to reset the password of an unregistered
        account.
      </UnregisteredUserAlert>
    );
  }

  if (view === "success" || view === "warn") {
    return <ResetPasswordSuccess view={view} />;
  }

  return (
    <>
      <Typography align="center" variant="h1" id="page-title">
        Reset Your Password
      </Typography>
      <Card>
        <ResetPasswordForm
          {...verified}
          handleView={nextView => setView(nextView)}
        />
      </Card>
    </>
  );
};

ResetPassword.layout = uiLayout(AuthRootLayout, {
  title: "Reset Password - Reset Your FawllerSpeaks Admin Password",
});

export const getServerSideProps: GssP = async ({ query }) => {
  return verifyPasswordResetToken(query);
};

export default ResetPassword;
