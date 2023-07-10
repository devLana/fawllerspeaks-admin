import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

import PasswordInput from "@components/PasswordInput";
import type { MutationLoginArgs } from "@apiTypes";

interface LoginFormProps {
  isLoading: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<MutationLoginArgs>;
  fieldErrors: FieldErrors<MutationLoginArgs>;
}

const LoginForm = ({
  isLoading,
  onSubmit,
  register,
  fieldErrors,
}: LoginFormProps) => (
  <form onSubmit={onSubmit} noValidate>
    <TextField
      id="email"
      type="email"
      autoComplete="email"
      label="E-Mail"
      margin={fieldErrors.email ? "dense" : "normal"}
      fullWidth
      {...register("email")}
      helperText={fieldErrors.email ? fieldErrors.email.message : null}
      error={!!fieldErrors.email}
      autoFocus
    />
    <PasswordInput
      id="password"
      autoComplete="current-password"
      label="Password"
      register={register("password")}
      fieldError={fieldErrors.password}
      margin={fieldErrors.password ? "dense" : "normal"}
    />
    <LoadingButton
      loading={isLoading}
      variant="contained"
      size="large"
      type="submit"
      fullWidth
      sx={{ textTransform: "uppercase", mt: 3 }}
    >
      <span>Login</span>
    </LoadingButton>
  </form>
);

export default LoginForm;
