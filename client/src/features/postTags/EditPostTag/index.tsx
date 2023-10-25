import * as React from "react";

import PostTagsDialog from "../components/PostTagsDialog";
import EditPostTagForm from "./components/EditPostTagForm";

type Status = "idle" | "submitting";

interface EditPostTagProps {
  open: boolean;
  name: string;
  id: string;
  onCloseEdit: () => void;
}

const EditPostTag = ({ open, name, id, onCloseEdit }: EditPostTagProps) => {
  const [status, setStatus] = React.useState<Status>("idle");

  return (
    <PostTagsDialog
      open={open}
      onClose={status === "submitting" ? undefined : onCloseEdit}
      title="Edit post tag"
      contentText={`Edit post tag "${name}"`}
      fullWidth
      maxWidth="xs"
    >
      <EditPostTagForm
        name={name}
        id={id}
        status={status}
        onCloseEdit={onCloseEdit}
        onStatusChange={(newStatus: Status) => setStatus(newStatus)}
      />
    </PostTagsDialog>
  );
};

export default EditPostTag;
