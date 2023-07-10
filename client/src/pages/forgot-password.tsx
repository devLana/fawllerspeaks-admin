import * as React from "react";

import { useMutation } from "@apollo/client";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import useStatusAlert from "@features/forgotPassword/useStatusAlert";
import AuthLayout from "@layouts/AuthLayout";
import NextLink from "@components/NextLink";
import Toast from "@components/Toast";
import Card from "@components/Card";
import UnregisteredUserAlert from "@components/UnregisteredUserAlert";
import ForgotPasswordForm from "@features/forgotPassword/components/ForgotPasswordForm";
import ForgotPasswordSuccess from "@features/forgotPassword/components/ForgotPasswordSuccess";
import { FORGOT_PASSWORD } from "@features/forgotPassword/FORGOT_PASSWORD";
import { forgotPasswordValidator } from "@features/forgotPassword/forgotPasswordValidator";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";
import type { MutationForgotPasswordArgs } from "@apiTypes";

type View = "form" | "unregistered error" | "success";

const ForgotPassword: NextPageWithLayout = () => {
  const [hasError, setHasError] = React.useState(false);
  const [view, setView] = React.useState<View>("form");
  const [loading, setLoading] = React.useState(false);

  const [mutation, { error, data }] = useMutation(FORGOT_PASSWORD, {
    onError() {
      setHasError(true);
      setLoading(false);
    },
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
    setLoading(true);

    const { data: mutationData } = await mutation({ variables: values });

    if (mutationData) {
      switch (mutationData.forgotPassword.__typename) {
        case "EmailValidationError": {
          const { emailError } = mutationData.forgotPassword;

          if (emailError) {
            setError("email", { message: emailError }, { shouldFocus: true });
          }

          setLoading(false);
          break;
        }

        case "NotAllowedError":
        case "ServerError":
          setHasError(true);
          setLoading(false);
          break;

        case "RegistrationError":
          setView("unregistered error");
          break;

        case "Response":
          setView("success");
          break;

        default:
          setHasError(true);
          setLoading(false);
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
      {hasError && (
        <Toast
          horizontal="center"
          vertical="top"
          isOpen={hasError}
          onClose={() => setHasError(false)}
          direction="down"
          severity="error"
          content={alertMessage}
        />
      )}
      {statusMessage && (
        <Toast
          horizontal="center"
          vertical="top"
          isOpen={!!statusMessage}
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
          isLoading={loading}
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

ForgotPassword.layout = uiLayout(AuthLayout, {
  title: "Forgot Password - Request For Password Reset Link",
});

export default ForgotPassword;
