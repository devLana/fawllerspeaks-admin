import * as React from "react";

import PostTagsDialog from "../components/PostTagsDialog";
import EditPostTagForm from "./components/EditPostTagForm";

type Status = "idle" | "submitting";

interface EditPostTagProps {
  open: boolean;
  name: string;
  id: string;
  onEdit: (tagName: string, tagId: string) => void;
  onCloseEdit: () => void;
}

const EditPostTag = (props: EditPostTagProps) => {
  const { open, name, id, onEdit, onCloseEdit } = props;
  const [status, setStatus] = React.useState<Status>("idle");

  return (
    <PostTagsDialog
      open={open}
      onClose={status === "submitting" ? undefined : onCloseEdit}
      modalTitle={`Edit post tag - ${name}`}
      fullWidth
      maxWidth="xs"
    >
      <EditPostTagForm
        name={name}
        id={id}
        status={status}
        onEdit={onEdit}
        onCloseEdit={onCloseEdit}
        onStatusChange={(newStatus: Status) => setStatus(newStatus)}
      />
    </PostTagsDialog>
  );
};

export default EditPostTag;
