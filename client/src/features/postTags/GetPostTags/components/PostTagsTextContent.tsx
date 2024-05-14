import Alert, { type AlertColor } from "@mui/material/Alert";
import PostTagsWrapper from "./PostTagsWrapper";

interface PostTagsTextContentProps {
  id: string;
  text: string;
  severity?: AlertColor;
}

const PostTagsTextContent = (props: PostTagsTextContentProps) => {
  const { id, text, severity = "info" } = props;

  return (
    <PostTagsWrapper id={id} ariaBusy={false}>
      <Alert severity={severity} role="status">
        {text}
      </Alert>
    </PostTagsWrapper>
  );
};

export default PostTagsTextContent;
