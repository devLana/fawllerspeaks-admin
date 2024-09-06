import * as React from "react";

import PostTagsDialog from "../components/PostTagsDialog";
import EditPostTagForm from "./components/EditPostTagForm";
import type {
  PostTagsListAction,
  PostTagsListState,
} from "../GetPostTags/types";

type Status = "idle" | "submitting";

interface EditPostTagProps {
  dispatch: React.Dispatch<PostTagsListAction>;
  edit: PostTagsListState["edit"];
}

const EditPostTag = ({ edit, dispatch }: EditPostTagProps) => {
  const [status, setStatus] = React.useState<Status>("idle");

  const handleClose = () => dispatch({ type: "CLOSE_MENU_EDIT" });

  return (
    <PostTagsDialog
      open={edit.open}
      onClose={status === "submitting" ? undefined : handleClose}
      modalTitle={`Edit post tag - ${edit.name}`}
      fullWidth
      maxWidth="xs"
    >
      <EditPostTagForm
        name={edit.name}
        id={edit.id}
        status={status}
        onStatusChange={(newStatus: Status) => setStatus(newStatus)}
        onClick={handleClose}
        dispatch={dispatch}
      />
    </PostTagsDialog>
  );
};

export default EditPostTag;
