import FormHelperText from "@mui/material/FormHelperText";
import type { UseFormRegisterReturn } from "react-hook-form";

import { useSingleFileHandler } from "@hooks/useSingleFileHandler";
import useHandleFileUrl from "@hooks/useHandleFileUrl";
import { FileInput } from "@components/ui/FileInput";
import PostImageBannerPreview from "@features/posts/components/PostImageBanner/PostImageBannerPreview";
import PostImageBannerInputButton from "@features/posts/components/PostImageBannerInput/InputButton";
import PostImageBannerInputWrapper from "@features/posts/components/PostImageBannerInput/InputWrapper";
import type { EditPostAction, EditPostImageBanner } from "types/posts/editPost";

interface EditPostFileInputProps {
  imageBannerError: string | undefined;
  register: UseFormRegisterReturn<"imageBanner">;
  imageBanner: EditPostImageBanner;
  dispatch: React.Dispatch<EditPostAction>;
  onError: (errorMsg: string) => void;
  onSelectImage: (file: File) => void;
  clearError: VoidFunction;
  resetField: VoidFunction;
}

const EditPostFileInput = (props: EditPostFileInputProps) => {
  const { fileUrl, setFileUrl } = useHandleFileUrl(props.imageBanner.file);

  const {
    fileInputRef,
    hasEnteredDropZone,
    handleChange,
    handleDragEvent,
    handleDrop,
    handleKeydown,
  } = useSingleFileHandler({
    blobUrl: fileUrl ?? "",
    imageFilename: props.imageBanner.file?.name,
    errorCb: errorMsg => props.onError(errorMsg),
    successCb: handleSelectedImageFile,
  });

  function handleSelectedImageFile(file: File) {
    if (fileUrl) window.URL.revokeObjectURL(fileUrl);

    props.clearError();
    props.onSelectImage(file);
    setFileUrl(window.URL.createObjectURL(file));
  }

  const handleRemoveImageFile = () => {
    if (fileUrl) window.URL.revokeObjectURL(fileUrl);

    props.resetField();
    setFileUrl(null);
  };

  const id = "post-image-banner";
  const hasError = !!props.imageBannerError;

  return (
    <PostImageBannerInputWrapper hasError={hasError}>
      {fileUrl ? (
        <PostImageBannerPreview
          id={id}
          src={fileUrl}
          onClick={handleRemoveImageFile}
          onKeydown={handleKeydown}
        />
      ) : props.imageBanner.url ? (
        <PostImageBannerPreview
          id={id}
          src={props.imageBanner.url}
          sizes="(max-width: 600px) 415px, 670px"
          onClick={() => props.dispatch({ type: "REMOVE_IMAGE_BANNER_URL" })}
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
        {...props.register}
        name="image"
        id={id}
        accept="image/*"
        tabIndex={-1}
        onChange={handleChange}
        aria-invalid={!!hasError}
        aria-errormessage={hasError ? "image-helper-text" : undefined}
        aria-describedby={hasError ? "image-helper-text" : undefined}
        ref={fileInputRef}
        key={props.imageBanner.file?.name}
      />
      {hasError && (
        <FormHelperText error id="image-helper-text">
          {props.imageBannerError}
        </FormHelperText>
      )}
    </PostImageBannerInputWrapper>
  );
};

export default EditPostFileInput;
