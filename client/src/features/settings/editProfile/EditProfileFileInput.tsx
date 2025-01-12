import Button from "@mui/material/Button";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

import { useSingleFileHandler } from "@hooks/useSingleFileHandler";
import EditProfileImagePreview from "./EditProfileImagePreview";
import { FileInput } from "@components/ui/FileInput";
import type { EditProfileImage } from "types/settings/editProfile";
import type { Status, StateSetterFn } from "@types";

interface EditProfileFileInputProps {
  image: EditProfileImage;
  userImage: string;
  removeCurrentImage: boolean;
  setImage: StateSetterFn<EditProfileImage>;
  setRemoveCurrentImage: StateSetterFn<boolean>;
  setFormStatus: StateSetterFn<Status>;
}

const EditProfileFileInput = ({
  image,
  userImage,
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
  } = useSingleFileHandler({
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
          alt="Current profile image"
        />
      ) : (
        <Button
          size="large"
          component="label"
          htmlFor={id}
          role={undefined}
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
