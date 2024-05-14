import * as React from "react";

import Alert from "@mui/material/Alert";

import EditPostTag from "@features/postTags/EditPostTag";
import DeletePostTags from "@features/postTags/DeletePostTags";
import PostTagsWrapper from "../PostTagsWrapper";
import PostTagsList from "./components/PostTagsList";
import ErrorBoundary from "@components/ErrorBoundary";
import { initialState, reducer } from "./utils/postTagsList.reducer";

const PostTags = ({ id }: { id: string }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const msg =
    "There was an error trying to display the list of post tags. Please try again later";

  const alertProps = { severity: "error", role: "status" } as const;
  const selectedTagsIds = Object.keys(state.selectedTags);

  return (
    <PostTagsWrapper id={id} ariaBusy={false}>
      <ErrorBoundary fallback={<Alert {...alertProps}>{msg}</Alert>}>
        <PostTagsList
          deleteTag={state.deleteTag}
          deleteTags={state.deleteTags}
          selectedTags={state.selectedTags}
          tagIdsLength={selectedTagsIds.length}
          dispatch={dispatch}
        />
        <EditPostTag edit={state.edit} dispatch={dispatch} />
        {/* Delete one post tag by clicking delete on the post tag's menu */}
        <DeletePostTags
          {...state.deleteTag}
          onClose={() => dispatch({ type: "CLOSE_MENU_DELETE" })}
          dispatch={dispatch}
        />
        {/* Delete multiple post tag(s) by selecting the post tags from the list and clicking the toolbar delete button */}
        <DeletePostTags
          open={state.deleteTags}
          name={state.selectedTags[selectedTagsIds[0]]}
          ids={selectedTagsIds}
          onClose={() => dispatch({ type: "CLOSE_MULTI_DELETE" })}
          dispatch={dispatch}
        />
      </ErrorBoundary>
    </PostTagsWrapper>
  );
};

export default PostTags;
