import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { useSession } from "@context/SessionContext";
import { useAuthHeaderHandler } from "@context/ApolloContext";
import useStatusAlert from "@features/login/hooks/useStatusAlert";
import AlertToast from "@components/AlertToast";
import AuthRootLayout from "@layouts/AuthRootLayout";
import NextLink from "@components/NextLink";
import Card from "@components/Card";
import LoginForm from "@features/login/components/LoginForm";
import { LOGIN_USER } from "@features/login/operations/LOGIN_USER";
import { loginValidator } from "@features/login/utils/loginValidator";
import { SESSION_ID } from "@utils/constants";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";
import type { MutationLoginArgs } from "@apiTypes";

type LoginFormValues = Omit<MutationLoginArgs, "sessionId">;

const Login: NextPageWithLayout = () => {
  const [status, setStatus] = React.useState<"idle" | "submitting">("idle");
  const [isOpen, setIsOpen] = React.useState(false);

  const { replace } = useRouter();

  const [login, { data, error }] = useMutation(LOGIN_USER);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<MutationLoginArgs>({ resolver: yupResolver(loginValidator) });

  const [statusMessage, setStatusMessage] = useStatusAlert(setIsOpen);
  const { handleUserId, handleRefreshToken } = useSession();
  const { handleAuthHeader } = useAuthHeaderHandler();

  const submitHandler = async (values: LoginFormValues) => {
    setStatus("submitting");

    const sessionId = localStorage.getItem(SESSION_ID);
    const variables: MutationLoginArgs = sessionId
      ? { ...values, sessionId }
      : values;

    const { data: loginData } = await login({
      variables,
      onError() {
        setStatus("idle");
        setIsOpen(true);
        setStatusMessage(null);
      },
    });

    if (loginData) {
      switch (loginData.login.__typename) {
        case "LoginValidationError": {
          const { emailError, passwordError, sessionIdError } = loginData.login;
          const focus = { shouldFocus: true };

          if (sessionIdError) setIsOpen(true);

          if (passwordError) {
            setError("password", { message: passwordError }, focus);
          }

          if (emailError) setError("email", { message: emailError }, focus);

          setStatus("idle");
          break;
        }

        case "NotAllowedError":
        default:
          setStatus("idle");
          setIsOpen(true);
          setStatusMessage(null);
          break;

        case "LoggedInUser": {
          const { __typename = "User", ...user } = loginData.login.user;

          if (user.isRegistered) {
            void replace("/");
          } else {
            void replace("/register");
          }

          localStorage.setItem(SESSION_ID, loginData.login.sessionId);
          handleAuthHeader(loginData.login.accessToken);
          handleRefreshToken(loginData.login.accessToken);
          handleUserId(`${__typename}:${user.id}`);

          break;
        }
      }
    }
  };

  let alertMessage =
    "You are unable to login at the moment. Please try again later";

  if (data?.login.__typename === "NotAllowedError") {
    alertMessage = data.login.message;
  } else if (error?.graphQLErrors[0]) {
    alertMessage = error.graphQLErrors[0].message;
  } else if (
    data?.login.__typename === "LoginValidationError" &&
    data.login.sessionIdError
  ) {
    alertMessage = data.login.sessionIdError;
  } else if (statusMessage) {
    alertMessage = statusMessage;
  }

  return (
    <>
      <AlertToast
        horizontal="center"
        vertical="top"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        direction="down"
        severity={statusMessage ? "info" : "error"}
        content={alertMessage}
      />
      <Typography variant="h1">Sign In</Typography>
      <Card>
        <LoginForm
          isLoading={status === "submitting"}
          onSubmit={handleSubmit(submitHandler)}
          register={register}
          fieldErrors={errors}
        />
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
