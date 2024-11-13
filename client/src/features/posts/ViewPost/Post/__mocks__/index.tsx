import PostWrapper from "../../PostWrapper";

const Post = ({ label }: { label: string }) => (
  <PostWrapper label={label}>
    <span>View Post</span>
  </PostWrapper>
);

export default Post;
