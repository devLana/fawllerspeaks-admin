import ListItem from "@mui/material/ListItem";

import NextLink from "@components/ui/NextLink";
import PostImageBanner from "@features/posts/components/PostImageBanner";
import PostMenu from "@features/posts/components/PostMenu";
import PostStatus from "./PostStatus";
import PostInfo from "./PostInfo";
import type { PostStatus as Status } from "@apiTypes";
import type { PostItemSlug, PostsView } from "types/posts/getPosts";

interface PostProps {
  postsView: PostsView;
  title: string;
  imageBanner?: string | null;
  status: Status;
  dateCreated: string;
  url: PostItemSlug;
}

const Post = ({
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
          alt={`${title} image banner`}
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
        sx={{
          mt: "auto",
          mx: "auto",
          py: 0.4,
          width: "90%",
          maxWidth: 400,
          borderRadius: 1,
          textAlign: "center",
          color: "background.default",
          bgcolor: "secondary.main",
          ":hover": { color: "background.default" },
        }}
      >
        View Post
      </NextLink>
    </ListItem>
  );
};

export default Post;
