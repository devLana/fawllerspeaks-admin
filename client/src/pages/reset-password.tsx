import * as React from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { useMutation } from "@apollo/client";
import Typography from "@mui/material/Typography";

import AuthRootLayout from "@layouts/AuthRootLayout";
import Card from "@components/Card";
import UnregisteredUserAlert from "@components/UnregisteredUserAlert";
import ResetPasswordForm from "@features/resetPassword/components/ResetPasswordForm";
import ResetPasswordSuccess from "@features/resetPassword/components/ResetPasswordSuccess";
import { RESET_PASSWORD } from "@features/resetPassword/operations/RESET_PASSWORD";
import verifyPasswordResetToken, {
  type ResetPasswordPageData,
} from "@features/resetPassword/api/verifyPasswordResetToken";
import uiLayout from "@layouts/utils/uiLayout";
import type { AuthPageView, NextPageWithLayout } from "@types";

type GssP = GetServerSideProps<ResetPasswordPageData>;
type ResetPasswordPage = NextPageWithLayout<InferGetServerSidePropsType<GssP>>;

const ResetPassword: ResetPasswordPage = ({ isUnregistered, verified }) => {
  const [view, setView] = React.useState<AuthPageView>("form");
  const [resetPassword, { data }] = useMutation(RESET_PASSWORD);

  if (isUnregistered || view === "unregistered error") {
    return (
      <UnregisteredUserAlert>
        It appears you are trying to reset the password of an unregistered
        account.
      </UnregisteredUserAlert>
    );
  }

  const status = data?.resetPassword.status ?? null;

  if (view === "success") return <ResetPasswordSuccess status={status} />;

  return (
    <>
      <Typography align="center" variant="h1">
        Reset Your Password
      </Typography>
      <Card>
        <ResetPasswordForm
          {...verified}
          resetPassword={resetPassword}
          setView={setView}
        />
      </Card>
    </>
  );
};

export const getServerSideProps: GssP = async ({ query }) => {
  return verifyPasswordResetToken(query);
};

ResetPassword.layout = uiLayout(AuthRootLayout, {
  title: "Reset Password - Reset Your FawllerSpeaks Admin Password",
});

export default ResetPassword;
