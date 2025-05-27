import TextField from "@mui/material/TextField";
import type { UseFormRegister } from "react-hook-form";

import TooltipHint from "@features/posts/components/TooltipHint";
import { postMetadataRequiredInputs } from "@uiHelpers/postMetadataRequiredInputs";
import type { EditPostMetadataFields } from "types/posts/editPost";
import type { RequiredFieldErrors } from "types/posts";

interface RequiredInputsProps {
  defaultValues: Partial<EditPostMetadataFields>;
  errors: RequiredFieldErrors;
  register: UseFormRegister<EditPostMetadataFields>;
}

const EditPostRequiredMetadataInputs = (props: RequiredInputsProps) => {
  const { defaultValues, errors, register } = props;

  return postMetadataRequiredInputs.map(({ id, label, hint }) => {
    const ID = errors[`${id}Error`] ? `${id}-helper-text` : undefined;
    const { ref, ...field } = register(id);

    return (
      <TooltipHint key={id} hint={hint}>
        <TextField
          {...field}
          type="text"
          id={id}
          defaultValue={defaultValues[id]}
          autoComplete="on"
          autoFocus={id === "title"}
          fullWidth
          inputRef={ref}
          label={label}
          error={!!errors[`${id}Error`]}
          helperText={errors[`${id}Error`] ?? null}
          inputProps={{ "aria-errormessage": ID, "aria-describedby": ID }}
        />
      </TooltipHint>
    );
  });
};

export default EditPostRequiredMetadataInputs;
