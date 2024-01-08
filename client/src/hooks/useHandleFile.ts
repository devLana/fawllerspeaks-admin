import * as React from "react";

interface UseHandleFile {
  blobUrl: string;
  imageFilename: string | undefined;
  errorCb: (errorMsg: string) => void;
  successCb: (imageFile: File) => void;
}

export const useHandleFile = (props: UseHandleFile) => {
  const { blobUrl, imageFilename, errorCb, successCb } = props;

  const [hasEnteredDropZone, setHasEnteredDropZone] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!files.item(0)?.type.startsWith("image/")) {
      return errorCb("You can only upload an image file");
    }

    if (files.item(0)?.name === imageFilename) return;

    if (blobUrl) window.URL.revokeObjectURL(blobUrl);

    successCb(files[0]);
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

  return {
    fileInputRef,
    hasEnteredDropZone,
    handleChange,
    handleDragEvent,
    handleDrop,
    handleKeydown,
  };
};
