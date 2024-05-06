import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const PostContentSkeleton = () => (
  <section>
    <Skeleton
      variant="text"
      width="100%"
      sx={{ maxWidth: 350, fontSize: "1em", lineHeight: 3, mb: 1.5 }}
    />
    <Skeleton variant="rounded" height={45} width="100%" sx={{ mb: 1 }} />
    <Skeleton variant="rounded" height={400} width="100%" sx={{ mb: 4 }} />
    <Stack
      direction="row"
      justifyContent="center"
      flexWrap="wrap"
      rowGap={1}
      columnGap={2}
    >
      <Skeleton variant="rounded" height={37} width={126} />
      <Skeleton variant="rounded" height={37} width={65} />
    </Stack>
  </section>
);

export default PostContentSkeleton;
