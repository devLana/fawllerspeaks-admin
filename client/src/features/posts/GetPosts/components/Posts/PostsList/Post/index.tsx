import ListItem from "@mui/material/ListItem";

import PostItemMenu from "./PostItemMenu";
import PostStatus from "./PostStatus";
import PostItemImageBanner from "./PostItemImageBanner";
import PostInfo from "./PostInfo";
import PostItemLink from "./PostItemLink";
import type { PostStatus as Status } from "@apiTypes";
import type { PostItemSlug, PostsView } from "types/posts/getPosts";

interface PostProps {
  isLoadingMore: boolean;
  postsView: PostsView;
  title: string;
  imageBanner?: string | null;
  status: Status;
  dateCreated: string;
  url: PostItemSlug;
}

const Post = ({
  isLoadingMore,
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
      <PostItemMenu
        isLoadingMore={isLoadingMore}
        title={title}
        status={status}
        slug={url.slug}
      />
      <PostStatus status={status} isLoadingMore={isLoadingMore} />
      {imageBanner && (
        <PostItemImageBanner
          isLoadingMore={isLoadingMore}
          src={imageBanner}
          alt={`${title} image banner`}
        />
      )}
      <PostInfo
        isLoadingMore={isLoadingMore}
        title={title}
        dateCreated={dateCreated}
      />
      <PostItemLink isLoadingMore={isLoadingMore} slug={url.slug} />
    </ListItem>
  );
};

export default Post;
