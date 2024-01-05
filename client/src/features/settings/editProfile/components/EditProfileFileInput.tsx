import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

import EditProfileImagePreview from "./EditProfileImagePreview";
import { FileInput } from "@components/FileInput";
import type { User } from "@hooks/useGetUserInfo";
import type { FormStatus, StateSetterFn } from "@types";

export interface ImageFile {
  file: File | null;
  error: string;
  blobUrl: string;
}

interface EditProfileFileInputProps {
  image: ImageFile;
  user: User | null;
  removeCurrentImage: boolean;
  setImage: StateSetterFn<ImageFile>;
  setRemoveCurrentImage: StateSetterFn<boolean>;
  setFormStatus: StateSetterFn<FormStatus>;
}

const EditProfileFileInput = ({
  image,
  user,
  removeCurrentImage,
  setImage,
  setRemoveCurrentImage,
  setFormStatus,
}: EditProfileFileInputProps) => {
  const [hasEnteredDropZone, setHasEnteredDropZone] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleRemoveImage = () => {
    if (image.blobUrl) window.URL.revokeObjectURL(image.blobUrl);
    setImage({ ...image, file: null, blobUrl: "" });
  };

  const handleFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!files.item(0)?.type.startsWith("image/")) {
      setImage({ ...image, error: "You can only upload an image file" });
      setFormStatus("error");
      return;
    }

    if (files.item(0)?.name === image.file?.name) return;

    if (image.blobUrl) window.URL.revokeObjectURL(image.blobUrl);

    // removeCurrentImage is set to true here, so as to determine what get's rendered in this component below
    setRemoveCurrentImage(true);
    setImage({
      error: "",
      file: files.item(0),
      blobUrl: window.URL.createObjectURL(files[0]),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files);
  };

  const handleDragEvent = (value: boolean | null = null) => {
    return (e: React.DragEvent<HTMLLabelElement>) => {
      e.stopPropagation();
      e.preventDefault();

      if (value !== null) setHasEnteredDropZone(value);
    };
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvent(false)(e);
    handleFile(e.dataTransfer.files);
    e.dataTransfer.clearData();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
  };

  const input = (
    <FileInput
      type="file"
      name="image"
      id="image-avatar"
      accept="image/*"
      onChange={handleImageChange}
      aria-invalid={!!image.error}
      tabIndex={-1}
      ref={fileInputRef}
      key={image.file?.name}
    />
  );

  if (user?.image && !removeCurrentImage) {
    return (
      <Box mb={3.3}>
        {input}
        <EditProfileImagePreview
          src={user.image}
          onClick={() => setRemoveCurrentImage(true)}
          onKeyDown={handleKeyDown}
          alt={`${user.firstName} ${user.lastName} profile image`}
        />
      </Box>
    );
  }

  if (image.file) {
    return (
      <Box mb={3.3}>
        {input}
        <EditProfileImagePreview
          src={image.blobUrl}
          onClick={handleRemoveImage}
          onKeyDown={handleKeyDown}
          alt="Profile image upload preview"
        />
      </Box>
    );
  }

  return (
    <Box mb={3.3}>
      {input}
      <Button
        size="large"
        component="label"
        htmlFor="image-avatar"
        onDrop={handleDrop}
        onDragOver={handleDragEvent()}
        onDragEnter={handleDragEvent(true)}
        onDragLeave={handleDragEvent(false)}
        onKeyDown={handleKeyDown}
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
    </Box>
  );
};

export default EditProfileFileInput;
