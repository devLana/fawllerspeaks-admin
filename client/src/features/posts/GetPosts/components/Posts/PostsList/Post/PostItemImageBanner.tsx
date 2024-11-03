import Skeleton from "@mui/material/Skeleton";
import PostImageBanner from "@features/posts/components/PostImageBanner";

interface PostItemImageBannerProps {
  isLoadingMore: boolean;
  src: string;
  alt: string;
}

const PostItemImageBanner = (props: PostItemImageBannerProps) => {
  const { isLoadingMore, src, alt } = props;

  return isLoadingMore ? (
    <Skeleton
      variant="rectangular"
      sx={{
        height: { height: 150, sm: 160 },
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    />
  ) : (
    <PostImageBanner
      src={src}
      alt={alt}
      sizes="(max-width: 900px) 520px, 385px"
      sx={{
        height: { height: 150, sm: 160 },
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "action.disabledBackground",
      }}
    />
  );
};

export default PostItemImageBanner;
