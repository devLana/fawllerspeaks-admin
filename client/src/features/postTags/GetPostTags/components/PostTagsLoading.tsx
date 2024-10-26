import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import PostTagsWrapper from "./PostTagsWrapper";

const PostTagsLoading = ({ id }: { id: string }) => (
  <PostTagsWrapper id={id} ariaBusy={true}>
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <CircularProgress
        size="1.9em"
        aria-describedby={id}
        aria-label="Loading post tags"
      />
    </Box>
  </PostTagsWrapper>
);

export default PostTagsLoading;
