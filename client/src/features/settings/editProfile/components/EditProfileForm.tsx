import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import type {
  UseFormRegister,
  FieldErrors,
  DeepPartial,
} from "react-hook-form";

import type { MutationEditProfileArgs } from "@apiTypes";

type EditProfile = Omit<MutationEditProfileArgs, "image">;
interface EditProfileFormProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<EditProfile>;
  fieldErrors: FieldErrors<EditProfile>;
  defaultValues?: Readonly<DeepPartial<EditProfile>>;
  isLoading: boolean;
  fileInput: React.ReactElement;
}

const EditProfileForm = ({
  onSubmit,
  register,
  fieldErrors,
  defaultValues,
  isLoading,
  fileInput,
}: EditProfileFormProps) => (
  <form onSubmit={onSubmit}>
    <Grid container rowSpacing={2} columnSpacing={2} mb={3.3} mt={0}>
      <Grid item xs={12} sm={6}>
        <TextField
          id="first-name"
          autoComplete="given-name"
          label="First Name"
          margin="none"
          error={!!fieldErrors.firstName}
          helperText={fieldErrors.firstName?.message ?? null}
          defaultValue={defaultValues?.firstName ?? ""}
          fullWidth
          {...register("firstName")}
          inputProps={{
            "aria-errormessage": fieldErrors.firstName
              ? "first-name-helper-text"
              : undefined,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          id="last-name"
          autoComplete="family-name"
          label="Last Name"
          margin="none"
          error={!!fieldErrors.lastName}
          helperText={fieldErrors.lastName?.message ?? null}
          defaultValue={defaultValues?.lastName ?? ""}
          fullWidth
          {...register("lastName")}
          inputProps={{
            "aria-errormessage": fieldErrors.lastName
              ? "last-name-helper-text"
              : undefined,
          }}
        />
      </Grid>
    </Grid>
    <Box marginBottom={3.3}>{fileInput}</Box>
    <LoadingButton
      loading={isLoading}
      variant="contained"
      size="large"
      type="submit"
      fullWidth
      sx={{ textTransform: "uppercase" }}
    >
      <span>Edit</span>
    </LoadingButton>
  </form>
);

export default EditProfileForm;
