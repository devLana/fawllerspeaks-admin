import CircularProgress from "@mui/material/CircularProgress";
import PostWrapper from "./PostWrapper";

const PostLoading = ({ label }: { label: string }) => (
  <PostWrapper ariaBusy={true} label={label}>
    <CircularProgress size="1.9em" aria-label={label} />
  </PostWrapper>
);

export default PostLoading;
