import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Typography from "@mui/material/Typography";

import useStatusAlert from "@features/register/hooks/useStatusAlert";
import AuthRootLayout from "@layouts/AuthRootLayout";
import AlertToast from "@components/AlertToast";
import Card from "@components/Card";
import RegisterUserForm from "@features/register/components/RegisterUserForm";
import { REGISTER_USER } from "@features/register/operations/REGISTER_USER";
import { registerUserValidator } from "@features/register/utils/registerUserValidator";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";
import type { MutationRegisterUserArgs } from "@apiTypes";

type RegisterUserArgs = MutationRegisterUserArgs["userInput"];

const RegisterUser: NextPageWithLayout = () => {
  const [status, setStatus] = React.useState<"idle" | "loading">("idle");
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();

  const [registerUser, { error, client }] = useMutation(REGISTER_USER);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterUserArgs>({
    resolver: yupResolver(registerUserValidator),
  });

  const [statusMessage, setStatusMessage] = useStatusAlert(setIsOpen);

  const submitHandler = async (values: RegisterUserArgs) => {
    setStatus("loading");

    const { data: registeredData } = await registerUser({
      variables: { userInput: values },
      onError() {
        setStatus("idle");
        setIsOpen(true);
        setStatusMessage(null);
      },
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

          setStatus("idle");
          break;
        }

        case "AuthenticationError":
          void client.clearStore();
          void router.replace("/login?status=unauthenticated");
          break;

        case "UnknownError":
          void client.clearStore();
          void router.replace("/login?status=unauthorized");
          break;

        case "RegistrationError":
          void router.replace("/?status=registered");
          break;

        case "RegisteredUser":
          void router.replace("/");
          break;

        default:
          setStatus("idle");
          setIsOpen(true);
          setStatusMessage(null);
          break;
      }
    }
  };

  let alertMessage =
    "You are unable to register your account. Please try again later";

  if (error?.graphQLErrors[0]) {
    alertMessage = error.graphQLErrors[0].message;
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
      <Typography align="center" variant="h1">
        Register Your Account
      </Typography>
      <Card maxWidth="22.5rem" smMaxWidth="43rem" sx={{ width: "100%" }}>
        <RegisterUserForm
          isLoading={status === "loading"}
          onSubmit={handleSubmit(submitHandler)}
          register={register}
          fieldErrors={errors}
        />
      </Card>
    </>
  );
};

RegisterUser.layout = uiLayout(AuthRootLayout, {
  title: "Register Your FawllerSpeaks Admin Account",
});

export default RegisterUser;
