import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import PostDate from "@features/posts/components/PostDate";

interface PostInfoProps {
  isLoadingMore: boolean;
  title: string;
  dateCreated: string;
}

const PostInfo = ({ title, dateCreated, isLoadingMore }: PostInfoProps) => (
  <Box sx={{ px: 2 }}>
    <Typography
      variant="h2"
      gutterBottom
      sx={{ textAlign: "center", fontSize: "1.25em" }}
    >
      {isLoadingMore ? <Skeleton /> : title}
    </Typography>
    <Typography variant="body2" sx={{ textAlign: "center" }}>
      {isLoadingMore ? (
        <Skeleton />
      ) : (
        <>
          Created on <PostDate dateString={dateCreated} />
        </>
      )}
    </Typography>
  </Box>
);

export default PostInfo;
