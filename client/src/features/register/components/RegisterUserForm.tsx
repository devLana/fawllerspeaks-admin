import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

import PasswordInput from "@components/PasswordInput";
import type { MutationRegisterUserArgs } from "@apiTypes";

type RegisterUserArgs = MutationRegisterUserArgs["userInput"];

interface RegisterUserFormProps {
  isLoading: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<RegisterUserArgs>;
  fieldErrors: FieldErrors<RegisterUserArgs>;
}

const RegisterUserForm = ({
  isLoading,
  onSubmit,
  register,
  fieldErrors,
}: RegisterUserFormProps) => (
  <form onSubmit={onSubmit} noValidate>
    <Box mb={3.3}>
      <Typography align="center" gutterBottom>
        Account information
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="first-name"
            autoFocus
            autoComplete="given-name"
            label="First Name"
            margin="none"
            error={!!fieldErrors.firstName}
            helperText={fieldErrors.firstName?.message ?? null}
            fullWidth
            {...register("firstName")}
            FormHelperTextProps={{ id: "first-name-error-message" }}
            inputProps={{
              "aria-errormessage": fieldErrors.firstName
                ? "first-name-error-message"
                : undefined,
              "aria-describedby": fieldErrors.firstName
                ? "first-name-error-message"
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
            helperText={fieldErrors.lastName?.message ?? null}
            error={!!fieldErrors.lastName}
            fullWidth
            {...register("lastName")}
            FormHelperTextProps={{ id: "last-name-error-message" }}
            inputProps={{
              "aria-errormessage": fieldErrors.lastName
                ? "last-name-error-message"
                : undefined,
              "aria-describedby": fieldErrors.lastName
                ? "last-name-error-message"
                : undefined,
            }}
          />
        </Grid>
      </Grid>
    </Box>
    <Box marginBottom={3}>
      <Typography align="center" gutterBottom>
        Update account password
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={2}>
        <Grid item xs={12} sm={6}>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            label="Password"
            register={register("password")}
            fieldError={fieldErrors.password}
            margin="none"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PasswordInput
            id="confirm-password"
            autoComplete="new-password"
            label="Confirm Password"
            register={register("confirmPassword")}
            fieldError={fieldErrors.confirmPassword}
            margin="none"
          />
        </Grid>
      </Grid>
    </Box>
    <LoadingButton
      loading={isLoading}
      variant="contained"
      size="large"
      type="submit"
      fullWidth
      sx={{ textTransform: "uppercase" }}
    >
      <span>Register</span>
    </LoadingButton>
  </form>
);

export default RegisterUserForm;
