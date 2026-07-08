import { useState } from "react";

import TextField, { type TextFieldProps } from "@mui/material/TextField";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import TextFieldAdornment from "./TextFieldAdornment";

type Labels =
  | "Password"
  | "Confirm Password"
  | "Current Password"
  | "New Password"
  | "Confirm New Password";

interface PasswordInputProps extends Omit<TextFieldProps, "id" | "label"> {
  id: string;
  label: Labels;
  fieldError: string | undefined;
}

const PasswordInput = (props: PasswordInputProps) => {
  const { id, fieldError, ...otherProps } = props;
  const [isVisible, setIsVisible] = useState(false);
  const ariaId = fieldError ? `${id}-helper-text` : undefined;

  return (
    <TextField
      {...otherProps}
      id={id}
      fullWidth
      type={isVisible ? "text" : "password"}
      error={!!fieldError}
      helperText={fieldError ?? null}
      slotProps={{
        htmlInput: { "aria-errormessage": ariaId, "aria-describedby": ariaId },
        input: {
          endAdornment: (
            <TextFieldAdornment
              position="end"
              title={`${isVisible ? "Hide" : "Show"} password`}
              Icon={
                isVisible ? VisibilityOffRoundedIcon : VisibilityRoundedIcon
              }
              onClick={() => setIsVisible(!isVisible)}
            />
          ),
        },
      }}
    />
  );
};

export default PasswordInput;
