import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import NextLink from "@components/ui/NextLink";
import type { PostTableOfContents as TableOfContents } from "@apiTypes";

interface PostTableOfContentsProps {
  tableOfContents: TableOfContents[];
}

const PostTableOfContents = ({ tableOfContents }: PostTableOfContentsProps) => {
  if (tableOfContents.length === 0) return null;

  return (
    <Box
      sx={({ breakpoints: { down } }) => ({
        mt: 3,
        [down("md")]: {
          pt: 3,
          borderTop: "1px solid",
          borderTopColor: "divider",
        },
        position: { md: "sticky" },
        top: { md: "80px" },
      })}
    >
      <Typography gutterBottom id="table-of-contents">
        Table of contents
      </Typography>
      <List aria-labelledby="table-of-contents" disablePadding>
        {tableOfContents.map(({ heading, href, level }) => (
          <ListItem
            disablePadding
            key={`${heading}-${level}`}
            sx={{ ":not(:last-child)": { mb: 1.25 } }}
          >
            <NextLink
              href={href}
              sx={{
                ml: (level - 2) * 1.2,
                fontSize: "0.875rem",
                lineHeight: 1.3,
              }}
            >
              {heading}
            </NextLink>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PostTableOfContents;
