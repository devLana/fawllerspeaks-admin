import Alert, { type AlertColor } from "@mui/material/Alert";
import PostWrapper from "./PostWrapper";

interface PostTextContentProps {
  label: string;
  node: React.ReactElement | string;
  severity?: AlertColor;
}

const PostTextContent = (props: PostTextContentProps) => {
  const { label, node, severity = "info" } = props;

  return (
    <PostWrapper label={label}>
      <Alert severity={severity} role="status">
        {node}
      </Alert>
    </PostWrapper>
  );
};

export default PostTextContent;
