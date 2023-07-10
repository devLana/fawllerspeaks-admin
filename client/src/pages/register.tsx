import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Typography from "@mui/material/Typography";

import AuthLayout from "@layouts/AuthLayout";
import Toast from "@components/Toast";
import Card from "@components/Card";
import RegisterUserForm from "@features/register/components/RegisterUserForm";
import { REGISTER_USER } from "@features/register/REGISTER_USER";
import { registerUserValidator } from "@features/register/registerUserValidator";
import { SESSION_ID } from "@utils/constants";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";
import type { MutationRegisterUserArgs } from "@apiTypes";

type RegisterUserArgs = MutationRegisterUserArgs["userInput"];

const RegisterUser: NextPageWithLayout = () => {
  const [hasError, setHasError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const [registerUser, { error }] = useMutation(REGISTER_USER, {
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
  } = useForm<RegisterUserArgs>({
    resolver: yupResolver(registerUserValidator),
  });

  const submitHandler = async (values: RegisterUserArgs) => {
    setLoading(true);

    const { data: registeredData } = await registerUser({
      variables: { userInput: values },
    });

    if (registeredData) {
      switch (registeredData.registerUser.__typename) {
        case "RegisterUserValidationError": {
          const {
            firstNameError,
            lastNameError,
            passwordError,
            confirmPasswordError: confirmPwdError,
          } = registeredData.registerUser;

          const focus = { shouldFocus: true };

          if (confirmPwdError) {
            setError("confirmPassword", { message: confirmPwdError }, focus);
          }

          if (passwordError) {
            setError("password", { message: passwordError }, focus);
          }

          if (lastNameError) {
            setError("lastName", { message: lastNameError }, focus);
          }

          if (firstNameError) {
            setError("firstName", { message: firstNameError }, focus);
          }

          setLoading(false);
          break;
        }

        case "AuthenticationError":
          localStorage.removeItem(SESSION_ID);
          void router.replace("/login?status=unauthenticated");
          break;

        case "UnknownError":
          localStorage.removeItem(SESSION_ID);
          void router.replace("/login?status=unauthorized");
          break;

        case "RegistrationError":
          void router.replace("/?status=registered");
          break;

        case "UserData":
          void router.replace("/");
          break;

        case "NotAllowedError":
        default:
          setHasError(true);
          setLoading(false);
          break;
      }
    }
  };

  let alertMessage =
    "You are unable to register your account. Please try again later";

  if (error?.graphQLErrors[0]) {
    alertMessage = error.graphQLErrors[0].message;
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
      <Typography align="center" variant="h1">
        Register Your Account
      </Typography>
      <Card sx={{ width: "100%", maxWidth: { xs: "22.5rem", sm: "43rem" } }}>
        <RegisterUserForm
          isLoading={loading}
          onSubmit={handleSubmit(submitHandler)}
          register={register}
          fieldErrors={errors}
        />
      </Card>
    </>
  );
};

RegisterUser.layout = uiLayout(AuthLayout, {
  title: "Register Your FawllerSpeaks Admin Account",
});

export default RegisterUser;
