import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import PostErrorsAlert from "@features/posts/components/PostErrorsAlert";
import type { EditPostFieldErrors } from "types/posts/editPost";

interface EditPostErrorsAlertProps extends EditPostFieldErrors {
  shouldOpen: boolean;
  onClick: (() => void) | undefined;
}

const EditPostErrorsAlert = ({
  shouldOpen,
  idError,
  editStatusError,
  onClick,
  ...errors
}: EditPostErrorsAlertProps) => (
  <PostErrorsAlert onClick={onClick} shouldShowErrors={shouldOpen} {...errors}>
    {idError && (
      <ListItem disableGutters disablePadding>
        <ListItemText primary="Post Id" secondary={idError} />
      </ListItem>
    )}
    {editStatusError && (
      <ListItem disableGutters disablePadding>
        <ListItemText primary="Edit Post Status" secondary={editStatusError} />
      </ListItem>
    )}
  </PostErrorsAlert>
);

export default EditPostErrorsAlert;
