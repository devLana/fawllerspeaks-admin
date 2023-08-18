import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import { yupResolver } from "@hookform/resolvers/yup";

import useGetUserInfo from "@hooks/useGetUserInfo";
import EditProfileForm from "@features/settings/editProfile/components/EditProfileForm";
import EditProfileFileInput, {
  type ImageFile,
} from "@features/settings/editProfile/components/EditProfileFileInput";
import settingsLayout from "@utils/settings/settingsLayout";
import { editProfileValidator } from "@features/settings/editProfile/utils/editProfileValidator";
import { EDIT_PROFILE } from "@features/settings/editProfile/operations/EDIT_PROFILE";
import type { NextPageWithLayout } from "@types";
import type { MutationEditProfileArgs } from "@apiTypes";

type EditProfile = Omit<MutationEditProfileArgs, "image">;
type FormStatus = "idle" | "submitting" | "error" | "success";

const EditMe: NextPageWithLayout = () => {
  const [formStatus, setFormStatus] = React.useState<FormStatus>("idle");
  const [removeCurrentImage, setRemoveCurrentImage] = React.useState(false);
  const [image, setImage] = React.useState<ImageFile>({
    error: "",
    file: null,
    fileUrl: "",
  });

  const [editProfile, { error, client }] = useMutation(EDIT_PROFILE, {
    onError: () => setFormStatus("error"),
  });

  const user = useGetUserInfo();

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

  const submitHandler = (values: EditProfile) => {
    // const formData = new FormData();
  };

  const isLoading = formStatus === "submitting";

  return (
    <>
      <EditProfileForm
        onSubmit={handleSubmit(submitHandler)}
        register={register}
        fieldErrors={errors}
        defaultValues={defaultValues}
        isLoading={isLoading}
        fileInput={
          <EditProfileFileInput
            image={image}
            setImage={setImage}
            user={user}
            setRemoveCurrentImage={setRemoveCurrentImage}
            removeCurrentImage={removeCurrentImage}
          />
        }
      />
      {image.error && (
        <Snackbar
          message={image.error}
          open={true}
          onClose={() => setImage({ ...image, error: "" })}
        />
      )}
    </>
  );
};

EditMe.layout = settingsLayout("Edit your profile", {
  title: "Edit Admin Profile",
});

export default EditMe;
