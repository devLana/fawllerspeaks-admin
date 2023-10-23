import * as React from "react";

import PostTagsDialog from "../components/PostTagsDialog";
import EditPostTagForm from "./components/EditPostTagForm";

type Status = "idle" | "submitting";

interface EditPostTagProps {
  open: boolean;
  name: string;
  id: string;
  onCloseDialog: () => void;
  onOpenAlert: (message: string) => void;
}

const EditPostTag = (props: EditPostTagProps) => {
  const { open, name, id, onCloseDialog, onOpenAlert } = props;
  const [status, setStatus] = React.useState<Status>("idle");

  return (
    <PostTagsDialog
      open={open}
      onClose={status === "submitting" ? undefined : onCloseDialog}
      title="Edit post tag"
      contentText={`Edit post tag "${name}"`}
      fullWidth
      maxWidth="xs"
    >
      <EditPostTagForm
        name={name}
        id={id}
        status={status}
        onCloseDialog={onCloseDialog}
        onOpenAlert={onOpenAlert}
        onStatusChange={(nextStatus: Status) => setStatus(nextStatus)}
      />
    </PostTagsDialog>
  );
};

export default EditPostTag;
