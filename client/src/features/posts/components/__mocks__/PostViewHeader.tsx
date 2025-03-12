import type { PostViewHeaderProps } from "types/posts";

const PostViewHeader = (props: PostViewHeaderProps) => {
  const { buttonLabel, status, title, children, onClick } = props;

  return (
    <div>
      <button onClick={onClick}>{buttonLabel}</button>
      <p>Post Title - {title}</p>
      <p>Post Status - {status}</p>
      {children}
    </div>
  );
};

export default PostViewHeader;
