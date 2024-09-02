import ListItem from "@mui/material/ListItem";

import NextLink from "@components/NextLink";
import PostImageBanner from "./PostImageBanner";
import PostStatus from "./PostStatus";
import PostMenu from "./PostMenu";
import PostInfo from "./PostInfo";
import type { PostStatus as Status } from "@apiTypes";
import type { PostItemSlug, PostsView } from "@features/posts/GetPosts/types";

interface PostProps {
  postCover: React.ReactElement;
  postsView: PostsView;
  title: string;
  imageBanner?: string | null;
  status: Status;
  dateCreated: string;
  url: PostItemSlug;
}

const Post = ({
  postCover,
  postsView,
  title,
  imageBanner,
  status,
  dateCreated,
  url,
}: PostProps) => {
  const idName = title.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

  return (
    <ListItem
      disablePadding
      sx={{
        flexDirection: "column",
        alignItems: "stretch",
        rowGap: 3,
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
      {postCover}
      <PostMenu idName={idName} name={title} status={status} />
      <PostStatus status={status} postsView={postsView} />
      {imageBanner && <PostImageBanner imageLink={imageBanner} title={title} />}
      <PostInfo title={title} dateCreated={dateCreated} />
      <NextLink
        href={`view/${url.slug}`}
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
