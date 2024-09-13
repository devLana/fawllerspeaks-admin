import * as React from "react";

import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import PostDate from "@features/posts/components/PostDate";
import type { PostTagData } from "@features/postTags/types";

interface PostMetadataListProps {
  description: string | null | undefined;
  datePublished: string | null | undefined;
  lastModified: string | null | undefined;
  url: string;
  views: number;
  tags: PostTagData[] | null | undefined;
}

const PostMetadataList = (props: PostMetadataListProps) => {
  const { datePublished, description, lastModified, url, tags, views } = props;

  return (
    <List
      disablePadding
      aria-label="Post metadata"
      sx={{
        pt: 1,
        pb: 2,
        paddingBottom: { md: 1 },
        px: { md: 2 },
        borderBottom: "1px solid",
        borderBottomColor: "divider",
        borderRadius: { md: 1 },
        border: { md: "1px solid" },
        borderColor: { md: "divider" },
      }}
    >
      {description && (
        <ListItem disableGutters>
          <ListItemText primary="Description" secondary={description} />
        </ListItem>
      )}
      {datePublished && (
        <ListItem disableGutters>
          <ListItemText
            primary="Date Published"
            secondary={<PostDate dateString={datePublished} />}
          />
        </ListItem>
      )}
      {lastModified && (
        <ListItem disableGutters>
          <ListItemText
            primary="Last Modified"
            secondary={<PostDate dateString={lastModified} />}
          />
        </ListItem>
      )}
      <ListItem disableGutters>
        <ListItemText primary="Blog Post URL" secondary={url} />
      </ListItem>
      <ListItem disableGutters>
        <ListItemText
          primary="Views"
          secondary={new Intl.NumberFormat("en-US").format(views)}
        />
      </ListItem>
      {tags && (
        <ListItem disableGutters>
          <ListItemText
            primary="Post Tags"
            secondaryTypographyProps={{
              component: "div",
              sx: {
                display: "flex",
                flexWrap: "wrap",
                rowGap: 1.25,
                columnGap: 1,
              },
            }}
            secondary={
              <>
                {tags.map(({ id, name }) => (
                  <Chip key={id} label={name} sx={{ maxWidth: "15.5em" }} />
                ))}
              </>
            }
          />
        </ListItem>
      )}
    </List>
  );
};

export default PostMetadataList;
