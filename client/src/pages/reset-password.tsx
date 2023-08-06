import * as React from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { useMutation } from "@apollo/client";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import AuthRootLayout from "@layouts/AuthRootLayout";
import Card from "@components/Card";
import UnregisteredUserAlert from "@components/UnregisteredUserAlert";
import ResetPasswordForm from "@features/resetPassword/components/ResetPasswordForm";
import ResetPasswordSuccess from "@features/resetPassword/components/ResetPasswordSuccess";
import { RESET_PASSWORD } from "@features/resetPassword/operations/RESET_PASSWORD";
import { onError } from "@features/resetPassword/utils/onError";
import { resetPasswordValidator } from "@features/resetPassword/utils/resetPasswordValidator";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";
import type { MutationResetPasswordArgs } from "@apiTypes";

import verifyPasswordResetToken, {
  type ResetPasswordPageData,
} from "@features/resetPassword/utils/verifyPasswordResetToken";

type OmitToken = Omit<MutationResetPasswordArgs, "token">;
type View = "form" | "unregistered error" | "success";
type GssP = GetServerSideProps<ResetPasswordPageData>;
type ResetPasswordPage = NextPageWithLayout<InferGetServerSidePropsType<GssP>>;

export const getServerSideProps: GssP = async ({ query }) => {
  return verifyPasswordResetToken(query);
};

const ResetPassword: ResetPasswordPage = ({ isUnregistered, verified }) => {
  const [view, setView] = React.useState<View>("form");

  const { push } = useRouter();

  const [reset, { data }] = useMutation(RESET_PASSWORD, {
    onError: err => onError(err, push),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<OmitToken>({
    resolver: yupResolver(resetPasswordValidator),
  });

  const submitHandler = async (values: OmitToken) => {
    const token = verified?.resetToken ?? "";

    const { data: response } = await reset({ variables: { ...values, token } });

    if (response) {
      switch (response.resetPassword.__typename) {
        case "ResetPasswordValidationError": {
          const {
            passwordError,
            confirmPasswordError: confirmPwdErr,
            tokenError,
          } = response.resetPassword;

          const focus = { shouldFocus: true };

          if (tokenError) {
            void push("/forgot-password?status=validation");
            return;
          }

          if (confirmPwdErr) {
            setError("confirmPassword", { message: confirmPwdErr }, focus);
          }

          if (passwordError) {
            setError("password", { message: passwordError }, focus);
          }

          break;
        }

        case "NotAllowedError":
          void push("/forgot-password?status=fail");
          break;

        case "RegistrationError":
          setView("unregistered error");
          break;

        case "Response":
          setView("success");
          break;

        default:
          void push("/forgot-password?status=unsupported");
      }
    }
  };

  const loading = isSubmitting || isSubmitSuccessful;

  const email = verified?.email ?? "";

  const status =
    data?.resetPassword.__typename === "Response"
      ? data.resetPassword.status
      : null;

  if (isUnregistered || view === "unregistered error") {
    return (
      <UnregisteredUserAlert>
        It appears you are trying to reset the password of an unregistered
        account.
      </UnregisteredUserAlert>
    );
  }

  if (view === "success") return <ResetPasswordSuccess status={status} />;

  return (
    <>
      <Typography align="center" variant="h1">
        Reset Your Password
      </Typography>
      <Card sx={{ maxWidth: { xs: "21.875rem", sm: "25rem" } }}>
        <ResetPasswordForm
          isLoading={loading}
          onSubmit={handleSubmit(submitHandler)}
          register={register}
          fieldErrors={errors}
          email={email}
        />
      </Card>
    </>
  );
};

ResetPassword.layout = uiLayout(AuthRootLayout, {
  title: "Reset Password - Reset Your FawllerSpeaks Admin Password",
});

export default ResetPassword;
