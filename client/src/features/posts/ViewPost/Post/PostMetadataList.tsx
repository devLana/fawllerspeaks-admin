import * as React from "react";

import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import PostDate from "@features/posts/components/PostDate";
import type { PostTagData } from "types/postTags";

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
        px: { md: 2 },
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
      )}
    </List>
  );
};

export default PostMetadataList;
