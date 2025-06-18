import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const EditPostContentSkeleton = () => (
  <section aria-live="polite" aria-busy="true" aria-label="Edit post content">
    <Box sx={{ mb: 3 }}>
      <Skeleton variant="circular" width={38} height={38} />
    </Box>
    <Skeleton variant="rounded" height={45} width="100%" sx={{ mb: 1 }} />
    <Skeleton variant="rounded" height={400} width="100%" sx={{ mb: 2.5 }} />
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Skeleton variant="rounded" height={37} width={145} />
    </Box>
  </section>
);

export default EditPostContentSkeleton;
