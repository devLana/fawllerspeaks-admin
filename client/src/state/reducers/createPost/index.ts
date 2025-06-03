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
};

export const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case "GO_BACK_TO_CONTENT": {
      return { ...state, view: "content" };
    }

    case "GO_BACK_TO_METADATA": {
      return { ...state, view: "metadata" };
    }

    case "PROCEED_TO_POST_CONTENT": {
      return {
        ...state,
        view: "content",
        postData: { ...state.postData, ...action.payload.metadata },
        showStoragePostAlert: false,
      };
    }

    case "ADD_POST_CONTENT": {
      const { content } = action.payload;
      return { ...state, postData: { ...state.postData, content } };
    }

    case "PREVIEW_POST": {
      return { ...state, view: "preview" };
    }

    case "SHOW_CREATE_STORAGE_POST_ALERT": {
      return { ...state, showStoragePostAlert: true };
    }

    case "HIDE_CREATE_STORAGE_POST_ALERT": {
      return { ...state, showStoragePostAlert: false };
    }

    case "LOAD_CREATE_STORAGE_POST": {
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
