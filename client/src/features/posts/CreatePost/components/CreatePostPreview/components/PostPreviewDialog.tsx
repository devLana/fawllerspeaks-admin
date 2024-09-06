import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

import type { CreateStatus } from "@features/posts/CreatePost/types";

interface PostPreviewDialogProps {
  isOpen: boolean;
  createStatus: CreateStatus;
  onCloseDialog: () => void;
  handleCreatePost: () => Promise<void>;
}

const PostPreviewDialog = (props: PostPreviewDialogProps) => {
  const { isOpen, createStatus, onCloseDialog, handleCreatePost } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={createStatus === "loading" ? undefined : onCloseDialog}
      aria-labelledby="create-post-dialog-title"
    >
      <DialogTitle id="create-post-dialog-title" sx={{ textAlign: "center" }}>
        Create blog post
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "center" }}>
          Creating a post will also publish it making it ready for your readers
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
          <span>Create Post</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default PostPreviewDialog;
