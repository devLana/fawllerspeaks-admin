import * as React from "react";

import Alert from "@mui/material/Alert";

import EditPostTag from "@features/postTags/EditPostTag";
import DeletePostTags from "@features/postTags/DeletePostTags";
import PostTagsWrapper from "../PostTagsWrapper";
import PostTagsList from "./PostTagsList";
import ErrorBoundary from "@components/ErrorBoundary";
import { initialState, reducer } from "@reducers/postTagsList";

const PostTags = ({ id }: { id: string }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const msg =
    "There was an error trying to display the list of post tags. Please try again later";

  const alertProps = { severity: "error", role: "status" } as const;

  return (
    <PostTagsWrapper id={id} ariaBusy={false}>
      <ErrorBoundary fallback={<Alert {...alertProps}>{msg}</Alert>}>
        <PostTagsList
          id={id}
          isNotDeleting={!state.delete.open}
          selectedTags={state.selectedTags}
          dispatch={dispatch}
        />
        <EditPostTag {...state.edit} dispatch={dispatch} />
        <DeletePostTags {...state.delete} dispatch={dispatch} />
      </ErrorBoundary>
    </PostTagsWrapper>
  );
};

export default PostTags;
