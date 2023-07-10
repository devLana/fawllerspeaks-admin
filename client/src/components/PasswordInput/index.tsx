import * as React from "react";

import TextField, { type TextFieldProps } from "@mui/material/TextField";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

import PasswordAdornment from "./PasswordAdornment";

type Name = "password" | "confirmPassword";
type Password<TName extends Name> = UseFormRegisterReturn<TName>;
type ButtonEventHandler = React.MouseEventHandler<HTMLButtonElement>;

type PasswordProps = TextFieldProps & {
  id: "password";
  label: "Password";
  register: Password<"password">;
  fieldError: FieldError | undefined;
};

type ConfirmPasswordProps = TextFieldProps & {
  id: "confirm__password";
  label: "Confirm Password";
  register: Password<"confirmPassword">;
  fieldError: FieldError | undefined;
};

type PasswordFieldProps = PasswordProps | ConfirmPasswordProps;

const PasswordInput = ({
  id,
  label,
  register,
  fieldError,
  ...props
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const handleMouseDown: ButtonEventHandler = e => {
    e.preventDefault();
  };

  return (
    <TextField
      {...props}
      id={id}
      label={label}
      type={isVisible ? "text" : "password"}
      fullWidth
      InputProps={{
        endAdornment: (
          <PasswordAdornment
            isVisible={isVisible}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
          />
        ),
      }}
      helperText={fieldError ? fieldError.message : null}
      error={!!fieldError}
      {...register}
    />
  );
};

export default PasswordInput;
