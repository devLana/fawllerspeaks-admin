import type {
  EditPostAction as A,
  PostToEditData,
  EditPostState as S,
} from "types/posts/editPost";

type Reducer = (state: S, action: A) => S;

export const initState = (post: PostToEditData): S => ({
  view: "metadata",
  postData: {
    id: post.id,
    title: post.title,
    description: post.description ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content?.html ?? "",
    imageBanner: { url: post.imageBanner ?? null, file: null },
    tagIds: post.tags?.map(tag => tag.id) ?? [],
    editStatus: false,
  },
});

export const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case "GO_BACK_TO_METADATA": {
      return { ...state, view: "metadata" };
    }

    case "GO_BACK_TO_CONTENT": {
      return { ...state, view: "content" };
    }

    case "PROCEED_TO_POST_CONTENT": {
      const { imageBanner, ...metadata } = action.payload.metadata;

      return {
        ...state,
        view: "content",
        postData: {
          ...state.postData,
          ...metadata,
          imageBanner: { ...state.postData.imageBanner, file: imageBanner },
        },
      };
    }

    case "REMOVE_IMAGE_BANNER_URL": {
      return {
        ...state,
        postData: {
          ...state.postData,
          imageBanner: { ...state.postData.imageBanner, url: null },
        },
      };
    }

    case "ADD_POST_CONTENT": {
      const { content } = action.payload;
      return { ...state, postData: { ...state.postData, content } };
    }

    case "PREVIEW_POST": {
      return { ...state, view: "preview" };
    }

    default:
      throw new Error("Unexpected action object dispatched");
  }
};
