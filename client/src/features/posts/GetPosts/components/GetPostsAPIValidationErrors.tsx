import AlertTitle from "@mui/material/AlertTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface GetPostsApiValidationErrorsProps {
  afterError?: string | null;
  sizeError?: string | null;
}

const GetPostsApiValidationErrors = ({
  afterError,
  sizeError,
}: GetPostsApiValidationErrorsProps) => (
  <>
    <AlertTitle>Invalid search filters provided</AlertTitle>
    <List disablePadding sx={{ ml: 2.5 }}>
      {afterError && (
        <ListItem disableGutters disablePadding>
          <ListItemText primary={`cursor: ${afterError}`} />
        </ListItem>
      )}
      {sizeError && (
        <ListItem disableGutters disablePadding>
          <ListItemText primary={`size: ${sizeError}`} />
        </ListItem>
      )}
    </List>
  </>
);

export default GetPostsApiValidationErrors;
