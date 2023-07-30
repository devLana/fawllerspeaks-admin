import * as React from "react";

import TextField, { type TextFieldProps } from "@mui/material/TextField";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

import PasswordAdornment from "./PasswordAdornment";

type Name =
  | "password"
  | "confirmPassword"
  | "currentPassword"
  | "newPassword"
  | "confirmNewPassword";

type Password<TName extends Name> = UseFormRegisterReturn<TName>;

interface PasswordProps {
  id: "password";
  label: "Password";
  register: Password<"password">;
}

interface ConfirmPasswordProps {
  id: "confirm-password";
  label: "Confirm Password";
  register: Password<"confirmPassword">;
}

interface CurrentPasswordProps {
  id: "current-password";
  label: "Current Password";
  register: Password<"currentPassword">;
}

interface NewPasswordProps {
  id: "new-password";
  label: "New Password";
  register: Password<"newPassword">;
}

interface ConfirmNewPasswordProps {
  id: "confirm-new-password";
  label: "Confirm New Password";
  register: Password<"confirmNewPassword">;
}

type PasswordInputProps = TextFieldProps &
  (
    | PasswordProps
    | ConfirmPasswordProps
    | CurrentPasswordProps
    | NewPasswordProps
    | ConfirmNewPasswordProps
  ) & { fieldError: FieldError | undefined };

const PasswordInput = (props: PasswordInputProps) => {
  const { id, label, register, fieldError, ...muiProps } = props;

  const [isVisible, setIsVisible] = React.useState(false);

  const handleClick = () => setIsVisible(!isVisible);

  const ariaId = fieldError ? `${id}-error-message` : undefined;

  return (
    <TextField
      {...muiProps}
      {...register}
      id={id}
      label={label}
      type={isVisible ? "text" : "password"}
      fullWidth
      error={!!fieldError}
      helperText={fieldError?.message ?? null}
      FormHelperTextProps={{ id: `${id}-error-message` }}
      inputProps={{ "aria-errormessage": ariaId, "aria-describedby": ariaId }}
      InputProps={{
        endAdornment: (
          <PasswordAdornment isVisible={isVisible} onClick={handleClick} />
        ),
      }}
    />
  );
};

export default PasswordInput;
