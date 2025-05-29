import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import useDeletePostContentImages from "@hooks/deletePostContentImages/useDeletePostContentImages";
import { STORAGE_POST } from "@utils/posts/constants";
import { getStoragePost } from "@utils/posts/storagePost";
import type { CreatePostAction } from "types/posts/createPost";

interface StorageAlertActionsProps {
  dispatch: React.Dispatch<CreatePostAction>;
}

const StorageAlertActions = ({ dispatch }: StorageAlertActionsProps) => {
  const [deleteImages] = useDeletePostContentImages();

  const handleContinue = () => {
    const post = getStoragePost();

    if (post) {
      dispatch({ type: "LOAD_STORAGE_POST", payload: { post } });
    } else {
      dispatch({ type: "HIDE_STORAGE_POST_ALERT" });
    }
  };

  const handleCancel = () => {
    const post = getStoragePost();

    if (post?.content) {
      const domParser = new DOMParser();
      const doc = domParser.parseFromString(post.content, "text/html");
      const imgs = doc.querySelectorAll("img");

      const images = Array.from(imgs).reduce((sources: string[], img) => {
        if (img.src) sources.push(img.src);
        return sources;
      }, []);

      if (images.length > 0) void deleteImages({ variables: { images } });
    }

    localStorage.removeItem(STORAGE_POST);
    dispatch({ type: "HIDE_STORAGE_POST_ALERT" });
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
