import { useMutation } from "@apollo/client/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useForm } from "@hooks/common/useForm";
import { useRegisterUser } from "@hooks/auth/registerUser/useRegisterUser";
import PasswordInput from "@components/ui/PasswordInput";
import { REGISTER_USER } from "@mutations/auth/registerUser";
import { registerUserSchema as schema } from "@validators/registerUserSchema";

const RegisterUserForm = () => {
  const [registerUser] = useMutation(REGISTER_USER);
  const { isLoading, onCompleted, onError, setIsLoading } = useRegisterUser();

  const { register, handleSubmit, errors } = useForm({
    schema,
    onSubmit(userInput, { setErrors }) {
      setIsLoading(true);
      void registerUser({
        variables: { userInput },
        onError,
        onCompleted: onCompleted(setErrors),
      });
    },
  });

  const fNameAriaId = errors.firstName ? "first-name-error-message" : undefined;
  const lNameAriaId = errors.lastName ? "last-name-error-message" : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="page-title">
      <Box sx={{ mb: 3.3 }}>
        <Typography align="center" gutterBottom>
          Account information
        </Typography>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register("firstName")}
              autoFocus
              fullWidth
              autoComplete="given-name"
              label="First Name"
              error={!!errors.firstName}
              helperText={errors.firstName ?? null}
              slotProps={{
                formHelperText: { id: "first-name-error-message" },
                htmlInput: {
                  "aria-errormessage": fNameAriaId,
                  "aria-describedby": fNameAriaId,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register("lastName")}
              fullWidth
              autoComplete="family-name"
              label="Last Name"
              helperText={errors.lastName ?? null}
              error={!!errors.lastName}
              slotProps={{
                formHelperText: { id: "last-name-error-message" },
                htmlInput: {
                  "aria-errormessage": lNameAriaId,
                  "aria-describedby": lNameAriaId,
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography align="center" gutterBottom>
          Update account password
        </Typography>
        <Grid container rowSpacing={3} columnSpacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <PasswordInput
              {...register("password")}
              label="Password"
              autoComplete="new-password"
              fieldError={errors.password}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <PasswordInput
              {...register("confirmPassword")}
              label="Confirm Password"
              autoComplete="new-password"
              fieldError={errors.confirmPassword}
            />
          </Grid>
        </Grid>
      </Box>
      <Button
        fullWidth
        type="submit"
        size="large"
        variant="contained"
        loading={isLoading}
        sx={{ textTransform: "uppercase" }}
      >
        Register
      </Button>
    </form>
  );
};

export default RegisterUserForm;
