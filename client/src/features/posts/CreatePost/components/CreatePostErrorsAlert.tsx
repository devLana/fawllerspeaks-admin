import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import type { DraftErrors } from "@types";

const CreatePostErrorsAlert = ({
  titleError,
  descriptionError,
  excerptError,
  contentError,
  tagIdsError,
  imageBannerError,
}: DraftErrors) => {
  const isOpen = !!(
    titleError ||
    descriptionError ||
    excerptError ||
    contentError ||
    tagIdsError ||
    imageBannerError
  );

  return (
    <Collapse in={isOpen} sx={{ mb: isOpen ? 2.5 : undefined }}>
      <Alert severity="error">
        <AlertTitle>Errors</AlertTitle>
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
    </Collapse>
  );
};

export default CreatePostErrorsAlert;
