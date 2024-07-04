import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "@mui/material/Snackbar";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import type { CreateInputErrors } from "@types";

const CreatePostErrorsAlert = ({
  titleError,
  descriptionError,
  excerptError,
  contentError,
  tagIdsError,
  imageBannerError,
}: CreateInputErrors) => {
  const isOpen = !!(
    titleError ||
    descriptionError ||
    excerptError ||
    contentError ||
    tagIdsError ||
    imageBannerError
  );

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={null}
      // anchorOrigin={{ horizontal, vertical }}
    >
      <Alert
        severity="error"
        icon={<CancelOutlinedIcon />}
        sx={{ width: "100%" }}
      >
        <AlertTitle sx={{ fontSize: "1.2rem" }}>Errors</AlertTitle>
        <List disablePadding aria-label="Draft post errors">
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
};

export default CreatePostErrorsAlert;
