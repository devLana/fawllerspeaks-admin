import * as React from "react";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

import useEditProfile from "@hooks/editProfile/useEditProfile";
import useGetUserInfo from "@hooks/session/useGetUserInfo";
import EditProfileFileInput from "../EditProfileFileInput";
import { EDIT_PROFILE } from "@mutations/editProfile/EDIT_PROFILE";
import { editProfileSchema } from "@validators/editProfileSchema";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { Status } from "@types";
import type { MutationEditProfileArgs } from "@apiTypes";

type EditProfile = Omit<MutationEditProfileArgs, "image">;

const EditProfileForm = () => {
  const [removeCurrentImage, setRemoveCurrentImage] = React.useState(false);
  const [editProfile, { error }] = useMutation(EDIT_PROFILE);
  const user = useGetUserInfo();

  const { register, handleSubmit, formState, setError } = useForm<EditProfile>({
    resolver: yupResolver(editProfileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
  });

  const { formStatus, image, onCompleted, setFormStatus, setImage, handleImg } =
    useEditProfile(setError);

  const submitHandler = async (values: EditProfile) => {
    setFormStatus("loading");

    const { imageUrl, uploadHasError } = await handleImg(removeCurrentImage);

    const variables: MutationEditProfileArgs = {
      ...values,
      ...((imageUrl || imageUrl === null) && { image: imageUrl }),
    };

    void editProfile({
      variables,
      onError() {
        /*
         * The api request failed for some reason:
         * Set error status and reset the image error state
         */
        setFormStatus("error");
        setImage({ ...image, error: "" });
      },
      onCompleted: data => onCompleted(data, uploadHasError),
    });
  };

  const { errors, defaultValues } = formState;

  let msg =
    "You are unable to update your profile at the moment. Please try again later";

  if (image.error) {
    msg = image.error;
  } else if (error?.graphQLErrors?.[0]) {
    msg = error.graphQLErrors[0].message;
  }

  return (
    <>
      <Snackbar
        message={msg}
        open={formStatus === "error"}
        onClose={handleCloseAlert<Status>("idle", setFormStatus)}
      />
      <form
        onSubmit={handleSubmit(submitHandler)}
        noValidate
        aria-labelledby="page-title"
      >
        <Grid
          container
          rowSpacing={2}
          columnSpacing={2}
          sx={{ mb: 3.3, mt: 0 }}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              id="first-name"
              autoComplete="given-name"
              label="First Name"
              margin="none"
              error={!!errors.firstName}
              helperText={errors.firstName?.message ?? null}
              defaultValue={defaultValues?.firstName ?? ""}
              fullWidth
              {...register("firstName")}
              inputProps={{
                "aria-errormessage": errors.firstName
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
              error={!!errors.lastName}
              helperText={errors.lastName?.message ?? null}
              defaultValue={defaultValues?.lastName ?? ""}
              fullWidth
              {...register("lastName")}
              inputProps={{
                "aria-errormessage": errors.lastName
                  ? "last-name-helper-text"
                  : undefined,
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mb: 3.3 }}>
          <EditProfileFileInput
            image={image}
            userImage={user?.image ?? ""}
            removeCurrentImage={removeCurrentImage}
            setImage={setImage}
            setRemoveCurrentImage={setRemoveCurrentImage}
            setFormStatus={setFormStatus}
          />
        </Box>
        <LoadingButton
          loading={formStatus === "loading"}
          variant="contained"
          size="large"
          type="submit"
          fullWidth
          sx={{ textTransform: "uppercase" }}
        >
          <span>Edit</span>
        </LoadingButton>
      </form>
    </>
  );
};

export default EditProfileForm;
