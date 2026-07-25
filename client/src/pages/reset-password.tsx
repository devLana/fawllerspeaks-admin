import { useState } from "react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

import Typography from "@mui/material/Typography";

import Card from "@features/auth/components/Card";
import ResetPasswordForm from "@features/auth/resetPassword/components/ResetPasswordForm";
import ResetPasswordSuccess from "@features/auth/resetPassword/components/ResetPasswordSuccess";
import verifyResetToken from "@features/auth/verifyResetToken";
import authPageLayout from "@utils/layouts/authPageLayout";
import type { ResetPasswordPageData } from "@appTypes/auth/resetPassword";

type GssP = GetServerSideProps<ResetPasswordPageData>;
type ResetPasswordPage = NextPage<InferGetServerSidePropsType<GssP>>;

export const ResetPassword: ResetPasswordPage = ({ email, resetToken }) => {
  const [view, setView] = useState<"form" | "success">("form");

  if (view === "success") return <ResetPasswordSuccess />;

  return (
    <>
      <Typography align="center" variant="h1" id="page-title">
        Reset Your Password
      </Typography>
      <Card>
        <ResetPasswordForm
          email={email}
          resetToken={resetToken}
          onSuccess={() => setView("success")}
        />
      </Card>
    </>
  );
};

export const getServerSideProps: GssP = async ({ query }) => {
  return verifyResetToken(query);
};

export default authPageLayout(ResetPassword, {
  title: "Reset Password - Reset Your FawllerSpeaks Admin Password",
});
