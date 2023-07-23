import * as React from "react";

import TextField, { type TextFieldProps } from "@mui/material/TextField";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

import PasswordAdornment from "./PasswordAdornment";

type Name = "password" | "confirmPassword";
type Password<TName extends Name> = UseFormRegisterReturn<TName>;

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

  return (
    <TextField
      {...props}
      {...register}
      id={id}
      label={label}
      type={isVisible ? "text" : "password"}
      fullWidth
      error={!!fieldError}
      helperText={fieldError?.message ?? null}
      FormHelperTextProps={{ id: `${id}__error-message` }}
      inputProps={{
        "aria-errormessage": `${id}__error-message`,
        "aria-describedby": `${id}__error-message`,
      }}
      InputProps={{
        endAdornment: (
          <PasswordAdornment isVisible={isVisible} onClick={handleClick} />
        ),
      }}
    />
  );
};

export default PasswordInput;
