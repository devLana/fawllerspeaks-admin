import type {
  CreatePostAction as A,
  CreatePostState as S,
} from "types/posts/createPost";

type Reducer = (state: S, action: A) => S;

export const initialState: S = {
  view: "metadata",
  showStoragePostAlert: false,
  postData: { title: "", description: "", excerpt: "", content: "" },
};

export const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_VIEW": {
      return { ...state, view: action.payload.view };
    }

    case "MANAGE_POST_TAGS": {
      const { tagIds } = action.payload;

      if (tagIds.length === 0) {
        const { tagIds: _, ...rest } = state.postData;
        return { ...state, postData: rest };
      } else {
        return { ...state, postData: { ...state.postData, tagIds } };
      }
    }

    case "ADD_POST_BANNER_IMAGE": {
      const { imageFile } = action.payload;
      const blobUrl = window.URL.createObjectURL(imageFile);

      return {
        ...state,
        postData: {
          ...state.postData,
          imageBanner: { file: imageFile, blobUrl },
        },
      };
    }

    case "REMOVE_POST_BANNER_IMAGE": {
      const { imageBanner: _, ...rest } = state.postData;

      window.URL.revokeObjectURL(state.postData.imageBanner?.blobUrl as string);
      return { ...state, postData: rest };
    }

    case "ADD_REQUIRED_METADATA": {
      const { metadata } = action.payload;

      return {
        ...state,
        view: "content",
        postData: { ...state.postData, ...metadata },
      };
    }

    case "ADD_POST_CONTENT": {
      const { content } = action.payload;
      return { ...state, postData: { ...state.postData, content } };
    }

    case "CHANGE_METADATA_FIELD": {
      const { key, value } = action.payload;
      return { ...state, postData: { ...state.postData, [key]: value } };
    }

    case "SHOW_STORAGE_POST_ALERT":
      return { ...state, showStoragePostAlert: true };

    case "HIDE_STORAGE_POST_ALERT":
      return { ...state, showStoragePostAlert: false };

    case "LOAD_STORAGE_POST":
      return {
        view: "metadata",
        showStoragePostAlert: false,
        postData: { ...state.postData, ...action.payload.post },
      };

    default:
      throw new Error("Unexpected action object dispatched");
  }
};
