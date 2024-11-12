import type {
  GetPostsListAction as A,
  GetPostsListState as S,
} from "types/posts/getPosts";

type Reducer = (state: S, action: A) => S;

export const initialState: S = {
  postsView: "grid",
  delete: { open: false, title: "", ids: [] },
  selectedPosts: {},
};

export const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_POST_LIST_VIEW":
      return { ...state, postsView: action.payload.view };

    case "OPEN_DELETE": {
      const { ids, title } = action.payload;
      return { ...state, delete: { open: true, ids, title } };
    }

    case "CLOSE_DELETE":
      return { ...state, delete: { open: false, ids: [], title: "" } };

    case "SELECT_ALL_POSTS": {
      const { posts, shouldSelectAll } = action.payload;
      let selectedPosts: S["selectedPosts"] = { ...state.selectedPosts };

      posts.forEach(({ id, title }) => {
        if (shouldSelectAll) {
          selectedPosts[id] = title;
        } else {
          const { [id]: _, ...selected } = selectedPosts;
          selectedPosts = selected;
        }
      });

      return { ...state, selectedPosts };
    }

    case "SELECT_POST": {
      const { checked, id, title } = action.payload;

      if (checked) {
        return {
          ...state,
          selectedPosts: { ...state.selectedPosts, [id]: title },
        };
      }

      const { [id]: _, ...selectedPosts } = state.selectedPosts;
      return { ...state, selectedPosts };
    }

    case "SHIFT_PLUS_CLICK": {
      const { targetIndex, prevTargetIndex, posts } = action.payload;
      const { id: anchorId, index: anchorIndex } = action.payload.anchorPost;
      let selectedPosts: S["selectedPosts"] = { ...state.selectedPosts };

      if (prevTargetIndex !== null) {
        if (
          targetIndex < anchorIndex &&
          prevTargetIndex < anchorIndex &&
          prevTargetIndex < targetIndex
        ) {
          const start = Math.min(prevTargetIndex, targetIndex - 1);
          const end = Math.max(prevTargetIndex, targetIndex - 1);

          for (let i = start; i <= end; i++) {
            const { [posts[i].id]: _, ...selected } = selectedPosts;
            selectedPosts = selected;
          }
        } else if (
          targetIndex > anchorIndex &&
          prevTargetIndex > anchorIndex &&
          prevTargetIndex > targetIndex
        ) {
          const start = Math.min(prevTargetIndex, targetIndex + 1);
          const end = Math.max(prevTargetIndex, targetIndex + 1);

          for (let i = start; i <= end; i++) {
            const { [posts[i].id]: _, ...selected } = selectedPosts;
            selectedPosts = selected;
          }
        } else if (targetIndex < anchorIndex && prevTargetIndex > anchorIndex) {
          for (let i = anchorIndex; i <= prevTargetIndex; i++) {
            if (i === anchorIndex) {
              selectedPosts[anchorId] = posts[i].title;
            } else {
              const { [posts[i].id]: _, ...selected } = selectedPosts;
              selectedPosts = selected;
            }
          }
        } else if (targetIndex > anchorIndex && prevTargetIndex < anchorIndex) {
          for (let i = prevTargetIndex; i < anchorIndex; i++) {
            if (i === anchorIndex) {
              selectedPosts[anchorId] = posts[i].title;
            } else {
              const { [posts[i].id]: _, ...selected } = selectedPosts;
              selectedPosts = selected;
            }
          }
        }
      }

      const shouldSelect = !!state.selectedPosts[anchorId];
      const start = Math.min(anchorIndex, targetIndex);
      const end = Math.max(anchorIndex, targetIndex);

      for (let i = start; i <= end; i++) {
        const { id, title } = posts[i];

        if (shouldSelect) {
          if (selectedPosts[id]) continue;
          selectedPosts[id] = title;
        } else {
          if (!selectedPosts[id]) continue;

          const { [id]: _, ...selected } = selectedPosts;
          selectedPosts = selected;
        }
      }

      return { ...state, selectedPosts };
    }

    default:
      throw new Error("Unexpected action object dispatched");
  }
};
