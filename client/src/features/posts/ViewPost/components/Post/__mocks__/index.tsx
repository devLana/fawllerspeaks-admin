import ViewPostWrapper from "../../ViewPostWrapper";

const Post = ({ label }: { label: string }) => (
  <ViewPostWrapper label={label}>
    <span>View Post</span>
  </ViewPostWrapper>
);

export default Post;
