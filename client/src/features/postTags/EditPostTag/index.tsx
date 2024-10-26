import * as React from "react";

import PostTagsDialog from "../components/PostTagsDialog";
import EditPostTagForm from "./components/EditPostTagForm";
import type { Status } from "@types";
import type { EditPostTagProps } from "types/postTags/editPostTag";

const EditPostTag = ({ open, name, id, dispatch }: EditPostTagProps) => {
  const [status, setStatus] = React.useState<Exclude<Status, "error">>("idle");

  const handleClose = () => dispatch({ type: "CLOSE_EDIT" });

  return (
    <PostTagsDialog
      open={open}
      onClose={status === "loading" ? undefined : handleClose}
      modalTitle={`Edit post tag - ${name}`}
      fullWidth
      maxWidth="xs"
    >
      <EditPostTagForm
        id={id}
        name={name}
        status={status}
        onClose={handleClose}
        onStatusChange={newStatus => setStatus(newStatus)}
        onUnknownTag={() => dispatch({ type: "CLOSE_EDIT" })}
        onEdit={payload => dispatch({ type: "POST_TAG_EDITED", payload })}
      />
    </PostTagsDialog>
  );
};

export default EditPostTag;
