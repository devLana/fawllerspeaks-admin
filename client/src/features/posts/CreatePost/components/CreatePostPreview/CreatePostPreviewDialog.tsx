import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

import type { PostActionStatus } from "types/posts";

interface CreatePostPreviewDialogProps {
  isOpen: boolean;
  createStatus: PostActionStatus;
  onCloseDialog: () => void;
  handleCreatePost: () => Promise<void>;
}

const CreatePostPreviewDialog = (props: CreatePostPreviewDialogProps) => {
  const { isOpen, createStatus, onCloseDialog, handleCreatePost } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={createStatus === "loading" ? undefined : onCloseDialog}
      aria-labelledby="create-post-dialog-title"
    >
      <DialogTitle id="create-post-dialog-title" sx={{ textAlign: "center" }}>
        Publish blog post
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "center" }}>
          Create and publish this blog post, making it public for your readers
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button disabled={createStatus === "loading"} onClick={onCloseDialog}>
          Cancel
        </Button>
        <LoadingButton
          onClick={handleCreatePost}
          loading={createStatus === "loading"}
          variant="contained"
        >
          <span>Publish</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostPreviewDialog;
