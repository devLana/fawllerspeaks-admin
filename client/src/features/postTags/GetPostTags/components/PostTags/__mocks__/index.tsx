import PostTagsWrapper from "../../PostTagsWrapper";

const PostTags = ({ id }: { id: string }) => (
  <PostTagsWrapper id={id} ariaBusy={false}>
    <span>Post Tags List</span>
  </PostTagsWrapper>
);

export default PostTags;
