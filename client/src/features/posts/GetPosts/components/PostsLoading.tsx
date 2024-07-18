import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import PostsWrapper from "./PostsWrapper";

const PostsLoading = ({ id }: { id: string }) => (
  <PostsWrapper id={id} ariaBusy={true}>
    <Box display="flex" alignItems="center" justifyContent="center">
      <CircularProgress size="1.9em" aria-describedby={id} />
    </Box>
  </PostsWrapper>
);

export default PostsLoading;
