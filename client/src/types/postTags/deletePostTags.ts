import type { Mutation } from "@apiTypes";
import type { PostTagDataMapper } from ".";
import type { PostTagsListAction } from "./getPostTags";

export type DeletePostTagsData = PostTagDataMapper<
  Pick<Mutation, "deletePostTags">
>;

export interface DeletePostTagsProps {
  open: boolean;
  name: string;
  ids: string[];
  dispatch: React.Dispatch<PostTagsListAction>;
}
