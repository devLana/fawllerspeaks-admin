import * as React from "react";

import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

import { useDraftPost } from "@hooks/createPost/useDraftPost";
import { useCreatePost } from "@hooks/createPost/useCreatePost";
import useCreatePostDTO from "@hooks/createPost/useCreatePostDTO";
import useCreatePostEffects from "@hooks/createPost/useCreatePostEffects";
import RootLayout from "@layouts/RootLayout";
import CreatePostMetadata from "@features/posts/CreatePost/components/CreatePostMetadata";
import { LazyCreatePostContent } from "@features/posts/CreatePost/components/CreatePostContent/LazyCreatePostContent";
import { LazyCreatePostPreview } from "@features/posts/CreatePost/components/CreatePostPreview/LazyCreatePostPreview";
import StorageAlertActions from "@features/posts/CreatePost/components/StorageAlertActions";
import * as post from "@reducers/createPost";
import uiLayout from "@utils/layouts/uiLayout";
import type { NextPageWithLayout } from "@types";

const CreatePostPage: NextPageWithLayout = () => {
  const [state, dispatch] = React.useReducer(post.reducer, post.initialState);

  const draft = useDraftPost(state.postData);
  const create = useCreatePost(state.postData);
  const data = useCreatePostDTO(draft, create);
  useCreatePostEffects(dispatch);

  const { content, ...postData } = state.postData;

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Create a new blog post
      </Typography>
      {state.view === "metadata" ? (
        <CreatePostMetadata
          postData={postData}
          draftStatus={draft.status}
          onDraft={draft.handleDraftPost}
          dispatch={dispatch}
          errors={data.errors}
          shouldShowErrors={data.shouldShowErrors}
          handleHideErrors={data.handleHideErrors}
        />
      ) : state.view === "content" ? (
        <LazyCreatePostContent
          content={content}
          draftStatus={draft.status}
          handleDraftPost={draft.handleDraftPost}
          dispatch={dispatch}
          errors={data.errors}
          shouldShowErrors={data.shouldShowErrors}
          handleHideErrors={draft.handleHideErrors}
        />
      ) : (
        <LazyCreatePostPreview
          post={state.postData}
          draftStatus={draft.status}
          createStatus={create.status}
          handleDraftPost={draft.handleDraftPost}
          handleCreatePost={create.handleCreatePost}
          dispatch={dispatch}
          errors={draft.errors}
          shouldShowErrors={data.shouldShowErrors}
          handleHideErrors={data.handleHideErrors}
        />
      )}
      <Snackbar
        message={data.msg}
        open={data.shouldShowSnackbar}
        onClose={data.handleHideErrors}
      />
      <Snackbar
        open={state.showStoragePostAlert}
        message="It seems you have an unfinished post. Would you like to continue from where you stopped? Doing so will overwrite your current progress"
        action={<StorageAlertActions dispatch={dispatch} />}
        ContentProps={{
          sx: { "&>.MuiSnackbarContent-action": { columnGap: 0.5 } },
        }}
        sx={{ maxWidth: 600 }}
      />
    </>
  );
};

CreatePostPage.layout = uiLayout(RootLayout, { title: "Create New Blog Post" });

export default CreatePostPage;
