import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface PostActionsToastButtonsProps {
  onUnpublish: VoidFunction;
  onCancel: VoidFunction;
}

const PostActionsToastButtons = (props: PostActionsToastButtonsProps) => (
  <>
    <IconButton
      aria-label="Yes unpublish post"
      size="small"
      color="inherit"
      onClick={props.onUnpublish}
    >
      <CheckIcon />
    </IconButton>
    <IconButton
      aria-label="Cancel"
      size="small"
      color="inherit"
      onClick={props.onCancel}
    >
      <CloseIcon />
    </IconButton>
  </>
);

export default PostActionsToastButtons;
