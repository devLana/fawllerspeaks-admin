import Alert, { type AlertColor } from "@mui/material/Alert";
import PostTagsWrapper from "./PostTagsWrapper";

interface PostTagsTextContentProps {
  id: string;
  text: string;
  severity: AlertColor;
}

const PostTagsTextContent = (props: PostTagsTextContentProps) => {
  const { id, text, severity } = props;

  return (
    <PostTagsWrapper id={id}>
      <Alert severity={severity}>{text}</Alert>
    </PostTagsWrapper>
  );
};

export default PostTagsTextContent;
