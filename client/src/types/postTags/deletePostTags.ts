import type { Mutation } from "@apiTypes";
import type { PostTagDataMapper as Mapper } from ".";
import type { PostTagsListAction } from "./getPostTags";

export type DeletePostTagsData = Mapper<Pick<Mutation, "deletePostTags">>;

export interface DeletePostTagsProps {
  open: boolean;
  name: string;
  ids: string[];
  dispatch: React.Dispatch<PostTagsListAction>;
}
