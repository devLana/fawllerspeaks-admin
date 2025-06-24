import * as React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import { type IconButtonProps } from "@mui/material/IconButton";

import useUnpublishPost from "@hooks/unpublishPost/useUnpublishPost";
import useBinPost from "@hooks/binPost/useBinPost";
import PostMenu from "./PostMenu";
import PostActionsToastButtons from "./PostActionsToastButtons";
import type { PostStatus } from "@apiTypes";

interface PostActionsProps {
  id: string;
  title: string;
  status: PostStatus;
  slug: string;
  showTitleInDialog?: boolean;
  toastMessage: string | React.ReactElement;
  menuSx?: IconButtonProps["sx"];
}

const PostActions = (props: PostActionsProps) => {
  const { id, toastMessage, showTitleInDialog = false, ...menuProps } = props;
  const [showToast, setShowToast] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);

  const unpublishFn = useUnpublishPost();
  const binPostFn = useBinPost();

  const handleUnpublish = () => {
    unpublishFn(id);
    setShowToast(false);
  };

  const handleBinPost = () => {
    binPostFn(id);
    setShowToast(false);
  };

  return (
    <>
      <PostMenu
        onUnpublish={() => setShowToast(true)}
        onBinPost={() => setShowDialog(true)}
        {...menuProps}
      />
      <Snackbar
        open={showToast}
        message={toastMessage}
        action={
          <PostActionsToastButtons
            onCancel={() => setShowToast(false)}
            onUnpublish={handleUnpublish}
          />
        }
        ContentProps={{
          sx: { "&>.MuiSnackbarContent-action": { columnGap: 0.5 } },
        }}
        sx={{
          maxWidth: 600,
          // "&>.MuiSnackbarContent-root": {
          //   columnGap: 2,
          //   justifyContent: "center",
          //   "&>.MuiSnackbarContent-action": { m: 0, p: 0 },
          // },
        }}
      />
      <Dialog
        open={showDialog}
        aria-labelledby="bin-post-dialog-title"
        onClose={() => setShowDialog(false)}
      >
        <DialogTitle id="bin-post-dialog-title">Bin post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to send this post to bin?
          </DialogContentText>
          {showTitleInDialog && (
            <DialogContentText component="strong">
              {menuProps.title}
            </DialogContentText>
          )}
          {menuProps.status === "Published" && (
            <DialogContentText>
              Sending a Published post to bin will Unpublish it and de-list it
              on the blog website.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <LoadingButton onClick={handleBinPost} variant="contained">
            <span>Send post to bin</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostActions;
