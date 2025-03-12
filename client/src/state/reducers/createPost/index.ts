import type {
  CreatePostAction as A,
  CreatePostStateData as S,
} from "types/posts/createPost";

type Reducer = (state: S, action: A) => S;

export const initialState: S = {
  view: "metadata",
  showStoragePostAlert: false,
  postData: {
    title: "",
    description: "",
    excerpt: "",
    content: "",
    tagIds: [],
    imageBanner: null,
  },
  fileUrl: null,
};

export const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case "GO_BACK_TO_CONTENT": {
      if (state.fileUrl) window.URL.revokeObjectURL(state.fileUrl);
      return { ...state, view: "content", fileUrl: null };
    }

    case "GO_BACK_TO_METADATA": {
      let fileUrl = null;

      if (state.postData.imageBanner) {
        fileUrl = window.URL.createObjectURL(state.postData.imageBanner);
      }

      return { ...state, view: "metadata", fileUrl };
    }

    case "ADD_FILE_URL": {
      if (state.fileUrl) window.URL.revokeObjectURL(state.fileUrl);

      const fileUrl = window.URL.createObjectURL(action.payload.file);
      return { ...state, fileUrl };
    }

    case "REMOVE_FILE_URL": {
      if (state.fileUrl) window.URL.revokeObjectURL(state.fileUrl);
      return { ...state, fileUrl: null };
    }

    case "PROCEED_TO_POST_CONTENT": {
      if (state.fileUrl) window.URL.revokeObjectURL(state.fileUrl);

      return {
        ...state,
        view: "content",
        fileUrl: null,
        postData: { ...state.postData, ...action.payload.metadata },
      };
    }

    case "ADD_POST_CONTENT": {
      const { content } = action.payload;
      return { ...state, postData: { ...state.postData, content } };
    }

    case "PREVIEW_POST": {
      let fileUrl = null;

      if (state.postData.imageBanner) {
        fileUrl = window.URL.createObjectURL(state.postData.imageBanner);
      }

      return { ...state, view: "preview", fileUrl };
    }

    case "SHOW_STORAGE_POST_ALERT": {
      return { ...state, showStoragePostAlert: true };
    }

    case "HIDE_STORAGE_POST_ALERT": {
      return { ...state, showStoragePostAlert: false };
    }

    case "LOAD_STORAGE_POST": {
      return {
        ...state,
        view: "metadata",
        showStoragePostAlert: false,
        postData: { ...state.postData, ...action.payload.post },
      };
    }

    default:
      throw new Error("Unexpected action object dispatched");
  }
};
