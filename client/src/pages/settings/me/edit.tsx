import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

import useUploadImage from "@hooks/useUploadImage";
import useGetUserInfo from "@hooks/useGetUserInfo";
import EditProfileFileInput from "@features/settings/editProfile/components/EditProfileFileInput";
import { EDIT_PROFILE } from "@features/settings/editProfile/operations/EDIT_PROFILE";
import { editProfileValidator } from "@features/settings/editProfile/utils/editProfileValidator";
import settingsLayout from "@utils/settings/settingsLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { MutationEditProfileArgs } from "@apiTypes";
import type { EditProfileImage, Status, NextPageWithLayout } from "@types";

type EditProfile = Omit<MutationEditProfileArgs, "image">;

const EditMe: NextPageWithLayout = () => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");
  const [removeCurrentImage, setRemoveCurrentImage] = React.useState(false);
  const [image, setImage] = React.useState<EditProfileImage>({
    error: "",
    file: null,
    blobUrl: "",
  });
  const router = useRouter();

  const [editProfile, { error, client }] = useMutation(EDIT_PROFILE);

  const user = useGetUserInfo();
  const upload = useUploadImage();

  const {
    register,
    handleSubmit,
    formState: { errors, defaultValues },
    setError,
  } = useForm<EditProfile>({
    resolver: yupResolver(editProfileValidator),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
  });

  const submitHandler = async (values: EditProfile) => {
    setFormStatus("loading");

    let variables: MutationEditProfileArgs = values;
    let uploadHasError = false;

    if (image.file) {
      /**
       * If the user has selected a new image to be uploaded:
       * - attempt to upload the image to storage
       * - if the upload was successful, append the image link response to variables
       */
      const data = await upload(image.file, "avatar");
      ({ uploadHasError } = data);

      if (data.imageLink) {
        variables = { ...variables, image: data.imageLink };
      }
    } else if (removeCurrentImage) {
      /**
       * The user is attempting to remove their current uploaded image:
       * send "image: null" back to the api server
       */
      variables = { ...variables, image: null };
    }

    void editProfile({
      variables,
      onError() {
        /**
         * The api request failed for some reason:
         * Set error status and reset the image error state
         */
        setFormStatus("error");
        setImage({ ...image, error: "" });
      },
      onCompleted(editData) {
        switch (editData.editProfile.__typename) {
          case "EditProfileValidationError": {
            const focus = { shouldFocus: true };
            const { firstNameError, imageError, lastNameError } =
              editData.editProfile;

            if (imageError) {
              setImage({ ...image, error: imageError });
            }

            if (lastNameError) {
              setError("lastName", { message: lastNameError }, focus);
            }

            if (firstNameError) {
              setError("firstName", { message: firstNameError }, focus);
            }

            setFormStatus(imageError ? "error" : "idle");
            break;
          }

          case "AuthenticationError":
            void client.clearStore();
            void router.replace("/login?status=unauthenticated");
            break;

          case "UnknownError":
            void client.clearStore();
            void router.replace("/login?status=unauthorized");
            break;

          case "RegistrationError":
            void router.replace("/register?status=unregistered");
            break;

          case "EditedProfile": {
            const redirectStatus = uploadHasError ? "upload-error" : "upload";
            void router.push(`/settings/me?status=${redirectStatus}`);
            break;
          }

          default:
            /**
             * The api responds with an unsupported object type:
             * Set error status and reset the image error state
             */
            setFormStatus("error");
            setImage({ ...image, error: "" });
            break;
        }
      },
    });
  };

  let msg =
    "You are unable to update your profile at the moment. Please try again later";

  if (image.error) {
    msg = image.error;
  } else if (error?.graphQLErrors[0]) {
    msg = error.graphQLErrors[0].message;
  }

  return (
    <>
      <Snackbar
        message={msg}
        open={formStatus === "error"}
        onClose={handleCloseAlert<Status>("idle", setFormStatus)}
      />
      <form onSubmit={handleSubmit(submitHandler)}>
        <Grid container rowSpacing={2} columnSpacing={2} mb={3.3} mt={0}>
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
        <EditProfileFileInput
          image={image}
          user={user}
          removeCurrentImage={removeCurrentImage}
          setImage={setImage}
          setRemoveCurrentImage={setRemoveCurrentImage}
          setFormStatus={setFormStatus}
        />
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

EditMe.layout = settingsLayout("Edit your profile", {
  title: "Edit Admin Profile",
});

export default EditMe;
