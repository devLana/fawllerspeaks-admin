import Alert, { type AlertColor } from "@mui/material/Alert";
import PostsWrapper from "./PostsWrapper";

interface PostsTextContentProps {
  id: string;
  node: React.ReactElement | string;
  severity?: AlertColor;
}

const PostsTextContent = (props: PostsTextContentProps) => (
  <PostsWrapper id={props.id} ariaBusy={false}>
    <Alert severity={props.severity ?? "info"} role="status">
      {props.node}
    </Alert>
  </PostsWrapper>
);

export default PostsTextContent;
