import * as React from "react";
import dynamic from "next/dynamic";

import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

import { useDraftPost } from "@features/posts/CreatePost/hooks/useDraftPost";
import RootLayout from "@layouts/RootLayout";
import PostContentSkeleton from "@features/posts/CreatePost/components/PostContent/components/PostContentSkeleton";
import PostMetadata from "@features/posts/CreatePost/components/PostMetadata";
import PostFileInput from "@features/posts/CreatePost/components/PostMetadata/components/PostFileInput";
import SelectPostTags from "@features/posts/CreatePost/components/PostMetadata/components/SelectPostTags";
import * as post from "@features/posts/CreatePost/utils/createPostReducer";
import uiLayout from "@utils/uiLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { NextPageWithLayout, Status } from "@types";

const PostContent = dynamic(
  () => {
    return import(
      /* webpackChunkName: "PostContent" */ "@features/posts/CreatePost/components/PostContent"
    );
  },
  { loading: () => <PostContentSkeleton />, ssr: false }
);

const CreatePostPage: NextPageWithLayout = () => {
  const [state, dispatch] = React.useReducer(post.reducer, post.initialState);

  const { handleDraftPost, setDraftStatus, draftStatus, msg } = useDraftPost(
    state.postData,
    dispatch
  );

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Create A New Blog Post
      </Typography>
      {state.view === "metadata" ? (
        <PostMetadata
          title={state.postData.title}
          description={state.postData.description}
          excerpt={state.postData.excerpt}
          draftStatus={draftStatus}
          dispatch={dispatch}
          handleDraftPost={handleDraftPost}
          selectPostTags={
            <SelectPostTags tags={state.postData.tags} dispatch={dispatch} />
          }
          fileInput={
            <PostFileInput
              dispatch={dispatch}
              imageBanner={state.postData.imageBanner}
            />
          }
        />
      ) : state.view === "content" ? (
        <PostContent
          content={state.postData.content}
          draftStatus={draftStatus}
          handleDraftPost={handleDraftPost}
          dispatch={dispatch}
        />
      ) : /* TODO: <PostPreview /> */ null}
      <Snackbar
        message={msg}
        open={draftStatus === "error"}
        onClose={handleCloseAlert<Status>("idle", setDraftStatus)}
      />
    </>
  );
};

CreatePostPage.layout = uiLayout(RootLayout, { title: "Create New Blog Post" });

export default CreatePostPage;
