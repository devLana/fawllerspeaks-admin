import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import NextLink from "@components/NextLink";
import type { PostTableOfContents as TableOfContents } from "@apiTypes";

interface PostTableOfContentsProps {
  tableOfContents: TableOfContents[];
}

const margin = (level: number) => {
  if (level === 3) return 3 / 2;
  if (level === 4) return 4 / 2 + 0.8;
  if (level === 5) return 5 / 2 + 1.6;
  return 0;
};

const PostTableOfContents = ({ tableOfContents }: PostTableOfContentsProps) => {
  if (tableOfContents.length === 0) return null;

  return (
    <Box sx={{ mt: 3, position: { md: "sticky" }, top: { md: "70px" } }}>
      <Typography gutterBottom>Table of contents</Typography>
      <List aria-label="Post table of contents" disablePadding>
        {tableOfContents.map(({ heading, href, level }) => (
          <ListItem disablePadding key={`${heading}-${level}`} sx={{ py: 0.1 }}>
            <NextLink href={href} sx={{ ml: margin(level) }}>
              {heading}
            </NextLink>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PostTableOfContents;
