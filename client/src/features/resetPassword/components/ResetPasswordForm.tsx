import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

import PasswordInput from "@components/PasswordInput";
import type { MutationResetPasswordArgs } from "@apiTypes";

type OmitToken = Omit<MutationResetPasswordArgs, "token">;

interface ResetPasswordFormProps {
  isLoading: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<OmitToken>;
  fieldErrors: FieldErrors<OmitToken>;
  email: string;
}

const ResetPasswordForm = ({
  isLoading,
  onSubmit,
  register,
  fieldErrors,
  email,
}: ResetPasswordFormProps) => (
  <form onSubmit={onSubmit} noValidate>
    <TextField
      id="email"
      autoComplete="email"
      label="E-Mail"
      fullWidth
      defaultValue={email}
      InputProps={{ readOnly: true }}
    />
    <Typography align="center" sx={{ mt: 3, mb: 1 }}>
      Enter your new password below
    </Typography>
    <PasswordInput
      id="password"
      autoComplete="new-password"
      autoFocus
      label="Password"
      register={register("password")}
      fieldError={fieldErrors.password}
      margin={fieldErrors.password ? "dense" : "normal"}
    />
    <PasswordInput
      id="confirm-password"
      autoComplete="new-password"
      label="Confirm Password"
      register={register("confirmPassword")}
      fieldError={fieldErrors.confirmPassword}
      margin={fieldErrors.confirmPassword ? "dense" : "normal"}
    />
    <LoadingButton
      loading={isLoading}
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

export default ResetPasswordForm;
