import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CircleIcon from "@mui/icons-material/Circle";

const MetadataList = () => (
  <List dense>
    <ListItem>
      <ListItemIcon>
        <CircleIcon sx={{ fontSize: 8 }} />
      </ListItemIcon>
      <ListItemText primary="Post Title" />
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <CircleIcon sx={{ fontSize: 8 }} />
      </ListItemIcon>
      <ListItemText secondary="A short overview of the post to be used by search engines">
        Post Description
      </ListItemText>
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <CircleIcon sx={{ fontSize: 8 }} />
      </ListItemIcon>
      <ListItemText secondary="An optional collection of topics that best describes what the post will be about. Select as much as needed">
        Post Tags
      </ListItemText>
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <CircleIcon sx={{ fontSize: 8 }} />
      </ListItemIcon>
      <ListItemText secondary="An optional image banner that gives meaning to the post">
        Post Image
      </ListItemText>
    </ListItem>
  </List>
);

export default MetadataList;
