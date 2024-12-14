import type { PostStatus, Query } from "@apiTypes";
import type { PostDataMapper } from ".";

export type ViewPostData = PostDataMapper<Pick<Query, "getPost">>;

export interface PostHeaderProps {
  slug: string;
  status: PostStatus;
  title: string;
}
