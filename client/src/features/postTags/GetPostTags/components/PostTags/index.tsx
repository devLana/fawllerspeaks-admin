import * as React from "react";

import Alert from "@mui/material/Alert";

import { PostTagsListContext } from "@features/postTags/context/PostTagsListContext";
import { PostTagsListDispatchContext } from "@features/postTags/context/PostTagsListDispatchContext";
import ErrorBoundary from "@components/ErrorBoundary";
import EditPostTag from "@features/postTags/EditPostTag";
import DeletePostTags from "@features/postTags/DeletePostTags";
import PostTagsWrapper from "../PostTagsWrapper";
import PostTagsList from "./components/PostTagsList";
import { initialState, reducer } from "./utils/postTagsList.reducer";

const PostTags = ({ id: titleId }: { id: string }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const msg =
    "There was an error trying to display the list of post tags. Please try again later";

  const alertProps = { severity: "error", "aria-busy": false } as const;
  const selectedTagsIds = Object.keys(state.selectedTags);

  return (
    <PostTagsListContext.Provider value={state}>
      <PostTagsListDispatchContext.Provider value={dispatch}>
        <PostTagsWrapper id={titleId}>
          <ErrorBoundary fallback={<Alert {...alertProps}>{msg}</Alert>}>
            <PostTagsList tagIdsLength={selectedTagsIds.length} />
          </ErrorBoundary>
        </PostTagsWrapper>
        <EditPostTag />
        {/* Delete a post tag by clicking delete on the post tag's menu */}
        <DeletePostTags
          key="single-delete"
          {...state.deleteTag}
          onClose={() => dispatch({ type: "CLOSE_MENU_DELETE" })}
        />
        {/* Delete multiple post tag(s) by selecting the post tags and clicking the toolbar delete button */}
        <DeletePostTags
          key="multi-delete"
          open={state.deleteTags}
          name={state.selectedTags[selectedTagsIds[0]]}
          ids={selectedTagsIds}
          onClose={() => dispatch({ type: "CLOSE_MULTI_DELETE" })}
        />
      </PostTagsListDispatchContext.Provider>
    </PostTagsListContext.Provider>
  );
};

export default PostTags;
