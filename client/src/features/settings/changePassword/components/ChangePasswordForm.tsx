import type { UseFormRegister, FieldErrors } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";

import PasswordInput from "@components/PasswordInput";
import { type MutationChangePasswordArgs } from "@apiTypes";

interface ChangePasswordFormProps {
  email: string;
  isLoading: boolean;
  fieldErrors: FieldErrors<MutationChangePasswordArgs>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<MutationChangePasswordArgs>;
}

const ChangePasswordForm = (props: ChangePasswordFormProps) => {
  const { fieldErrors, isLoading, email, onSubmit, register } = props;

  return (
    <form onSubmit={onSubmit} noValidate>
      <TextField
        id="email"
        autoComplete="email"
        value={email}
        inputProps={{ readOnly: true }}
        sx={{ display: "none" }}
      />
      <PasswordInput
        id="current-password"
        autoComplete="current-password"
        label="Current Password"
        register={register("currentPassword")}
        fieldError={fieldErrors.currentPassword}
        margin={fieldErrors.currentPassword ? "dense" : "normal"}
      />
      <PasswordInput
        id="new-password"
        autoComplete="new-password"
        label="New Password"
        register={register("newPassword")}
        fieldError={fieldErrors.newPassword}
        margin={fieldErrors.newPassword ? "dense" : "normal"}
      />
      <PasswordInput
        id="confirm-new-password"
        autoComplete="new-password"
        label="Confirm New Password"
        register={register("confirmNewPassword")}
        fieldError={fieldErrors.confirmNewPassword}
        margin={fieldErrors.confirmNewPassword ? "dense" : "normal"}
      />
      <LoadingButton
        loading={isLoading}
        variant="contained"
        size="large"
        type="submit"
        fullWidth
        sx={{ textTransform: "uppercase", mt: 3 }}
      >
        <span>Change Password</span>
      </LoadingButton>
    </form>
  );
};

export default ChangePasswordForm;
