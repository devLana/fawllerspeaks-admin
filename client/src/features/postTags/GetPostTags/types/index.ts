import type { PostTagData } from "@features/postTags/types";

interface EditPostTag {
  open: boolean;
  name: string;
  id: string;
}

interface DeletePostTag {
  open: boolean;
  name: string;
  ids: string[];
}

interface NameIdPayload {
  name: string;
  id: string;
}

export interface PostTagsListState {
  edit: EditPostTag;
  deleteTags: boolean;
  selectedTags: Record<string, string>;
  deleteTag: DeletePostTag;
}

export type PostTagsListAction =
  | { type: "OPEN_MENU_EDIT"; payload: NameIdPayload }
  | { type: "CLOSE_MENU_EDIT" }
  | { type: "POST_TAG_EDITED"; payload: NameIdPayload }
  | { type: "OPEN_MENU_DELETE"; payload: NameIdPayload }
  | { type: "CLOSE_MENU_DELETE" }
  | { type: "OPEN_MULTI_DELETE" }
  | { type: "CLOSE_MULTI_DELETE" }
  | { type: "CLICK_POST_TAG"; payload: { checked: boolean } & NameIdPayload }
  | { type: "CLEAR_SELECTION"; payload?: { deletedTags: string[] } }
  | {
      type: "SELECT_UNSELECT_ALL_CHECKBOX";
      payload: { checked: boolean; tags: PostTagData[] };
    }
  | {
      type: "CTRL_A_SELECT_ALL";
      payload: { tags: PostTagData[]; isNotAllSelected: boolean };
    }
  | {
      type: "SHIFT_PLUS_CLICK";
      payload: { anchorTagId: string; id: string; tags: PostTagData[] };
    };
