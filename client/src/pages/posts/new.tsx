import * as React from "react";
import dynamic from "next/dynamic";

import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

import { useDraftPost } from "@features/posts/CreatePost/hooks/useDraftPost";
import RootLayout from "@layouts/RootLayout";
import CreatePostMetadata from "@features/posts/CreatePost/components/CreatePostMetadata";
import PostFileInput from "@features/posts/CreatePost/components/CreatePostMetadata/components/PostFileInput";
import SelectPostTagsInput from "@features/posts/CreatePost/components/CreatePostMetadata/components/SelectPostTags/SelectPostTagsInput";
import CreatePostContentSkeleton from "@features/posts/CreatePost/components/CreatePostContent/components/CreatePostContentSkeleton";
import PostPreviewSkeleton from "@features/posts/CreatePost/components/CreatePostPreview/components/PostPreviewSkeleton";
import * as post from "@features/posts/CreatePost/utils/createPostReducer";
import uiLayout from "@utils/uiLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { NextPageWithLayout, Status } from "@types";

const CreatePostContent = dynamic(
  () => {
    return import(
      /* webpackChunkName: "CreatePostContent" */ "@features/posts/CreatePost/components/CreatePostContent"
    );
  },
  { loading: () => <CreatePostContentSkeleton />, ssr: false }
);

const CreatePostPreview = dynamic(
  () => {
    return import(
      /* webpackChunkName: "CreatePostPreview" */ "@features/posts/CreatePost/components/CreatePostPreview"
    );
  },
  { loading: () => <PostPreviewSkeleton />, ssr: false }
);

const CreatePostPage: NextPageWithLayout = () => {
  const [state, dispatch] = React.useReducer(post.reducer, post.initialState);

  const draft = useDraftPost(state.postData, dispatch);

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Create A New Blog Post
      </Typography>
      {state.view === "metadata" ? (
        <CreatePostMetadata
          title={state.postData.title}
          description={state.postData.description}
          excerpt={state.postData.excerpt}
          draftStatus={draft.draftStatus}
          contentError={draft.errors.contentError}
          handleDraftPost={draft.handleDraftPost}
          dispatch={dispatch}
          selectPostTagsInput={
            <SelectPostTagsInput
              tagIds={state.postData.tagIds}
              tagIdsError={draft.errors.tagIdsError}
              dispatch={dispatch}
            />
          }
          fileInput={
            <PostFileInput
              imageBanner={state.postData.imageBanner}
              imageBannerError={draft.errors.imageBannerError}
              dispatch={dispatch}
            />
          }
        />
      ) : state.view === "content" ? (
        <CreatePostContent
          content={state.postData.content}
          draftStatus={draft.draftStatus}
          draftErrors={draft.errors}
          handleDraftPost={draft.handleDraftPost}
          dispatch={dispatch}
        />
      ) : (
        <CreatePostPreview
          post={state.postData}
          draftStatus={draft.draftStatus}
          draftErrors={draft.errors}
          handleDraftPost={draft.handleDraftPost}
          dispatch={dispatch}
        />
      )}
      <Snackbar
        message={draft.msg}
        open={draft.draftStatus === "error"}
        onClose={handleCloseAlert<Status>("idle", draft.setDraftStatus)}
      />
    </>
  );
};

CreatePostPage.layout = uiLayout(RootLayout, { title: "Create New Blog Post" });

export default CreatePostPage;
