import * as React from "react";

import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

import ToastActionButtons from "../components/ToastActionButtons";
import type { Status } from "@types";

interface UnpublishPostProps {
  message: string | React.ReactElement;
  showToast: boolean;
  unpublishStatus: Status | "success";
  undoUnpublishHasError: boolean;
  onCloseToast: VoidFunction;
  onUnpublish: VoidFunction;
  onUndoUnpublish: VoidFunction;
  onUnpublished: VoidFunction;
  onUndoneUnpublish: VoidFunction;
}

const UnpublishPost = ({
  message,
  showToast,
  unpublishStatus,
  undoUnpublishHasError,
  onCloseToast,
  onUnpublish,
  onUndoUnpublish,
  onUnpublished,
  onUndoneUnpublish,
}: UnpublishPostProps) => {
  let isOpen = false;
  let action: React.ReactNode;
  let autoHideDuration: null | undefined;
  let onClose: VoidFunction | undefined;

  if (showToast) {
    const handleUnpublish = () => {
      onCloseToast();
      onUnpublish();
    };

    isOpen = true;
    autoHideDuration = null;
    action = (
      <ToastActionButtons
        proceedLabel="Yes unpublish post"
        cancelLabel="Cancel"
        onProceed={handleUnpublish}
        onCancel={onCloseToast}
      />
    );
  } else if (unpublishStatus !== "idle") {
    isOpen = true;
    onClose = onUnpublished;

    if (unpublishStatus === "loading") {
      autoHideDuration = null;
      onClose = undefined;
    } else if (unpublishStatus === "success") {
      const handleUndoUnpublish = () => {
        onUnpublished();
        onUndoUnpublish();
      };

      action = (
        <Button onClick={handleUndoUnpublish} sx={{ color: "inherit" }}>
          Undo
        </Button>
      );
    }
  } else if (undoUnpublishHasError) {
    isOpen = true;
    onClose = onUndoneUnpublish;
  }

  return (
    <Snackbar
      open={isOpen}
      message={message}
      autoHideDuration={autoHideDuration}
      action={action}
      onClose={onClose}
      ContentProps={{
        sx: { "&>.MuiSnackbarContent-action": { columnGap: 0.5 } },
      }}
      sx={{ maxWidth: 450, "&>.MuiSnackbarContent-root": { columnGap: 2 } }}
    />
  );
};

export default UnpublishPost;
