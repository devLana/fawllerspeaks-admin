import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import LoadingButton from "@mui/lab/LoadingButton";

interface BinPostsProps {
  showDialog: boolean;
  toast: { open: boolean; msg: string };
  title: string;
  isPublished: boolean;
  isBinning: boolean;
  showTitleInDialog: boolean;
  onBinPosts: VoidFunction;
  onCloseDialog: VoidFunction;
  onCloseToast: VoidFunction;
}

const BinPost = ({
  showDialog,
  toast,
  title,
  isPublished,
  isBinning,
  showTitleInDialog,
  onBinPosts,
  onCloseDialog,
  onCloseToast,
}: BinPostsProps) => (
  <>
    <Dialog
      open={showDialog}
      aria-labelledby="bin-post-dialog-title"
      onClose={isBinning ? undefined : onCloseDialog}
    >
      <DialogTitle id="bin-post-dialog-title">Bin post</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to send this post to bin?
        </DialogContentText>
        {showTitleInDialog && (
          <DialogContentText component="strong">{title}</DialogContentText>
        )}
        {isPublished && (
          <DialogContentText>
            Sending a Published post to bin will de-list it on the blog website.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button disabled={isBinning} onClick={onCloseDialog}>
          Cancel
        </Button>
        <LoadingButton
          color="error"
          loading={isBinning}
          onClick={() => onBinPosts()}
          variant="contained"
        >
          <span>Send post to bin</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
    <Snackbar open={toast.open} message={toast.msg} onClose={onCloseToast} />
  </>
);

export default BinPost;
