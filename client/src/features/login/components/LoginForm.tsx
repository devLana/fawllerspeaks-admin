import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

import { useSession } from "@context/Session";
import { useAuthHeader } from "@context/AuthHeader";
import AlertToast from "@components/AlertToast";
import Down from "@components/SlideTransitions/Down";
import PasswordInput from "@components/PasswordInput";
import { LOGIN_USER } from "../operations/LOGIN_USER";
import { loginSchema } from "../validatorSchema";
import { SESSION_ID } from "@utils/constants";
import type { MutationLoginArgs } from "@apiTypes";
import type { Status } from "@types";

const LoginForm = () => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");
  const { push, query, replace } = useRouter();

  const [login, { data, error }] = useMutation(LOGIN_USER);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<MutationLoginArgs>({ resolver: yupResolver(loginSchema) });

  const { handleUserId, handleRefreshToken } = useSession();
  const { handleAuthHeader } = useAuthHeader();

  const submitHandler = (values: MutationLoginArgs) => {
    setFormStatus("loading");

    void login({
      variables: values,
      onError: () => setFormStatus("error"),
      onCompleted(loginData) {
        switch (loginData.login.__typename) {
          case "LoginValidationError": {
            const focus = { shouldFocus: true };
            const { emailError, passwordError } = loginData.login;

            if (passwordError) {
              setError("password", { message: passwordError }, focus);
            }

            if (emailError) setError("email", { message: emailError }, focus);

            setFormStatus("idle");
            break;
          }

          case "NotAllowedError":
          default:
            setFormStatus("error");
            break;

          case "LoggedInUser": {
            const { __typename = "User", ...user } = loginData.login.user;
            const { redirectTo } = query;

            const regex =
              /^\/?(register|login|forgot-password|reset-password|404|500)/;

            if (!user.isRegistered) {
              void replace("/register");
            } else if (
              typeof redirectTo === "string" &&
              !regex.test(redirectTo)
            ) {
              void push(redirectTo);
            } else {
              void push("/");
            }

            localStorage.setItem(SESSION_ID, loginData.login.sessionId);
            handleAuthHeader(loginData.login.accessToken);
            handleRefreshToken(loginData.login.accessToken);
            handleUserId(`${__typename}:${user.id}`);
          }
        }
      },
    });
  };

  const ariaId = errors.email ? "email-error-message" : undefined;

  let alertMessage =
    "You are unable to login at the moment. Please try again later";

  if (data?.login.__typename === "NotAllowedError") {
    alertMessage = data.login.message;
  } else if (error?.graphQLErrors?.[0]) {
    alertMessage = error.graphQLErrors[0].message;
  }

  return (
    <>
      <AlertToast
        horizontal="center"
        vertical="top"
        isOpen={formStatus === "error"}
        onClose={() => setFormStatus("idle")}
        transition={Down}
        severity="error"
        content={alertMessage}
      />
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <TextField
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          label="E-Mail"
          margin={errors.email ? "dense" : "normal"}
          error={!!errors.email}
          fullWidth
          helperText={errors.email?.message ?? null}
          {...register("email")}
          FormHelperTextProps={{ id: "email-error-message" }}
          inputProps={{
            "aria-errormessage": ariaId,
            "aria-describedby": ariaId,
          }}
        />
        <PasswordInput
          id="password"
          autoComplete="current-password"
          label="Password"
          register={register("password")}
          fieldError={errors.password}
          margin={errors.password ? "dense" : "normal"}
        />
        <LoadingButton
          loading={formStatus === "loading"}
          variant="contained"
          size="large"
          type="submit"
          fullWidth
          sx={{ textTransform: "uppercase", mt: 3 }}
        >
          <span>Login</span>
        </LoadingButton>
      </form>
    </>
  );
};

export default LoginForm;
