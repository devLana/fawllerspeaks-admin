import * as React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import PostTags from "./PostTags";
import PostDate from "@features/posts/components/PostDate";
import type { PostTagData } from "types/postTags";
import type { PostUrl } from "@apiTypes";

interface PostMetadataListProps {
  description: string | null | undefined;
  excerpt: string | null | undefined;
  datePublished: string | null | undefined;
  lastModified: string | null | undefined;
  url: PostUrl;
  views: number;
  tags: PostTagData[] | null | undefined;
}

const PostMetadataList = ({
  datePublished,
  excerpt,
  description,
  lastModified,
  url,
  tags,
  views,
}: PostMetadataListProps) => (
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
    {excerpt && (
      <ListItem disableGutters>
        <ListItemText primary="Excerpt" secondary={excerpt} />
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
      <ListItemText primary="Blog Post Slug" secondary={url.slug} />
    </ListItem>
    <ListItem disableGutters>
      <ListItemText primary="Blog Post URL" secondary={url.href} />
    </ListItem>
    <ListItem disableGutters>
      <ListItemText
        primary="Views"
        secondary={new Intl.NumberFormat("en-US").format(views)}
      />
    </ListItem>
    {tags && tags.length > 0 && <PostTags tags={tags} />}
  </List>
);

export default PostMetadataList;
