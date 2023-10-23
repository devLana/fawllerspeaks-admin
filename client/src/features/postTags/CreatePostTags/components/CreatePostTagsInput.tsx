import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

import TextFieldAdornment from "@components/TextFieldAdornment";

interface CreatePostTagsInputProps {
  numberOfInputs: number;
  value: number;
  fieldErrors: FieldErrors<Record<string, string>>;
  register: UseFormRegister<Record<string, string>>;
  onRemove: (value: number, tag: string) => void;
}

const CreatePostTagsInput = (props: CreatePostTagsInputProps) => {
  const { fieldErrors, value, numberOfInputs, register, onRemove } = props;
  const tag = `post-tag-${value}`;

  return (
    <Grid item xs={12} sm={numberOfInputs === 1 ? 12 : 6}>
      <TextField
        id={tag}
        autoComplete="on"
        fullWidth
        label="Post Tag"
        {...register(tag)}
        helperText={fieldErrors[tag]?.message ?? null}
        error={!!fieldErrors[tag]}
        inputProps={{
          "aria-errormessage": fieldErrors[tag]
            ? `${tag}-helper-text`
            : undefined,
        }}
        InputProps={{
          endAdornment: numberOfInputs > 1 && (
            <TextFieldAdornment
              position="end"
              title="Remove post tag"
              Icon={RemoveCircleOutlineIcon}
              onClick={() => onRemove(value, tag)}
            />
          ),
        }}
      />
    </Grid>
  );
};

export default CreatePostTagsInput;
