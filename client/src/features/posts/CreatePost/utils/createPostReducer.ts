import type { CreatePostAction as A, CreatePostState as S } from "@types";

type Reducer = (state: S, action: A) => S;

export const initialState: S = {
  view: "metadata",
  postData: { title: "", description: "", excerpt: "", content: "" },
};

export const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_VIEW": {
      return { ...state, view: action.payload.view };
    }

    case "SELECT_POST_TAGS": {
      const { tagIds } = action.payload;

      if (tagIds.length === 0) {
        const { tagIds: _, ...rest } = state.postData;
        return { ...state, postData: rest };
      } else {
        return { ...state, postData: { ...state.postData, tagIds } };
      }
    }

    case "UNKNOWN_POST_TAGS": {
      const { tagIds: _, ...rest } = state.postData;
      return { ...state, postData: rest };
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
      return { view: "content", postData: { ...state.postData, ...metadata } };
    }

    case "ADD_POST_CONTENT": {
      const { content } = action.payload;
      return { ...state, postData: { ...state.postData, content } };
    }

    case "CHANGE_METADATA_FIELD": {
      const { key, value } = action.payload;
      return { ...state, postData: { ...state.postData, [key]: value } };
    }

    default:
      throw new Error("Unexpected action object dispatched");
  }
};
