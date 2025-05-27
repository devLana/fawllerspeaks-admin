import React, { useReducer } from "react";

import Snackbar from "@mui/material/Snackbar";

import useEditPost from "@hooks/editPost/useEditPost";
import EditPostWrapper from "../EditPostWrapper";
import EditPostMetadata from "../EditPostMetadata";
import { LazyEditPostContent } from "../EditPostContent/LazyEditPostContent";
import { LazyEditPostPreview } from "../EditPostPreview/LazyEditPostPreview";
import { reducer, initState } from "@reducers/editPost";
import type { EditPostProps } from "types/posts/editPost";

const Post = (props: EditPostProps) => {
  const [state, dispatch] = useReducer(reducer, props.post, initState);
  const edit = useEditPost(state.postData, {
    title: props.post.title,
    status: props.post.status,
    slug: props.post.url.slug,
  });

  const { id: __, content, ...postData } = state.postData;

  return (
    <EditPostWrapper id={props.id}>
      {state.view === "metadata" ? (
        <EditPostMetadata
          postTagsData={props.postTagsData}
          postData={postData}
          status={props.post.status}
          editErrors={edit.errors}
          editStatus={edit.editStatus}
          onCloseEditError={edit.handleCloseError}
          dispatch={dispatch}
        />
      ) : state.view === "content" ? (
        <LazyEditPostContent
          content={content}
          editErrors={edit.errors}
          editStatus={edit.editStatus}
          onCloseEditError={edit.handleCloseError}
          dispatch={dispatch}
        />
      ) : (
        <LazyEditPostPreview
          isOpen={edit.isOpen}
          setIsOpen={edit.setIsOpen}
          post={state.postData}
          postStatus={props.post.status}
          dispatch={dispatch}
          editErrors={edit.errors}
          editApiStatus={edit.editStatus}
          onCloseEditError={edit.handleCloseError}
          handleEditPost={edit.handleEditPost}
        />
      )}
      <Snackbar
        message={edit.msg}
        open={edit.editStatus === "error"}
        onClose={edit.handleCloseError}
      />
    </EditPostWrapper>
  );
};

export default Post;
