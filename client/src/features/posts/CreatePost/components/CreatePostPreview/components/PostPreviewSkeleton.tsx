import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

const PostPreviewSkeleton = () => {
  return (
    <section
      aria-live="polite"
      aria-busy="false"
      aria-labelledby="post-preview-label"
    >
      <Box mb={1.5} display="flex" alignItems="center" columnGap={3}>
        <Skeleton variant="circular" width={38} height={38} />
        <Typography variant="h2" id="post-preview-label">
          Preview blog post
        </Typography>
      </Box>
      Loading Post Preview...
      <Box
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        rowGap={1.5}
        columnGap={2}
      >
        <Skeleton variant="rounded" height={37} width={126} />
        <Skeleton variant="rounded" height={37} width={145} />
      </Box>
    </section>
  );
};

export default PostPreviewSkeleton;
