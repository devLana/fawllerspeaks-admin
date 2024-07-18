import Alert, { type AlertColor } from "@mui/material/Alert";
import PostsWrapper from "./PostsWrapper";

interface PostsTextContentProps {
  id: string;
  text: React.ReactElement | string;
  severity?: AlertColor;
}

const PostsTextContent = (props: PostsTextContentProps) => {
  const { id, text, severity = "info" } = props;

  return (
    <PostsWrapper id={id} ariaBusy={false}>
      <Alert severity={severity} role="status">
        {text}
      </Alert>
    </PostsWrapper>
  );
};

export default PostsTextContent;
