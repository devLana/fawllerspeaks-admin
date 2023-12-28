import type { PostTagsList } from "@features/postTags/context/PostTagsListContext";
import type { PostTagData } from "@types";

interface NameIdPayload {
  name: string;
  id: string;
}

export type Action =
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

export const initialState: PostTagsList = {
  edit: { open: false, name: "", id: "" },
  deleteTag: { open: false, name: "", ids: [] },
  deleteTags: false,
  selectedTags: {},
};

export const reducer = (state: PostTagsList, action: Action): PostTagsList => {
  switch (action.type) {
    case "OPEN_MENU_EDIT": {
      const { name, id } = action.payload;
      return { ...state, edit: { open: true, name, id } };
    }

    case "CLOSE_MENU_EDIT": {
      return { ...state, edit: { open: false, name: "", id: "" } };
    }

    case "POST_TAG_EDITED": {
      const { name, id } = action.payload;
      const { selectedTags } = state;

      if (selectedTags[id]) {
        selectedTags[id] = name;
      }

      return {
        ...state,
        selectedTags,
        edit: { open: false, name: "", id: "" },
      };
    }

    case "OPEN_MENU_DELETE": {
      const { name, id } = action.payload;
      return { ...state, deleteTag: { open: true, name, ids: [id] } };
    }

    case "CLOSE_MENU_DELETE": {
      return { ...state, deleteTag: { open: false, name: "", ids: [] } };
    }

    case "OPEN_MULTI_DELETE": {
      return { ...state, deleteTags: true };
    }

    case "CLOSE_MULTI_DELETE": {
      return { ...state, deleteTags: false };
    }

    case "CLICK_POST_TAG": {
      const { checked, name, id } = action.payload;

      if (checked) {
        return {
          ...state,
          selectedTags: { ...state.selectedTags, [id]: name },
        };
      }

      const { [id]: _, ...selectedTags } = state.selectedTags;
      return { ...state, selectedTags };
    }

    case "CLEAR_SELECTION": {
      if (!action.payload) return { ...state, selectedTags: {} };

      let { selectedTags } = state;

      action.payload.deletedTags.forEach(deletedTag => {
        const { [deletedTag]: _, ...rest } = selectedTags;
        selectedTags = rest;
      });

      return { ...state, selectedTags };
    }

    case "SELECT_UNSELECT_ALL_CHECKBOX": {
      const { checked, tags } = action.payload;
      const selectedTags: PostTagsList["selectedTags"] = {};

      if (checked) {
        tags.forEach(tag => {
          selectedTags[tag.id] = tag.name;
        });
      }

      return { ...state, selectedTags };
    }

    case "CTRL_A_SELECT_ALL": {
      const { tags, isNotAllSelected } = action.payload;
      const selectedTags: PostTagsList["selectedTags"] = {};

      if (isNotAllSelected) {
        tags.forEach(tag => {
          selectedTags[tag.id] = tag.name;
        });
      }

      return { ...state, selectedTags };
    }

    case "SHIFT_PLUS_CLICK": {
      const { anchorTagId, id, tags } = action.payload;
      const indexes: number[] = [];

      for (let i = 0; i < tags.length; i++) {
        const { id: tagId } = tags[i];

        if (tagId === anchorTagId || tagId === id) {
          indexes.push(i);

          if (indexes.length === 2) {
            indexes.sort((a, b) => a - b);
            break;
          }
        }
      }

      const [start, end] = indexes;
      const { selectedTags } = state;

      if (selectedTags[anchorTagId]) {
        for (let i = start; i <= end; i++) {
          selectedTags[tags[i].id] = tags[i].name;
        }
      } else {
        for (let i = start; i <= end; i++) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete selectedTags[tags[i].id];
        }
      }

      return { ...state, selectedTags };
    }

    default:
      throw new Error("Unexpected action object dispatched");
  }
};
