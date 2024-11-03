import Skeleton from "@mui/material/Skeleton";

import PostMenu from "@features/posts/components/PostMenu";
import type { PostStatus } from "@apiTypes";

interface PostItemMenuProps {
  isLoadingMore: boolean;
  title: string;
  slug: string;
  status: PostStatus;
}

const PostItemMenu = (props: PostItemMenuProps) => {
  const { isLoadingMore, slug, status, title } = props;

  return isLoadingMore ? (
    <Skeleton
      variant="circular"
      sx={{ position: "absolute", top: "5px", left: "5px" }}
    >
      <PostMenu title={title} status={status} slug={slug} />
    </Skeleton>
  ) : (
    <PostMenu
      title={title}
      status={status}
      slug={slug}
      sx={{ position: "absolute", top: "5px", left: "5px" }}
    />
  );
};

export default PostItemMenu;
