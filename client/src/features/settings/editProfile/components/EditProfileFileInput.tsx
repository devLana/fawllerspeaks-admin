import * as React from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";

export interface ImageFile {
  file: File | null;
  error: string;
  fileUrl: string;
}

interface EditProfileFileInputProps {
  image: ImageFile;
  setImage: React.Dispatch<React.SetStateAction<ImageFile>>;
}

const FileInput = styled("input")({
  position: "absolute",
  height: "1px",
  width: "1px",
  overflow: "hidden",
  clip: "rect(1px, 1px, 1px, 1px)",
});

const EditProfileFileInput = (props: EditProfileFileInputProps) => {
  const { image, setImage } = props;

  const [hasEnteredDropZone, setHasEnteredDropZone] = React.useState(false);

  const handleRemoveImage = () => {
    if (image.fileUrl) window.URL.revokeObjectURL(image.fileUrl);
    setImage({ ...image, file: null, fileUrl: "" });
  };

  const handleFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      if (!files.item(0)?.type.startsWith("image/")) {
        setImage({ ...image, error: "You can only upload an image file" });
        return;
      }

      if (image.fileUrl) window.URL.revokeObjectURL(image.fileUrl);

      setImage({
        error: "",
        file: files.item(0),
        fileUrl: window.URL.createObjectURL(files[0]),
      });
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setHasEnteredDropZone(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setHasEnteredDropZone(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();

    handleFile(e.dataTransfer.files);
    e.dataTransfer.clearData();
    setHasEnteredDropZone(false);
  };

  return (
    <>
      <FileInput
        type="file"
        name="image"
        id="image-avatar"
        accept="image/*"
        onChange={handleImage}
        aria-invalid={!!image.error}
      />
      {image.file ? (
        <div>
          <Avatar
            src={image.fileUrl}
            alt="Profile Image upload preview"
            sx={{ width: 200, height: 200, mb: 2, mx: "auto" }}
          />
          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button
              size="small"
              onClick={handleRemoveImage}
              startIcon={<HideImageOutlinedIcon />}
            >
              Remove Image
            </Button>
            <Button
              variant="outlined"
              size="small"
              component="label"
              htmlFor="image-avatar"
              startIcon={<AddPhotoAlternateOutlinedIcon />}
            >
              Change Image
            </Button>
          </Stack>
        </div>
      ) : (
        <Button
          size="large"
          component="label"
          htmlFor="image-avatar"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
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
