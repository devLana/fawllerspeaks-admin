import * as React from "react";

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

import { FileInput } from "@components/FileInput";
import PostImagePreview from "./PostImagePreview";
import { initImage } from "./utils/initImage";

interface PostFileInputProps {
  imageBanner?: File;
  onSelectImage: (imageFile?: File) => void;
}

const PostFileInput = ({ onSelectImage, imageBanner }: PostFileInputProps) => {
  const [hasEnteredDropZone, setHasEnteredDropZone] = React.useState(false);
  const [image, setImage] = React.useState<{ error: string; blobUrl: string }>(
    () => initImage(imageBanner)
  );

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    return () => {
      if (image.blobUrl) window.URL.revokeObjectURL(image.blobUrl);
    };
  }, [image.blobUrl]);

  const handleFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!files.item(0)?.type.startsWith("image/")) {
      setImage({ ...image, error: "You can only upload an image file" });
      return;
    }

    if (files.item(0)?.name === imageBanner?.name) return;

    if (image.blobUrl) window.URL.revokeObjectURL(image.blobUrl);

    setImage({ error: "", blobUrl: window.URL.createObjectURL(files[0]) });
    onSelectImage(files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleKeydown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (image.blobUrl) window.URL.revokeObjectURL(image.blobUrl);

    setImage({ error: "", blobUrl: "" });
    onSelectImage();
  };

  const id = "post-image-banner";

  const fileInput = (
    <FileInput
      type="file"
      name="image"
      id={id}
      accept="image/*"
      tabIndex={-1}
      onChange={handleChange}
      aria-invalid={!!image.error}
      aria-errormessage={image.error ? "image-helper-text" : undefined}
      ref={fileInputRef}
      key={imageBanner?.name}
    />
  );

  return (
    <FormControl fullWidth margin="normal">
      {imageBanner && image.blobUrl ? (
        <PostImagePreview
          id={id}
          fileInput={fileInput}
          imageSrc={image.blobUrl}
          onClick={handleRemoveImage}
          onKeydown={handleKeydown}
        />
      ) : (
        <>
          <Button
            component="label"
            size="large"
            htmlFor={id}
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            onDrop={handleDrop}
            onDragOver={handleDragEvent()}
            onDragEnter={handleDragEvent(true)}
            onDragLeave={handleDragEvent(false)}
            onKeyDown={handleKeydown}
            sx={theme => ({
              [theme.breakpoints.down("md")]: { alignSelf: "flex-start" },
              [theme.breakpoints.up("md")]: {
                color: "text.primary",
                width: "100%",
                height: 280,
                border: 1,
                borderColor: hasEnteredDropZone ? "primary.main" : "divider",
                ...(hasEnteredDropZone && { borderStyle: "dashed" }),
                "&:hover": { borderColor: "text.primary" },
              },
            })}
          >
            Select Post Image Banner
          </Button>
          {fileInput}
        </>
      )}
      {image.error && (
        <FormHelperText error id="image-helper-text">
          {image.error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default PostFileInput;
