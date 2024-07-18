import Box from "@mui/material/Box";

import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import NextLink from "@components/NextLink";
import PostImageBanner from "./PostImageBanner";
import PostStatus from "./PostStatus";
import PostMenu from "./PostMenu";
import { formatPostDate } from "../utils/formatPostDate";
import type { PostStatus as Status } from "@apiTypes";
import type { PostsView } from "@types";

interface PostProps {
  title: string;
  imageBanner: string | null;
  status: Status;
  dateCreated: string;
  postsView: PostsView;
  slug: string;
}

const Post = (props: PostProps) => {
  const { title, imageBanner, status, dateCreated, postsView, slug } = props;
  const idName = title.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

  return (
    <ListItem
      disablePadding
      sx={{
        flexDirection: "column",
        alignItems: "stretch",
        rowGap: 2.5,
        position: "relative",
        border: "1px solid",
        borderColor: "divider",
        pb: 3,
        ...(postsView === "grid"
          ? {
              pt: 7.5,
              borderRadius: 1,
              boxShadow: ({ shadows }) => shadows[2],
            }
          : { pt: 8, "&:not(:last-child)": { borderBottom: "none" } }),
      }}
    >
      <PostMenu idName={idName} name={title} status={status} />
      <PostStatus status={status} postsView={postsView} />
      {imageBanner && <PostImageBanner imageLink={imageBanner} />}
      <Box sx={{ px: 2 }}>
        <Typography variant="h2" gutterBottom textAlign="center">
          {title}
        </Typography>
        <Typography variant="body2" textAlign="center">
          Created on{" "}
          <time dateTime={dateCreated}>{formatPostDate(dateCreated)}</time>
        </Typography>
      </Box>
      <NextLink
        href={`view/${slug}`}
        mt="auto"
        mx="auto"
        width="90%"
        maxWidth={400}
        py={0.4}
        borderRadius={1}
        textAlign="center"
        color="background.default"
        bgcolor="secondary.main"
        sx={{ ":hover": { color: "background.default" } }}
      >
        View Post
      </NextLink>
    </ListItem>
  );
};

export default Post;
