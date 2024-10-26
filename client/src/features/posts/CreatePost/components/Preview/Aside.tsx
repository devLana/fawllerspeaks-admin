import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import PreviewPostTags from "./PreviewPostTags";

interface AsideProps {
  description: string;
  excerpt: string;
  tagIds: string[] | undefined;
}

const Aside = ({ description, excerpt, tagIds }: AsideProps) => (
  <Box
    component="aside"
    sx={({ breakpoints: { down } }) => ({
      [down("md")]: {
        pb: 5,
        mb: 5,
        borderBottom: "1px solid",
        borderBottomColor: "divider",
      },
      p: { md: 2 },
      border: { md: "1px solid" },
      borderColor: { md: "divider" },
      borderRadius: { md: 1 },
      gridArea: { md: "1 / 1 / 3 / 2" },
      alignSelf: { md: "start" },
    })}
  >
    <List disablePadding aria-label="post information">
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
    <PreviewPostTags tagIds={tagIds ?? []} />
  </Box>
);

export default Aside;
