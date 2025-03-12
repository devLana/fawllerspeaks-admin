import TextField from "@mui/material/TextField";
import { type Control, Controller } from "react-hook-form";

import TooltipHint from "@features/posts/components/TooltipHint";
import { postMetadataRequiredInputs } from "@uiHelpers/postMetadataRequiredInputs";
import type { PostMetadataFields, RequiredFieldErrors } from "types/posts";

interface RequiredInputsProps {
  errors: RequiredFieldErrors;
  control: Control<PostMetadataFields>;
}

const CreatePostRequiredMetadataInputs = (props: RequiredInputsProps) => {
  const { errors, control } = props;

  return postMetadataRequiredInputs.map(({ id, label, hint }) => {
    const ID = errors[`${id}Error`] ? `${id}-helper-text` : undefined;

    return (
      <TooltipHint key={id} hint={hint}>
        <Controller
          name={id}
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              type="text"
              id={id}
              autoComplete="on"
              autoFocus={id === "title"}
              fullWidth
              label={label}
              inputRef={ref}
              error={!!errors[`${id}Error`]}
              helperText={errors[`${id}Error`] ?? null}
              inputProps={{ "aria-errormessage": ID, "aria-describedby": ID }}
            />
          )}
        />
      </TooltipHint>
    );
  });
};

export default CreatePostRequiredMetadataInputs;
