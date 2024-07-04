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
  imageBannerError: string | undefined;
  imageBanner: PostImageBanner | undefined;
  dispatch: React.Dispatch<CreatePostAction>;
}

const PostFileInput = (props: PostFileInputProps) => {
  const { dispatch, imageBanner, imageBannerError } = props;
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

  const hasError = !!(imageError || imageBannerError);
  const errorMsg = imageError || imageBannerError;

  return (
    <TooltipHint hint="An optional image banner that gives visual meaning to the post">
      <FormControl fullWidth error={hasError}>
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
              color: hasError ? "error.main" : "text.secondary",
              fontSize: "1rem",
              fontWeight: 400,
              width: "100%",
              borderColor: hasError ? "error.main" : "action.active",
              transition: "none",
              "&:hover": {
                color: hasError ? "error.main" : "text.secondary",
                bgcolor: "transparent",
                borderColor: hasError ? "error.main" : "text.primary",
              },
              [theme.breakpoints.down("md")]: {
                py: 1.625,
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
          aria-invalid={!!hasError}
          aria-errormessage={hasError ? "image-helper-text" : undefined}
          aria-describedby={hasError ? "image-helper-text" : undefined}
          ref={fileInputRef}
          key={imageBanner?.file.name}
        />
        {hasError && (
          <FormHelperText error id="image-helper-text">
            {errorMsg}
          </FormHelperText>
        )}
      </FormControl>
    </TooltipHint>
  );
};

export default PostFileInput;
