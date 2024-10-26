import type { Mutation } from "@apiTypes";
import type { PostTagsListAction } from "./getPostTags";
import type { PostTagDataMapper } from ".";

export interface EditPostTagProps {
  id: string;
  name: string;
  open: boolean;
  dispatch: React.Dispatch<PostTagsListAction>;
}

export type EditPostTagData = PostTagDataMapper<Pick<Mutation, "editPostTag">>;
