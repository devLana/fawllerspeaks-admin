import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface PostInfoProps {
  description: string;
  excerpt: string;
}

const PostInfoPreview = ({ description, excerpt }: PostInfoProps) => (
  <List disablePadding>
    <ListItem disablePadding sx={{ mb: 4 }}>
      <ListItemText
        primary="Post Description"
        secondary={description}
        sx={{ m: 0, "&>span": { mb: 0.5 } }}
      />
    </ListItem>
    <ListItem disablePadding>
      <ListItemText
        primary="Post Excerpt"
        secondary={excerpt}
        sx={{ m: 0, "&>span": { mb: 0.5 } }}
      />
    </ListItem>
  </List>
);

export default PostInfoPreview;
