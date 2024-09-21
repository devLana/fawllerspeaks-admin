import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

import useChangePassword from "@hooks/changePassword/useChangePassword";
import useGetUserInfo from "@hooks/auth/useGetUserInfo";
import PasswordInput from "@components/PasswordInput";
import { CHANGE_PASSWORD } from "@mutations/changePassword/CHANGE_PASSWORD";
import { changePasswordSchema } from "@validators/changePasswordSchema";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { MutationChangePasswordArgs as Args } from "@apiTypes";
import type { Status } from "@types";

type RequestStatus = Status | "success";

const ChangePasswordForm = () => {
  const [password, { data, error }] = useMutation(CHANGE_PASSWORD);

  const { register, handleSubmit, formState, setError, reset } = useForm<Args>({
    resolver: yupResolver(changePasswordSchema),
  });

  const { formStatus, setFormStatus, onCompleted } = useChangePassword(
    setError,
    reset
  );

  const userEmail = useGetUserInfo()?.email ?? "";

  const submitHandler = (values: Args) => {
    setFormStatus("loading");

    void password({
      variables: values,
      onError: () => setFormStatus("error"),
      onCompleted,
    });
  };

  const { errors } = formState;

  let msg =
    "You are unable to change your password at the moment. Please try again later";

  if (data?.changePassword.__typename === "NotAllowedError") {
    msg =
      "Unable to change password. 'current password' does not match your account";
  } else if (
    data?.changePassword.__typename === "Response" ||
    data?.changePassword.__typename === "ServerError"
  ) {
    msg = data.changePassword.message;
  } else if (error?.graphQLErrors?.[0]) {
    msg = error.graphQLErrors[0].message;
  }

  return (
    <>
      <Snackbar
        message={msg}
        open={formStatus === "error" || formStatus === "success"}
        onClose={handleCloseAlert<RequestStatus>("idle", setFormStatus)}
      />
      <Box
        component="form"
        onSubmit={handleSubmit(submitHandler)}
        noValidate
        sx={{ width: "100%", maxWidth: 570 }}
      >
        <TextField
          id="email"
          autoComplete="email"
          value={userEmail}
          inputProps={{ readOnly: true }}
          sx={{ display: "none" }}
        />
        <PasswordInput
          id="current-password"
          autoComplete="current-password"
          label="Current Password"
          register={register("currentPassword")}
          fieldError={errors.currentPassword}
          margin={errors.currentPassword ? "dense" : "normal"}
        />
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          label="New Password"
          register={register("newPassword")}
          fieldError={errors.newPassword}
          margin={errors.newPassword ? "dense" : "normal"}
        />
        <PasswordInput
          id="confirm-new-password"
          autoComplete="new-password"
          label="Confirm New Password"
          register={register("confirmNewPassword")}
          fieldError={errors.confirmNewPassword}
          margin={errors.confirmNewPassword ? "dense" : "normal"}
        />
        <LoadingButton
          loading={formStatus === "loading"}
          variant="contained"
          size="large"
          type="submit"
          fullWidth
          sx={{ textTransform: "uppercase", mt: 3 }}
        >
          <span>Change Password</span>
        </LoadingButton>
      </Box>
    </>
  );
};

export default ChangePasswordForm;
