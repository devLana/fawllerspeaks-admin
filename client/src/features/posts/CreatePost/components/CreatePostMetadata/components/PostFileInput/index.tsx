import * as React from "react";

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

import { useHandleFile } from "@hooks/useHandleFile";
import { FileInput } from "@components/FileInput";
import PostImagePreview from "./PostImagePreview";
import TooltipHint from "../TooltipHint";
import type { CreatePostAction, PostImageBanner } from "@types";

interface PostFileInputProps {
  imageBanner?: PostImageBanner;
  dispatch: React.Dispatch<CreatePostAction>;
}

const PostFileInput = ({ dispatch, imageBanner }: PostFileInputProps) => {
  const [imageError, setImageError] = React.useState("");

  const {
    fileInputRef,
    hasEnteredDropZone,
    handleChange,
    handleDragEvent,
    handleDrop,
    handleKeydown,
  } = useHandleFile({
    blobUrl: imageBanner?.blobUrl ?? "",
    imageFilename: imageBanner?.file.name,
    errorCb: handleImageError,
    successCb: handleAddImage,
  });

  function handleImageError(errorMsg: string) {
    setImageError(errorMsg);
  }

  function handleAddImage(imageFile: File) {
    setImageError("");
    dispatch({ type: "ADD_POST_BANNER_IMAGE", payload: { imageFile } });
  }

  const handleRemoveImage = () => {
    dispatch({ type: "REMOVE_POST_BANNER_IMAGE" });
  };

  const id = "post-image-banner";

  return (
    <TooltipHint
      hint="An optional image banner that gives visual meaning to the post"
      childHasError={!!imageError}
    >
      <FormControl fullWidth>
        {imageBanner?.blobUrl ? (
          <PostImagePreview
            id={id}
            src={imageBanner.blobUrl}
            onClick={handleRemoveImage}
            onKeydown={handleKeydown}
          />
        ) : (
          <Button
            variant="outlined"
            component="label"
            htmlFor={id}
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            onDrop={handleDrop}
            onDragOver={handleDragEvent()}
            onDragEnter={handleDragEvent(true)}
            onDragLeave={handleDragEvent(false)}
            onKeyDown={handleKeydown}
            sx={theme => ({
              width: "100%",
              [theme.breakpoints.down("md")]: {
                py: 2,
                pl: 2.25,
                justifyContent: "flex-start",
              },
              [theme.breakpoints.up("md")]: {
                height: 280,
                ...(hasEnteredDropZone && { borderStyle: "dashed" }),
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
          aria-invalid={!!imageError}
          aria-errormessage={imageError ? "image-helper-text" : undefined}
          ref={fileInputRef}
          key={imageBanner?.file.name}
        />
        {imageError && (
          <FormHelperText error id="image-helper-text">
            {imageError}
          </FormHelperText>
        )}
      </FormControl>
    </TooltipHint>
  );
};

export default PostFileInput;
