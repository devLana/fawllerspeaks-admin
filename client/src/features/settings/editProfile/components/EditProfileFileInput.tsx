import * as React from "react";

import Button from "@mui/material/Button";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

import { useHandleFile } from "@hooks/useHandleFile";
import EditProfileImagePreview from "./EditProfileImagePreview";
import { FileInput } from "@components/FileInput";
import type {
  EditProfileImage,
  EditProfileFormProps,
  Status,
  StateSetterFn,
} from "@types";

interface EditProfileFileInputProps extends EditProfileFormProps {
  image: EditProfileImage;
  removeCurrentImage: boolean;
  setImage: StateSetterFn<EditProfileImage>;
  setRemoveCurrentImage: StateSetterFn<boolean>;
  setFormStatus: StateSetterFn<Status>;
}

const EditProfileFileInput = ({
  image,
  userImage,
  firstName,
  lastName,
  removeCurrentImage,
  setImage,
  setRemoveCurrentImage,
  setFormStatus,
}: EditProfileFileInputProps) => {
  const {
    fileInputRef,
    hasEnteredDropZone,
    handleChange,
    handleDragEvent,
    handleDrop,
    handleKeydown,
  } = useHandleFile({
    blobUrl: image.blobUrl,
    imageFilename: image.file?.name,
    errorCb: handleFileError,
    successCb: handleFileSuccess,
  });

  function handleFileError(errorMsg: string) {
    setImage({ ...image, error: errorMsg });
    setFormStatus("error");
  }

  function handleFileSuccess(imageFile: File) {
    setImage({
      error: "",
      file: imageFile,
      blobUrl: window.URL.createObjectURL(imageFile),
    });
  }

  const handleRemoveImage = () => {
    if (image.blobUrl) window.URL.revokeObjectURL(image.blobUrl);
    setImage({ ...image, file: null, blobUrl: "" });
  };

  const id = "image-avatar";

  return (
    <>
      <FileInput
        type="file"
        name="image"
        id={id}
        accept="image/*"
        onChange={handleChange}
        aria-invalid={!!image.error}
        tabIndex={-1}
        ref={fileInputRef}
        key={image.file?.name}
      />
      {image.file ? (
        <EditProfileImagePreview
          id={id}
          src={image.blobUrl}
          onClick={handleRemoveImage}
          onKeyDown={handleKeydown}
          alt="Profile image upload preview"
        />
      ) : userImage && !removeCurrentImage ? (
        <EditProfileImagePreview
          id={id}
          src={userImage}
          onClick={() => setRemoveCurrentImage(true)}
          onKeyDown={handleKeydown}
          alt={`${firstName} ${lastName} profile image`}
        />
      ) : (
        <Button
          size="large"
          component="label"
          htmlFor={id}
          onDrop={handleDrop}
          onDragOver={handleDragEvent()}
          onDragEnter={handleDragEvent(true)}
          onDragLeave={handleDragEvent(false)}
          onKeyDown={handleKeydown}
          startIcon={<AddPhotoAlternateOutlinedIcon />}
          sx={theme => ({
            [theme.breakpoints.up("md")]: {
              color: "text.primary",
              width: "100%",
              height: 180,
              border: 1,
              borderColor: hasEnteredDropZone ? "primary.main" : "divider",
              ...(hasEnteredDropZone && { borderStyle: "dashed" }),
              "&:hover": { borderColor: "text.primary" },
            },
          })}
        >
          Select Profile Image
        </Button>
      )}
    </>
  );
};

export default EditProfileFileInput;
