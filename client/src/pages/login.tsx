import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { useSession } from "@context/SessionContext";
import { useAuthHeaderHandler } from "@context/ApolloContext";
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

type Status = "idle" | "submitting" | "error" | "success";

const Login: NextPageWithLayout = () => {
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<Status>("idle");

  const { replace, isReady, query } = useRouter();

  const [login, { data, error }] = useMutation(LOGIN_USER, {
    onError: () => setStatus("error"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<MutationLoginArgs>({ resolver: yupResolver(loginValidator) });

  const { handleUserId, handleRefreshToken } = useSession();
  const handleAuthHeader = useAuthHeaderHandler();

  React.useEffect(() => {
    if (isReady) {
      if (query.status && !Array.isArray(query.status)) {
        switch (query.status) {
          case "unauthorized":
          case "unauthenticated":
            setStatusMessage(
              "You are unable to perform that action. Please log in"
            );
            break;

          default:
            setStatusMessage(null);
        }
      }
    }
  }, [isReady, query.status]);

  const submitHandler = async (values: MutationLoginArgs) => {
    setStatus("submitting");

    const { data: loginData } = await login({ variables: values });

    if (loginData) {
      switch (loginData.login.__typename) {
        case "LoginValidationError": {
          const { emailError, passwordError: pwdError } = loginData.login;
          const focus = { shouldFocus: true };

          if (pwdError) setError("password", { message: pwdError }, focus);
          if (emailError) setError("email", { message: emailError }, focus);

          setStatus("idle");

          break;
        }

        case "NotAllowedError":
        default:
          setStatus("error");
          break;

        case "LoggedInUser": {
          const { __typename = "User", ...user } = loginData.login.user;

          if (user.isRegistered) {
            void replace("/");
          } else {
            void replace("/register");
          }

          localStorage.setItem(SESSION_ID, loginData.login.sessionId);
          setStatus("success");
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
  }

  return (
    <>
      {status === "error" && (
        <AlertToast
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
        <AlertToast
          horizontal="center"
          vertical="top"
          isOpen={!!statusMessage}
          onClose={() => setStatusMessage(null)}
          direction="down"
          severity="info"
          content={statusMessage}
        />
      )}
      <Typography variant="h1">Sign In</Typography>
      <Card sx={{ maxWidth: { xs: "21.875rem", sm: "25rem" } }}>
        <LoginForm
          isLoading={status === "submitting" || status === "success"}
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
