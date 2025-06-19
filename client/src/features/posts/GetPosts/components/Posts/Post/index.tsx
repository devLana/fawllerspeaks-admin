import ListItem from "@mui/material/ListItem";

import PostStatus from "./PostStatus";
import PostItemImageBanner from "./PostItemImageBanner";
import PostInfo from "./PostInfo";
import PostItemLink from "./PostItemLink";
import type { PostStatus as Status } from "@apiTypes";
import type { PostItemSlug, PostsView } from "types/posts/getPosts";

interface PostProps {
  isLoadingMore: boolean;
  isSelected: boolean;
  postsView: PostsView;
  title: string;
  imageBanner?: string | null;
  status: Status;
  dateCreated: string;
  url: PostItemSlug;
  postActions: React.ReactElement;
}

const Post = ({
  isLoadingMore,
  isSelected,
  postsView,
  title,
  imageBanner,
  status,
  dateCreated,
  url,
  postActions,
}: PostProps) => (
  <ListItem
    disablePadding
    sx={{
      pt: 8,
      pb: 4,
      flexDirection: "column",
      alignItems: "stretch",
      rowGap: 3,
      ...(postsView === "grid"
        ? {
            border: "1px solid",
            borderColor: isSelected && !isLoadingMore ? "inherit" : "divider",
            borderRadius: 1,
            boxShadow: ({ shadows }) => shadows[1],
          }
        : {
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
            "&:not(:last-child)": { borderBottomColor: "transparent" },
          }),
      ...(!isLoadingMore && {
        bgcolor: isSelected ? "action.selected" : undefined,
        "&:hover": { bgcolor: isSelected ? "action.selected" : "action.hover" },
      }),
    }}
  >
    {postActions}
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

export default Post;
