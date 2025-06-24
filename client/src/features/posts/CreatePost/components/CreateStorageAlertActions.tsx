import useDeletePostContentImages from "@hooks/createPost/useDeletePostContentImages";
import ToastActionButtons from "@features/posts/components/ToastActionButtons";
import * as storagePost from "@utils/posts/createStoragePost";
import type { CreatePostAction } from "types/posts/createPost";

type Dispatch = React.Dispatch<CreatePostAction>;

const CreateStorageAlertActions = ({ dispatch }: { dispatch: Dispatch }) => {
  const deleteImages = useDeletePostContentImages();

  const handleContinue = () => {
    const post = storagePost.getCreateStoragePost();

    if (post) {
      dispatch({ type: "LOAD_CREATE_STORAGE_POST", payload: { post } });
    } else {
      dispatch({ type: "HIDE_CREATE_STORAGE_POST_ALERT" });
    }
  };

  const handleCancel = () => {
    const post = storagePost.getCreateStoragePost();

    if (post?.content) deleteImages(post.content);

    localStorage.removeItem(storagePost.CREATE_STORAGE_POST);
    dispatch({ type: "HIDE_CREATE_STORAGE_POST_ALERT" });
  };

  return (
    <ToastActionButtons
      proceedLabel="Continue with unfinished post"
      cancelLabel="Delete unfinished post"
      onProceed={handleContinue}
      onCancel={handleCancel}
    />
  );
};

export default CreateStorageAlertActions;
