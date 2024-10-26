import type {
  PostTagsListAction as A,
  PostTagsListState as S,
} from "types/postTags/getPostTags";

type Reducer = (state: S, action: A) => S;

export const initialState: S = {
  edit: { open: false, name: "", id: "" },
  delete: { open: false, name: "", ids: [] },
  selectedTags: {},
};

export const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case "OPEN_EDIT": {
      const { name, id } = action.payload;
      return { ...state, edit: { open: true, name, id } };
    }

    case "CLOSE_EDIT":
      return { ...state, edit: { open: false, name: "", id: "" } };

    case "POST_TAG_EDITED": {
      const { name, id } = action.payload;
      const { selectedTags } = state;

      if (selectedTags[id]) {
        selectedTags[id] = name;
      }

      return {
        ...state,
        edit: { open: false, name: "", id: "" },
        selectedTags,
      };
    }

    case "OPEN_DELETE": {
      const { ids, name } = action.payload;
      return { ...state, delete: { open: true, ids, name } };
    }

    case "CLOSE_DELETE":
      return { ...state, delete: { open: false, ids: [], name: "" } };

    case "REMOVE_POST_TAG_ON_DELETE": {
      let { selectedTags } = state;

      action.payload.tagIds.forEach(tagId => {
        const { [tagId]: _, ...rest } = selectedTags;
        selectedTags = rest;
      });

      return {
        ...state,
        delete: { open: false, ids: [], name: "" },
        selectedTags,
      };
    }

    case "SELECT_POST_TAG": {
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

    case "SELECT_ALL_POST_TAGS": {
      const { shouldSelectAll, tags } = action.payload;
      const selectedTags: S["selectedTags"] = {};

      if (shouldSelectAll) {
        tags.forEach(tag => {
          selectedTags[tag.id] = tag.name;
        });
      }

      return { ...state, selectedTags };
    }

    case "SHIFT_PLUS_CLICK": {
      const { anchorTagId, anchorTagIndex, targetIndex, tags } = action.payload;
      const start = Math.min(anchorTagIndex, targetIndex);
      const end = Math.max(anchorTagIndex, targetIndex);
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
