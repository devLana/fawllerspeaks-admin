import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import type { PostTagData } from "types/postTags";

interface PostTagsProps {
  tags: PostTagData[];
}

const PostTags = ({ tags }: PostTagsProps) => (
  <ListItem disableGutters>
    <ListItemText
      primary="Post Tags"
      secondaryTypographyProps={{
        component: List,
        disablePadding: true,
        "aria-label": "Post tags",
        sx: {
          pt: 0.5,
          display: "flex",
          flexWrap: "wrap",
          rowGap: 1,
          columnGap: 0.5,
        },
      }}
      secondary={
        <>
          {tags.map(({ id, name }) => (
            <ListItem key={id} disablePadding sx={{ width: "auto" }}>
              <Chip label={name} sx={{ maxWidth: "15em" }} />
            </ListItem>
          ))}
        </>
      }
    />
  </ListItem>
);

export default PostTags;
