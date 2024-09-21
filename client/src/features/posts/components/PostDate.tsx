import { formatPostDate } from "@utils/posts/formatPostDate";

const PostDate = ({ dateString }: { dateString: string }) => (
  <time dateTime={dateString}>{formatPostDate(dateString)}</time>
);

export default PostDate;
