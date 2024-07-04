import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import type { CreateInputErrors } from "@types";

interface CreatePostErrorsAlertProps extends CreateInputErrors {
  ariaLabel: string;
  shouldOpen: boolean;
  onClick: () => void;
}

const CreatePostErrorsAlert = ({
  titleError,
  descriptionError,
  excerptError,
  contentError,
  tagIdsError,
  imageBannerError,
  ariaLabel,
  shouldOpen,
  onClick,
}: CreatePostErrorsAlertProps) => (
  <Snackbar open={shouldOpen} autoHideDuration={null}>
    <Alert
      severity="error"
      sx={{ width: "100%", "&>.MuiAlert-icon,&>.MuiAlert-action": { mt: 1 } }}
      action={
        <Tooltip title={`Close ${ariaLabel} list`}>
          <IconButton size="small" color="inherit" onClick={onClick}>
            <CancelOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      }
    >
      <List disablePadding aria-label={ariaLabel}>
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
      </List>
    </Alert>
  </Snackbar>
);

export default CreatePostErrorsAlert;
