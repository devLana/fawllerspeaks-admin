import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const PostContentSkeleton = () => (
  <>
    <Skeleton variant="rounded" width={70} height={22} />
    <Skeleton
      variant="text"
      width={350}
      sx={{ fontSize: "1em", lineHeight: 1.6, mb: "0.7em" }}
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
      <Skeleton variant="rounded" height={37} width={110} />
      <Skeleton variant="rounded" height={37} width={64} />
    </Stack>
  </>
);

export default PostContentSkeleton;
