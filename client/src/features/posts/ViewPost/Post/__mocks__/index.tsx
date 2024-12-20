import PostWrapper from "@features/posts/components/GetPost/PostWrapper";

const Post = ({ label }: { label: string }) => (
  <PostWrapper label={label}>
    <span>View Post</span>
  </PostWrapper>
);

export default Post;
