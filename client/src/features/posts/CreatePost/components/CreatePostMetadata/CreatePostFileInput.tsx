import * as React from "react";

import FormHelperText from "@mui/material/FormHelperText";
import type { UseFormRegisterReturn } from "react-hook-form";

import useHandleFileUrl from "@hooks/createPost/useHandleFileUrl";
import { useSingleFileHandler } from "@hooks/useSingleFileHandler";
import { FileInput } from "@components/ui/FileInput";
import PostImageBannerPreview from "@features/posts/components/PostImageBanner/PostImageBannerPreview";
import PostImageBannerInputButton from "@features/posts/components/PostImageBannerInput/InputButton";
import PostImageBannerInputWrapper from "@features/posts/components/PostImageBannerInput/InputWrapper";

interface CreatePostFileInputProps {
  imageBannerError: string | undefined;
  imageBanner: File | null;
  register: UseFormRegisterReturn<"imageBanner">;
  onError: (errorMsg: string) => void;
  onSelectImage: (file: File) => void;
  clearError: VoidFunction;
  resetField: VoidFunction;
}

const CreatePostFileInput = ({
  imageBanner,
  imageBannerError,
  register,
  clearError,
  onError,
  onSelectImage,
  resetField,
}: CreatePostFileInputProps) => {
  const { fileUrl, setFileUrl } = useHandleFileUrl(imageBanner);

  const {
    fileInputRef,
    hasEnteredDropZone,
    handleChange,
    handleDragEvent,
    handleDrop,
    handleKeydown,
  } = useSingleFileHandler({
    blobUrl: fileUrl ?? "",
    imageFilename: imageBanner?.name,
    errorCb: errorMsg => onError(errorMsg),
    successCb: handleAddImage,
  });

  function handleAddImage(file: File) {
    if (fileUrl) window.URL.revokeObjectURL(fileUrl);

    clearError();
    onSelectImage(file);
    setFileUrl(window.URL.createObjectURL(file));
  }

  const handleRemoveImage = () => {
    if (fileUrl) window.URL.revokeObjectURL(fileUrl);

    resetField();
    setFileUrl(null);
  };

  const id = "post-image-banner";
  const hasError = !!imageBannerError;

  return (
    <PostImageBannerInputWrapper hasError={hasError}>
      {fileUrl ? (
        <PostImageBannerPreview
          id={id}
          src={fileUrl}
          onClick={handleRemoveImage}
          onKeydown={handleKeydown}
        />
      ) : (
        <PostImageBannerInputButton
          id={id}
          label="Select A Post Image Banner"
          hasError={hasError}
          hasEnteredDropZone={hasEnteredDropZone}
          onDrop={handleDrop}
          onDragOver={handleDragEvent()}
          onDragEnter={handleDragEvent(true)}
          onDragLeave={handleDragEvent(false)}
          onKeyDown={handleKeydown}
        />
      )}
      <FileInput
        {...register}
        name="image"
        id={id}
        accept="image/*"
        tabIndex={-1}
        onChange={handleChange}
        aria-invalid={!!hasError}
        aria-errormessage={hasError ? "image-helper-text" : undefined}
        aria-describedby={hasError ? "image-helper-text" : undefined}
        ref={fileInputRef}
        key={imageBanner?.name}
      />
      {hasError && (
        <FormHelperText error id="image-helper-text">
          {imageBannerError}
        </FormHelperText>
      )}
    </PostImageBannerInputWrapper>
  );
};

export default CreatePostFileInput;
