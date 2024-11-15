import type { Query } from "@apiTypes";
import type { PostTagData, PostTagDataMapper } from ".";

export interface PostTagsListState {
  edit: { open: boolean; name: string; id: string };
  delete: { open: boolean; name: string; ids: string[] };
  selectedTags: Record<string, string>;
}

export type PostTagsListAction =
  | { type: "OPEN_EDIT"; payload: { name: string; id: string } }
  | { type: "CLOSE_EDIT" }
  | { type: "POST_TAG_EDITED"; payload: { name: string; id: string } }
  | { type: "OPEN_DELETE"; payload: { name: string; ids: string[] } }
  | { type: "CLOSE_DELETE" }
  | { type: "REMOVE_POST_TAG_ON_DELETE"; payload: { tagIds: string[] } }
  | {
      type: "SELECT_POST_TAG";
      payload: { checked: boolean; name: string; id: string };
    }
  | {
      type: "SELECT_ALL_POST_TAGS";
      payload: { shouldSelectAll: boolean; tags: PostTagData[] };
    }
  | {
      type: "SHIFT_PLUS_CLICK";
      payload: {
        anchorTag: { id: string; index: number };
        targetIndex: number;
        tags: PostTagData[];
      };
    };

export type GetPostTagsData = PostTagDataMapper<Pick<Query, "getPostTags">>;
