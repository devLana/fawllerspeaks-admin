import { useRouter } from "next/router";

import useDeletePostContentImages from "@hooks/useDeletePostContentImages";
import ToastActionButtons from "@features/posts/components/ToastActionButtons";
import * as storagePost from "@utils/posts/editStoragePost";
import type { EditPostAction } from "types/posts/editPost";

interface EditStorageAlertActionsProps {
  postId: string;
  dispatch: React.Dispatch<EditPostAction>;
}

const EditStorageAlertActions = (props: EditStorageAlertActionsProps) => {
  const { push } = useRouter();
  const deleteImages = useDeletePostContentImages();

  const handleContinue = () => {
    const post = storagePost.getEditStoragePost();

    if (!post) {
      props.dispatch({ type: "HIDE_EDIT_STORAGE_POST_ALERT" });
      return;
    }

    const { id, slug, content, imgUrls } = post;

    if (id !== props.postId) {
      if (slug) {
        void push(`/posts/edit/${slug}`);
      } else {
        if (imgUrls) deleteImages(imgUrls);

        const query = { message: "edit-load-error" };
        void push({ pathname: "/posts", query });
        localStorage.removeItem(storagePost.EDIT_STORAGE_POST);
      }

      return;
    }

    if (content) {
      props.dispatch({ type: "LOAD_EDIT_STORAGE_POST", payload: { content } });
      return;
    }

    if (imgUrls) deleteImages(imgUrls);

    localStorage.removeItem(storagePost.EDIT_STORAGE_POST);
    props.dispatch({ type: "HIDE_EDIT_STORAGE_POST_ALERT" });
  };

  const handleCancel = () => {
    const post = storagePost.getEditStoragePost();

    if (post?.imgUrls) deleteImages(post.imgUrls);

    localStorage.removeItem(storagePost.EDIT_STORAGE_POST);
    props.dispatch({ type: "HIDE_EDIT_STORAGE_POST_ALERT" });
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

export default EditStorageAlertActions;
