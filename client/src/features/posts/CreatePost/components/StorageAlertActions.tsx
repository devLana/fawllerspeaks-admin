import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import useDeletePostContentImages from "@hooks/deletePostContentImages/useDeletePostContentImages";
import { STORAGE_POST, SUPABASE_HOST } from "@utils/posts/constants";
import { getStoragePost } from "@utils/posts/storagePost";
import type { CreatePostAction, StoragePostData } from "types/posts/createPost";

interface StorageAlertActionsProps {
  dispatch: React.Dispatch<CreatePostAction>;
}

const StorageAlertActions = ({ dispatch }: StorageAlertActionsProps) => {
  const [deleteImages] = useDeletePostContentImages();

  const handleContinue = () => {
    const post = getStoragePost() as StoragePostData;
    dispatch({ type: "LOAD_STORAGE_POST", payload: { post } });
  };

  const handleCancel = () => {
    const { content } = getStoragePost() as StoragePostData;

    if (content) {
      const domParser = new DOMParser();
      const doc = domParser.parseFromString(content, "text/html");
      const imgs = doc.querySelectorAll<HTMLImageElement>("img");
      const imgElements = Array.from(imgs);

      const images = imgElements.reduce((sources: string[], img) => {
        if (img.src && img.src.startsWith(SUPABASE_HOST)) {
          sources.push(img.src);
        }

        return sources;
      }, []);

      if (images.length > 0) {
        void deleteImages({ variables: { images } });
      }
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
