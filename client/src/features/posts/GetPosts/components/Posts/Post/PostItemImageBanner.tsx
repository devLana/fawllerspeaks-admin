import Skeleton from "@mui/material/Skeleton";
import PostImageBanner from "@features/posts/components/PostImageBanner";

interface PostItemImageBannerProps {
  isLoadingMore: boolean;
  src: string;
  alt: string;
}

const PostItemImageBanner = (props: PostItemImageBannerProps) => {
  return props.isLoadingMore ? (
    <Skeleton variant="rectangular" sx={{ height: { height: 150, sm: 160 } }} />
  ) : (
    <PostImageBanner
      src={props.src}
      alt={props.alt}
      sizes="(max-width: 900px) 520px, 385px"
      sx={{
        height: { height: 150, sm: 160 },
        bgcolor: "action.disabledBackground",
      }}
    />
  );
};

export default PostItemImageBanner;
