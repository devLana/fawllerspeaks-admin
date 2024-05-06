import * as React from "react";

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

import { useHandleFile } from "@hooks/useHandleFile";
import { FileInput } from "@components/FileInput";
import PostImagePreview from "./PostImagePreview";
import TooltipHint from "../TooltipHint";
import { initImage } from "./utils/initImage";

interface PostFileInputProps {
  imageBanner?: File;
  onSelectImage: (imageFile?: File) => void;
}

const PostFileInput = ({ onSelectImage, imageBanner }: PostFileInputProps) => {
  const [image, setImage] = React.useState<{ error: string; blobUrl: string }>(
    () => initImage(imageBanner)
  );

  const {
    fileInputRef,
    hasEnteredDropZone,
    handleChange,
    handleDragEvent,
    handleDrop,
    handleKeydown,
  } = useHandleFile({
    blobUrl: image.blobUrl,
    imageFilename: imageBanner?.name,
    errorCb: handleFileError,
    successCb: handleFileSuccess,
  });

  function handleFileError(errorMsg: string) {
    setImage({ ...image, error: errorMsg });
  }

  function handleFileSuccess(imageFile: File) {
    setImage({ error: "", blobUrl: window.URL.createObjectURL(imageFile) });
    onSelectImage(imageFile);
  }

  const handleRemoveImage = () => {
    if (image.blobUrl) window.URL.revokeObjectURL(image.blobUrl);

    setImage({ error: "", blobUrl: "" });
    onSelectImage();
  };

  const id = "post-image-banner";

  return (
    <TooltipHint
      hint="An optional image banner that gives visual meaning to the post"
      childHasError={!!image.error}
    >
      <FormControl fullWidth>
        {imageBanner && image.blobUrl ? (
          <PostImagePreview
            id={id}
            imageSrc={image.blobUrl}
            onClick={handleRemoveImage}
            onKeydown={handleKeydown}
          />
        ) : (
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
            Select A Post Image Banner
          </Button>
        )}
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
        {image.error && (
          <FormHelperText error id="image-helper-text">
            {image.error}
          </FormHelperText>
        )}
      </FormControl>
    </TooltipHint>
  );
};

export default PostFileInput;
