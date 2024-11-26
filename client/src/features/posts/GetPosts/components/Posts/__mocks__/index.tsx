import PostsWrapper from "../../PostsWrapper";

const Posts = ({ id }: { id: string }) => (
  <PostsWrapper id={id} ariaBusy={false}>
    Posts List Page
  </PostsWrapper>
);

export default Posts;
