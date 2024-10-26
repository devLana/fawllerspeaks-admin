import * as React from "react";

import TextField, { type TextFieldProps } from "@mui/material/TextField";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

import TextFieldAdornment from "./TextFieldAdornment";

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

type Keys = "type" | "fullWidth" | "error" | "helperText";
type PasswordInputProps = Omit<TextFieldProps, Keys> &
  (
    | PasswordProps
    | ConfirmPasswordProps
    | CurrentPasswordProps
    | NewPasswordProps
    | ConfirmNewPasswordProps
  ) & { fieldError: FieldError | undefined };

const PasswordInput = ({
  id,
  label,
  register,
  fieldError,
  FormHelperTextProps,
  inputProps,
  InputProps,
  ...muiProps
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

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
      FormHelperTextProps={{
        ...(FormHelperTextProps && FormHelperTextProps),
        id: `${id}-error-message`,
      }}
      inputProps={{
        ...(inputProps && inputProps),
        "aria-errormessage": ariaId,
        "aria-describedby": ariaId,
      }}
      InputProps={{
        ...(InputProps && InputProps),
        endAdornment: (
          <TextFieldAdornment
            position="end"
            title={`${isVisible ? "Hide" : "Show"} password`}
            Icon={isVisible ? VisibilityOffRoundedIcon : VisibilityRoundedIcon}
            onClick={() => setIsVisible(!isVisible)}
          />
        ),
      }}
    />
  );
};

export default PasswordInput;
