import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ChevronLeft from "@mui/icons-material/ChevronLeft";

interface PostsPageBackButtonProps {
  buttonLabel: string;
  onClick: VoidFunction;
}

const PostsPageBackButton = (props: PostsPageBackButtonProps) => (
  <Tooltip title={props.buttonLabel}>
    <IconButton color="secondary" size="small" onClick={props.onClick}>
      <ChevronLeft fontSize="small" />
    </IconButton>
  </Tooltip>
);

export default PostsPageBackButton;
