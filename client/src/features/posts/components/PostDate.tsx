import { formatPostDate } from "../utils/formatPostDate";

const PostDate = ({ dateString }: { dateString: string }) => (
  <time dateTime={dateString}>{formatPostDate(dateString)}</time>
);

export default PostDate;
