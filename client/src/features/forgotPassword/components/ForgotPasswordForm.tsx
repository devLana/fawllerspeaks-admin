import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

import type { MutationForgotPasswordArgs } from "@apiTypes";

interface ForgotPasswordFormProps {
  isLoading: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<MutationForgotPasswordArgs>;
  fieldErrors: FieldErrors<MutationForgotPasswordArgs>;
}

const ForgotPasswordForm = ({
  isLoading,
  onSubmit,
  register,
  fieldErrors,
}: ForgotPasswordFormProps) => {
  const ariaId = fieldErrors.email ? "email-error-message" : undefined;

  return (
    <form onSubmit={onSubmit} noValidate>
      <TextField
        type="email"
        id="email"
        autoComplete="email"
        autoFocus
        label="E-Mail"
        margin={fieldErrors.email ? "dense" : "normal"}
        error={!!fieldErrors.email}
        fullWidth
        {...register("email")}
        helperText={fieldErrors.email?.message ?? null}
        FormHelperTextProps={{ id: "email-error-message" }}
        inputProps={{ "aria-errormessage": ariaId, "aria-describedby": ariaId }}
      />
      <LoadingButton
        loading={isLoading}
        variant="contained"
        size="large"
        type="submit"
        fullWidth
        sx={{ textTransform: "uppercase", mt: 3 }}
      >
        <span>Send Reset Link</span>
      </LoadingButton>
    </form>
  );
};

export default ForgotPasswordForm;
