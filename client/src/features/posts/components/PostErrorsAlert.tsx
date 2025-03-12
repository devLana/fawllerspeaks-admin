import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import type { PostInputData } from "types/posts";

type PostFieldErrors = {
  [Prop in keyof PostInputData as `${Prop}Error`]?: string;
};

interface PostErrorsAlertProps extends PostFieldErrors {
  shouldShowErrors: boolean;
  children?: React.ReactNode;
  onClick: (() => void) | undefined;
}

const PostErrorsAlert = ({
  titleError,
  descriptionError,
  excerptError,
  contentError,
  tagIdsError,
  imageBannerError,
  shouldShowErrors,
  children,
  onClick,
}: PostErrorsAlertProps) => (
  <Snackbar open={shouldShowErrors} autoHideDuration={null}>
    <Alert
      severity="error"
      sx={{ width: "100%", "&>.MuiAlert-icon,&>.MuiAlert-action": { mt: 1 } }}
      action={
        <Tooltip title="Hide input validation errors list alert">
          <IconButton size="small" color="inherit" onClick={onClick}>
            <CancelOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      }
    >
      <List disablePadding aria-label="Input validation errors">
        {titleError && (
          <ListItem disableGutters disablePadding>
            <ListItemText primary="Post Title" secondary={titleError} />
          </ListItem>
        )}
        {descriptionError && (
          <ListItem disableGutters disablePadding>
            <ListItemText
              primary="Post Description"
              secondary={descriptionError}
            />
          </ListItem>
        )}
        {excerptError && (
          <ListItem disableGutters disablePadding>
            <ListItemText primary="Post Excerpt" secondary={excerptError} />
          </ListItem>
        )}
        {contentError && (
          <ListItem disableGutters disablePadding>
            <ListItemText primary="Post Content" secondary={contentError} />
          </ListItem>
        )}
        {tagIdsError && (
          <ListItem disableGutters disablePadding>
            <ListItemText primary="Post Tags" secondary={tagIdsError} />
          </ListItem>
        )}
        {imageBannerError && (
          <ListItem disableGutters disablePadding>
            <ListItemText
              primary="Post Image Banner"
              secondary={imageBannerError}
            />
          </ListItem>
        )}
        {children}
      </List>
    </Alert>
  </Snackbar>
);

export default PostErrorsAlert;
