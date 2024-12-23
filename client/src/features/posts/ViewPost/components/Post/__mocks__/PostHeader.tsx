import type { PostHeaderProps } from "types/posts/viewPost";

const PostHeader = ({ slug, status, title }: PostHeaderProps) => (
  <div>
    <p>Post Title - {title}</p>
    <p>Post Status - {status}</p>
    <p>Post Slug - {slug}</p>
  </div>
);

export default PostHeader;
