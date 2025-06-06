import * as React from "react";

import Snackbar from "@mui/material/Snackbar";
import EditStorageAlertActions from "./EditStorageAlertActions";
import type { EditPostAction } from "types/posts/editPost";
import { getEditStoragePost } from "@utils/posts/editStoragePost";

interface EditPostToastProps {
  open: boolean;
  postId: string;
  hasRenderedBeforeRef: boolean;
  dispatch: React.Dispatch<EditPostAction>;
}

const EditPostToast = (props: EditPostToastProps) => {
  const { postId, open, hasRenderedBeforeRef, dispatch } = props;
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!hasRenderedBeforeRef) {
      const post = getEditStoragePost();

      if (post?.id === postId) {
        setMessage(
          "It seems you have tried editing this post before. Would you like to continue from where you stopped?"
        );
      } else {
        setMessage(
          "It seems you have an unfinished post that you tried editing previously. Would you like to finish editing that post instead?"
        );
      }
    }
  }, [postId, hasRenderedBeforeRef]);

  return (
    <Snackbar
      open={open}
      message={message}
      action={<EditStorageAlertActions dispatch={dispatch} postId={postId} />}
      ContentProps={{
        sx: { "&>.MuiSnackbarContent-action": { columnGap: 0.5 } },
      }}
      sx={{ maxWidth: 600 }}
    />
  );
};

export default EditPostToast;
