import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import PostTagsWrapper from "./PostTagsWrapper";

const PostTagsLoading = ({ id }: { id: string }) => (
  <PostTagsWrapper id={id}>
    <Stack aria-busy={true} alignItems="center" justifyContent="center">
      <CircularProgress size="1.9em" aria-describedby={id} />
    </Stack>
  </PostTagsWrapper>
);

export default PostTagsLoading;
