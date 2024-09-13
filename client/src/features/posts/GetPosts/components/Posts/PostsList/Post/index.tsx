import ListItem from "@mui/material/ListItem";

import NextLink from "@components/NextLink";
import PostImageBanner from "@features/posts/components/PostImageBanner";
import PostStatus from "./PostStatus";
import PostMenu from "@features/posts/components/PostMenu";
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
      <PostMenu
        title={title}
        status={status}
        slug={url.slug}
        sx={{ position: "absolute", top: "5px", left: "5px" }}
      />
      <PostStatus status={status} />
      {imageBanner && (
        <PostImageBanner
          src={imageBanner}
          title={title}
          sx={{
            height: { height: 150, sm: 160 },
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "action.disabledBackground",
          }}
        />
      )}
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
