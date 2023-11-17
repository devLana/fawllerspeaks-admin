import * as React from "react";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import type { MutationTuple } from "@apollo/client";

import PasswordInput from "@components/PasswordInput";
import { resetPasswordValidator } from "../utils/resetPasswordValidator";
import type { ResetPasswordData } from "../operations/RESET_PASSWORD";
import type { MutationResetPasswordArgs } from "@apiTypes";
import type { AuthPageView, FormStatus, StateSetterFn } from "@types";

type OmitToken = Omit<MutationResetPasswordArgs, "token">;

interface ResetPasswordFormProps {
  email: string;
  resetToken: string;
  setView: StateSetterFn<AuthPageView>;
  resetPassword: MutationTuple<ResetPasswordData, MutationResetPasswordArgs>[0];
}

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
  const { email, resetToken, resetPassword, setView } = props;
  const [formStatus, setFormStatus] = React.useState<FormStatus>("idle");
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<OmitToken>({
    resolver: yupResolver(resetPasswordValidator),
  });

  const submitHandler = (values: OmitToken) => {
    setFormStatus("submitting");

    void resetPassword({
      variables: { ...values, token: resetToken },
      onError(err) {
        const status = err.graphQLErrors.length > 0 ? "api" : "network";
        void push(`/forgot-password?status=${status}`);
      },
      onCompleted(resetData) {
        switch (resetData.resetPassword.__typename) {
          case "ResetPasswordValidationError": {
            const focus = { shouldFocus: true };
            const {
              passwordError,
              confirmPasswordError: confirmPwdErr,
              tokenError,
            } = resetData.resetPassword;

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

            setFormStatus("idle");
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
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} noValidate>
      <TextField
        id="email"
        autoComplete="email"
        label="E-Mail"
        fullWidth
        value={email}
        inputProps={{ readOnly: true }}
      />
      <Typography align="center" mt={3} mb={1}>
        Enter your new password below
      </Typography>
      <PasswordInput
        id="password"
        autoComplete="new-password"
        autoFocus
        label="Password"
        register={register("password")}
        fieldError={errors.password}
        margin={errors.password ? "dense" : "normal"}
      />
      <PasswordInput
        id="confirm-password"
        autoComplete="new-password"
        label="Confirm Password"
        register={register("confirmPassword")}
        fieldError={errors.confirmPassword}
        margin={errors.confirmPassword ? "dense" : "normal"}
      />
      <LoadingButton
        loading={formStatus === "submitting"}
        variant="contained"
        size="large"
        type="submit"
        fullWidth
        sx={{ textTransform: "uppercase", mt: 3 }}
      >
        <span>Reset Password</span>
      </LoadingButton>
    </form>
  );
};

export default ResetPasswordForm;
