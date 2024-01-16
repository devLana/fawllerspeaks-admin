import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";

import { useSession } from "@context/SessionContext";
import PasswordInput from "@components/PasswordInput";
import { CHANGE_PASSWORD } from "@features/settings/changePassword/operations/CHANGE_PASSWORD";
import { GET_USER_EMAIL } from "@features/settings/changePassword/operations/GET_USER_EMAIL";
import { changePasswordValidator } from "@features/settings/changePassword/utils/changePasswordValidator";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import settingsLayout from "@utils/settings/settingsLayout";
import type { MutationChangePasswordArgs } from "@apiTypes";
import type { RequestStatus, NextPageWithLayout } from "@types";

const ChangePassword: NextPageWithLayout = () => {
  const [formStatus, setFormStatus] = React.useState<RequestStatus>("idle");
  const { replace } = useRouter();

  const [password, { data, error, client }] = useMutation(CHANGE_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<MutationChangePasswordArgs>({
    resolver: yupResolver(changePasswordValidator),
  });

  const { userId } = useSession();

  const user = client.readFragment({
    id: userId ?? "",
    fragment: GET_USER_EMAIL,
  });

  const submitHandler = (values: MutationChangePasswordArgs) => {
    setFormStatus("loading");

    void password({
      variables: values,
      onError: () => setFormStatus("error"),
      onCompleted(changePasswordData) {
        switch (changePasswordData.changePassword.__typename) {
          case "ChangePasswordValidationError": {
            const fieldErrors = changePasswordData.changePassword;
            const focus = { shouldFocus: true };

            if (fieldErrors.confirmNewPasswordError) {
              const message = fieldErrors.confirmNewPasswordError;
              setError("confirmNewPassword", { message }, focus);
            }

            if (fieldErrors.newPasswordError) {
              const message = fieldErrors.newPasswordError;
              setError("newPassword", { message }, focus);
            }

            if (fieldErrors.currentPasswordError) {
              const message = fieldErrors.currentPasswordError;
              setError("currentPassword", { message }, focus);
            }

            setFormStatus("idle");
            break;
          }

          case "AuthenticationError":
            void client.clearStore();
            void replace("/login?status=unauthenticated");
            break;

          case "UnknownError":
            void client.clearStore();
            void replace("/login?status=unauthorized");
            break;

          case "RegistrationError":
            void replace("/register?status=unregistered");
            break;

          case "NotAllowedError":
          case "ServerError":
          default:
            setFormStatus("error");
            break;

          case "Response":
            setFormStatus("success");
            reset();
        }
      },
    });
  };

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
  } else if (error?.graphQLErrors[0]) {
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
        width="100%"
        maxWidth={570}
      >
        <TextField
          id="email"
          autoComplete="email"
          value={user?.email}
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

ChangePassword.layout = settingsLayout("Change your password", {
  title: "Change Password",
});

export default ChangePassword;
