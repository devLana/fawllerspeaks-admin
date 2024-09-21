import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import PostWrapper from "./PostWrapper";

const PostLoading = ({ label }: { label: string }) => (
  <PostWrapper ariaBusy={true} label={label}>
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <CircularProgress size="1.9em" aria-label={label} />
    </Box>
  </PostWrapper>
);

export default PostLoading;
