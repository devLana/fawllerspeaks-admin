import { useMutation } from "@apollo/client/react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useForm } from "@hooks/common/useForm";
import { useResetPassword } from "@hooks/auth/resetPassword/useResetPassword";
import PasswordInput from "@components/ui/PasswordInput";
import { RESET_PASSWORD } from "@mutations/auth/resetPassword";
import { resetPasswordSchema as schema } from "@validators/resetPasswordSchema";
import type { ResetPasswordFormProps as Props } from "@appTypes/auth/resetPassword";

const ResetPasswordForm = ({ email, resetToken, onSuccess }: Props) => {
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const { isLoading, onCompleted, onError, setIsLoading } = useResetPassword();

  const { register, handleSubmit, errors } = useForm({
    schema,
    onSubmit(values, { setErrors }) {
      setIsLoading(true);
      void resetPassword({
        variables: { ...values, token: resetToken },
        onCompleted: onCompleted(setErrors, onSuccess),
        onError,
      });
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="page-title">
      <TextField
        id="email"
        autoComplete="email"
        label="E-Mail"
        fullWidth
        value={email}
        slotProps={{ input: { readOnly: true } }}
      />
      <Typography align="center" sx={{ mt: 3, mb: 1 }}>
        Enter your new password below
      </Typography>
      <PasswordInput
        {...register("password")}
        autoComplete="new-password"
        autoFocus
        label="Password"
        fieldError={errors.password}
        margin={errors.password ? "dense" : "normal"}
      />
      <PasswordInput
        {...register("confirmPassword")}
        autoComplete="new-password"
        label="Confirm Password"
        fieldError={errors.confirmPassword}
        margin={errors.confirmPassword ? "dense" : "normal"}
      />
      <Button
        loading={isLoading}
        variant="contained"
        size="large"
        type="submit"
        fullWidth
        sx={{ textTransform: "uppercase", mt: 3 }}
      >
        Reset Password
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
