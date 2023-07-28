import * as React from "react";

import { useMutation } from "@apollo/client";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import useStatusAlert from "@features/forgotPassword/hooks/useStatusAlert";
import AuthRootLayout from "@layouts/AuthRootLayout";
import NextLink from "@components/NextLink";
import Toast from "@components/Toast";
import Card from "@components/Card";
import UnregisteredUserAlert from "@components/UnregisteredUserAlert";
import ForgotPasswordForm from "@features/forgotPassword/components/ForgotPasswordForm";
import ForgotPasswordSuccess from "@features/forgotPassword/components/ForgotPasswordSuccess";
import { FORGOT_PASSWORD } from "@features/forgotPassword/operations/FORGOT_PASSWORD";
import { forgotPasswordValidator } from "@features/forgotPassword/utils/forgotPasswordValidator";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";
import type { MutationForgotPasswordArgs } from "@apiTypes";

type View = "form" | "unregistered error" | "success";
type Status = "idle" | "loading" | "error";

const ForgotPassword: NextPageWithLayout = () => {
  const [view, setView] = React.useState<View>("form");
  const [status, setStatus] = React.useState<Status>("idle");

  const [mutation, { error, data }] = useMutation(FORGOT_PASSWORD, {
    onError: () => setStatus("error"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<MutationForgotPasswordArgs>({
    resolver: yupResolver(forgotPasswordValidator),
  });

  const { statusMessage, setStatusMessage } = useStatusAlert();

  const submitHandler = async (values: MutationForgotPasswordArgs) => {
    setStatus("loading");

    const { data: mutationData } = await mutation({ variables: values });

    if (mutationData) {
      switch (mutationData.forgotPassword.__typename) {
        case "EmailValidationError": {
          const { emailError } = mutationData.forgotPassword;

          setError("email", { message: emailError }, { shouldFocus: true });
          setStatus("idle");

          break;
        }

        case "NotAllowedError":
        case "ServerError":
        default:
          setStatus("error");
          break;

        case "RegistrationError":
          setView("unregistered error");
          break;

        case "Response":
          setView("success");
          break;
      }
    }
  };

  let alertMessage =
    "You are unable to reset your password at the moment. Please try again later";

  if (
    data?.forgotPassword.__typename === "NotAllowedError" ||
    data?.forgotPassword.__typename === "ServerError"
  ) {
    alertMessage = data.forgotPassword.message;
  } else if (error?.graphQLErrors[0]) {
    alertMessage = error.graphQLErrors[0].message;
  }

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
      {status === "error" && (
        <Toast
          horizontal="center"
          vertical="top"
          isOpen={true}
          onClose={() => setStatus("idle")}
          direction="down"
          severity="error"
          content={alertMessage}
        />
      )}
      {statusMessage && (
        <Toast
          horizontal="center"
          vertical="top"
          isOpen={true}
          onClose={() => setStatusMessage(null)}
          direction="down"
          severity="info"
          content={statusMessage}
        />
      )}
      <Typography variant="h1" align="center">
        Forgot Password
      </Typography>
      <Card sx={{ maxWidth: { xs: "21.875rem", sm: "25rem" } }}>
        <Typography sx={{ mb: "1.5rem" }} align="center">
          Can&apos;t remember your password? Enter your e-mail below to have a
          password reset link sent to you
        </Typography>
        <ForgotPasswordForm
          isLoading={status === "loading"}
          register={register}
          fieldErrors={errors}
          onSubmit={handleSubmit(submitHandler)}
        />
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
