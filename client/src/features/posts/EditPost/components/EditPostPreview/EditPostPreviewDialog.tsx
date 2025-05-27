import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

import type { PostStatus } from "@apiTypes";
import type { PostActionStatus } from "types/posts";

interface EditPostPreviewDialogProps {
  isOpen: boolean;
  previewStatus: PostStatus;
  status: PostStatus;
  editStatus: boolean | undefined;
  editApiStatus: PostActionStatus;
  onCloseDialog: () => void;
  handleEditPost: (previewStatus: PostStatus) => Promise<void>;
}

const EditPostPreviewDialog = ({
  isOpen,
  status,
  previewStatus,
  editStatus,
  editApiStatus,
  onCloseDialog,
  handleEditPost,
}: EditPostPreviewDialogProps) => (
  <Dialog open={isOpen} aria-labelledby="edit-post-dialog-title">
    <DialogTitle id="edit-post-dialog-title" sx={{ textAlign: "center" }}>
      Edit blog post
    </DialogTitle>
    <DialogContent
      sx={{
        "&>p": { textAlign: "center" },
        "&>p:not(:last-of-type)": { mb: 1 },
      }}
    >
      {editStatus && (
        <>
          <DialogContentText>
            You are about to edit this post which will also change the post
            status from &#39;{status}&#39; to &#39;{previewStatus}&#39;.
          </DialogContentText>
          <DialogContentText>
            {previewStatus === "Unpublished"
              ? "Un-publishing a blog post will de-list it and make it unavailable to your readers."
              : "Publishing this blog post will make it public and available to your readers."}
          </DialogContentText>
        </>
      )}
      <DialogContentText>
        Are you sure you want to{" "}
        {editStatus ? "proceed" : "edit this blog post"}?
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
      <Button disabled={editApiStatus === "loading"} onClick={onCloseDialog}>
        Cancel
      </Button>
      <LoadingButton
        loading={editApiStatus === "loading"}
        variant="contained"
        onClick={() => void handleEditPost(previewStatus)}
      >
        <span>{editStatus ? previewStatus.replace(/ed$/, "") : "Edit"}</span>
      </LoadingButton>
    </DialogActions>
  </Dialog>
);

export default EditPostPreviewDialog;
