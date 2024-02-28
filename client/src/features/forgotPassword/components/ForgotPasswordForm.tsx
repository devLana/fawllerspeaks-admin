import * as React from "react";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

import AlertToast from "@components/AlertToast";
import { FORGOT_PASSWORD } from "../operations/FORGOT_PASSWORD";
import { forgotPasswordValidator } from "../utils/forgotPasswordValidator";
import type { AuthPageView, Status, StateSetterFn } from "@types";
import type { MutationForgotPasswordArgs } from "@apiTypes";

interface ForgotPasswordFormProps {
  setView: StateSetterFn<AuthPageView>;
}

const ForgotPasswordForm = ({ setView }: ForgotPasswordFormProps) => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");

  const [forgotPassword, { error, data }] = useMutation(FORGOT_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<MutationForgotPasswordArgs>({
    resolver: yupResolver(forgotPasswordValidator),
  });

  const submitHandler = (values: MutationForgotPasswordArgs) => {
    setFormStatus("loading");

    void forgotPassword({
      variables: values,
      onError: () => setFormStatus("error"),
      onCompleted(forgotPasswordData) {
        switch (forgotPasswordData.forgotPassword.__typename) {
          case "EmailValidationError": {
            const { emailError } = forgotPasswordData.forgotPassword;

            setError("email", { message: emailError }, { shouldFocus: true });
            setFormStatus("idle");
            break;
          }

          case "NotAllowedError":
          case "ServerError":
          default:
            setFormStatus("error");
            break;

          case "RegistrationError":
            setView("unregistered error");
            break;

          case "Response":
            setView("success");
            break;
        }
      },
    });
  };

  const ariaId = errors.email ? "email-error-message" : undefined;

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

  return (
    <>
      <AlertToast
        horizontal="center"
        vertical="top"
        isOpen={formStatus === "error"}
        onClose={() => setFormStatus("idle")}
        direction="down"
        severity="error"
        content={alertMessage}
      />
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <TextField
          type="email"
          id="email"
          autoComplete="email"
          autoFocus
          label="E-Mail"
          margin={errors.email ? "dense" : "normal"}
          error={!!errors.email}
          fullWidth
          {...register("email")}
          helperText={errors.email?.message ?? null}
          FormHelperTextProps={{ id: "email-error-message" }}
          inputProps={{
            "aria-errormessage": ariaId,
            "aria-describedby": ariaId,
          }}
        />
        <LoadingButton
          loading={formStatus === "loading"}
          variant="contained"
          size="large"
          type="submit"
          fullWidth
          sx={{ textTransform: "uppercase", mt: 3 }}
        >
          <span>Send Reset Link</span>
        </LoadingButton>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
