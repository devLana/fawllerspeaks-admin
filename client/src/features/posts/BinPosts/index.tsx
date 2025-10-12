import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import LoadingButton from "@mui/lab/LoadingButton";

import useBinPosts from "@hooks/binPosts/useBinPosts";

interface BinPostsProps {
  postIds: string[];
  firstPostTitle: string;
  showDialog: boolean;
  onCloseDialog: VoidFunction;
  onUnselect: (ids: string[]) => void;
}

const BinPosts = ({
  postIds,
  firstPostTitle: title,
  showDialog,
  onUnselect,
  onCloseDialog,
}: BinPostsProps) => {
  const postOrPosts = postIds.length > 1 ? "Posts" : "Post";
  const text = postIds.length > 1 ? `${postIds.length} posts` : `"${title}"`;

  const binPosts = useBinPosts(postIds, postOrPosts, onCloseDialog);

  return (
    <>
      <Dialog
        open={showDialog}
        aria-labelledby="bin-posts-dialog-title"
        onClose={binPosts.isBinning ? undefined : onCloseDialog}
      >
        <DialogTitle id="bin-posts-dialog-title" sx={{ textAlign: "center" }}>
          Bin {postOrPosts}
        </DialogTitle>
        <DialogContent
          sx={{
            "&>p": { textAlign: "center" },
            "&>p:not(:last-child)": { mb: 1 },
          }}
        >
          <DialogContentText>
            Are you sure you want to send {text} to bin?
          </DialogContentText>
          <DialogContentText>
            NB: Any Published post you send to the bin will be de-listed on the
            blog website.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button disabled={binPosts.isBinning} onClick={onCloseDialog}>
            Cancel
          </Button>
          <LoadingButton
            color="error"
            loading={binPosts.isBinning}
            onClick={() => binPosts.binPostsFn(onUnselect)}
            variant="contained"
          >
            <span>Send {postOrPosts} to bin</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={binPosts.toast.open}
        message={binPosts.toast.msg}
        onClose={binPosts.handleCloseToast}
      />
    </>
  );
};

export default BinPosts;
