import EditPostWrapper from "../../EditPostWrapper";

const Post = ({ id }: { id: string }) => {
  return (
    <EditPostWrapper id={id}>
      <section>Edit Post Page Component</section>
    </EditPostWrapper>
  );
};

export default Post;
