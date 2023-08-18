import * as React from "react";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

import EditProfileImagePreview from "./EditProfileImagePreview";
import type { User } from "@hooks/useGetUserInfo";

export interface ImageFile {
  file: File | null;
  error: string;
  fileUrl: string;
}

interface EditProfileFileInputProps {
  user: User | null;
  image: ImageFile;
  setImage: React.Dispatch<React.SetStateAction<ImageFile>>;
  setRemoveCurrentImage: React.Dispatch<React.SetStateAction<boolean>>;
  removeCurrentImage: boolean;
}

const FileInput = styled("input")({
  position: "absolute",
  height: "1px",
  width: "1px",
  overflow: "hidden",
  opacity: 0,
});

const EditProfileFileInput = ({
  image,
  setImage,
  user,
  removeCurrentImage,
  setRemoveCurrentImage,
}: EditProfileFileInputProps) => {
  const [hasEnteredDropZone, setHasEnteredDropZone] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleRemoveImage = () => {
    if (image.fileUrl) window.URL.revokeObjectURL(image.fileUrl);
    setImage({ ...image, file: null, fileUrl: "" });
  };

  const handleFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!files.item(0)?.type.startsWith("image/")) {
      setImage({ ...image, error: "You can only upload an image file" });
      return;
    }

    if (files.item(0)?.name === image.file?.name) return;

    if (image.fileUrl) window.URL.revokeObjectURL(image.fileUrl);

    setRemoveCurrentImage(true);
    setImage({
      error: "",
      file: files.item(0),
      fileUrl: window.URL.createObjectURL(files[0]),
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
      <>
        {input}
        <EditProfileImagePreview
          src={image.fileUrl}
          onClick={() => setRemoveCurrentImage(true)}
          onKeyDown={handleKeyDown}
          alt={`${user.firstName} ${user.lastName} profile image`}
        />
      </>
    );
  }

  if (image.file) {
    return (
      <>
        {input}
        <EditProfileImagePreview
          src={image.fileUrl}
          onClick={handleRemoveImage}
          onKeyDown={handleKeyDown}
          alt="Profile Image upload preview"
        />
      </>
    );
  }

  return (
    <>
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
    </>
  );
};

export default EditProfileFileInput;
