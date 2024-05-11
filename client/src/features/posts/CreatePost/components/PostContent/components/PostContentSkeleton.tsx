import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

const PostContentSkeleton = () => (
  <section
    aria-live="polite"
    aria-busy="true"
    aria-labelledby="post-content-label"
  >
    <Box mb={1.5} display="flex" alignItems="center" columnGap={3}>
      <Skeleton variant="circular" width={38} height={38} />
      <Typography variant="h2" id="post-content-label">
        Provide post content
      </Typography>
    </Box>
    <Skeleton variant="rounded" height={45} width="100%" sx={{ mb: 1 }} />
    <Skeleton variant="rounded" height={400} width="100%" sx={{ mb: 2.5 }} />
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

export default PostContentSkeleton;
