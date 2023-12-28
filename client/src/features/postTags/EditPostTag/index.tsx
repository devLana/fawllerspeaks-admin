import * as React from "react";

import { usePostTagsList } from "../context/PostTagsListContext";
import { usePostTagsListDispatch } from "../context/PostTagsListDispatchContext";
import PostTagsDialog from "../components/PostTagsDialog";
import EditPostTagForm from "./components/EditPostTagForm";

type Status = "idle" | "submitting";

const EditPostTag = () => {
  const [status, setStatus] = React.useState<Status>("idle");

  const { edit } = usePostTagsList();
  const dispatch = usePostTagsListDispatch();

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
      />
    </PostTagsDialog>
  );
};

export default EditPostTag;
