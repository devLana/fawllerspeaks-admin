import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { STORAGE_POST } from "@utils/posts/storagePost";
import type { CreatePostAction, StoragePostData } from "types/posts/createPost";

interface StorageAlertActionsProps {
  dispatch: React.Dispatch<CreatePostAction>;
  storagePost: StoragePostData;
}

const StorageAlertActions = (props: StorageAlertActionsProps) => {
  const { dispatch, storagePost } = props;

  const handleCancel = () => {
    localStorage.removeItem(STORAGE_POST);
    dispatch({ type: "UNSET_STORAGE_POST" });
  };

  const handleContinue = () => {
    dispatch({ type: "LOAD_STORAGE_POST", payload: { post: storagePost } });
  };

  return (
    <>
      <IconButton
        aria-label="Continue with unfinished post"
        size="small"
        color="inherit"
        onClick={handleContinue}
      >
        <CheckIcon />
      </IconButton>
      <IconButton
        aria-label="Delete unfinished post"
        size="small"
        color="inherit"
        onClick={handleCancel}
      >
        <CloseIcon />
      </IconButton>
    </>
  );
};

export default StorageAlertActions;
