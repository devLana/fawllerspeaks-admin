import * as React from "react";

import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

import { useDraftPost } from "@hooks/createPost/useDraftPost";
import RootLayout from "@layouts/RootLayout";
import CreatePostMetadata from "@features/posts/CreatePost/components/Metadata";
import PostFileInput from "@features/posts/CreatePost/components/Metadata/PostFileInput";
import SelectPostTagsInput from "@features/posts/CreatePost/components/Metadata/SelectPostTags/SelectPostTagsInput";
import { LazyContent } from "@features/posts/CreatePost/components/Content/LazyContent";
import { LazyPreview } from "@features/posts/CreatePost/components/Preview/LazyPreview";
import * as post from "@features/posts/CreatePost/state/createPostReducer";
import uiLayout from "@utils/layouts/uiLayout";
import type { NextPageWithLayout } from "@types";

const CreatePostPage: NextPageWithLayout = () => {
  const [state, dispatch] = React.useReducer(post.reducer, post.initialState);

  React.useEffect(() => {
    return () => {
      if (state.postData.imageBanner?.blobUrl) {
        window.URL.revokeObjectURL(state.postData.imageBanner.blobUrl);
      }
    };
  }, [state.postData.imageBanner?.blobUrl]);

  const draft = useDraftPost(state.postData);

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Create a new blog post
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
        <LazyContent
          content={state.postData.content}
          draftStatus={draft.draftStatus}
          draftErrors={draft.errors}
          handleDraftPost={draft.handleDraftPost}
          handleCloseDraftError={draft.handleCloseError}
          dispatch={dispatch}
        />
      ) : (
        <LazyPreview
          post={state.postData}
          draftStatus={draft.draftStatus}
          draftErrors={draft.errors}
          handleDraftPost={draft.handleDraftPost}
          handleCloseDraftError={draft.handleCloseError}
          dispatch={dispatch}
        />
      )}
      <Snackbar
        message={draft.msg}
        open={draft.draftStatus === "error"}
        onClose={draft.handleCloseError}
      />
    </>
  );
};

CreatePostPage.layout = uiLayout(RootLayout, { title: "Create New Blog Post" });

export default CreatePostPage;
