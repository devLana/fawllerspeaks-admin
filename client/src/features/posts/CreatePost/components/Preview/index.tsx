import * as React from "react";

import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";

import { useCreatePost } from "@hooks/createPost/useCreatePost";
import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";
import CreatePostErrorsAlert from "../CreatePostErrorsAlert";
import PreviewActionsMenu from "./PreviewActionsMenu";
import PreviewDialog from "./PreviewDialog";
import Aside from "./Aside";
import Article from "./Article";
import type {
  CreateInputErrors,
  CreatePostAction,
  CreatePostData,
  CreateStatus,
  DraftErrorCb,
} from "types/posts/createPost";

interface PreviewProps {
  post: CreatePostData;
  draftStatus: CreateStatus;
  draftErrors: CreateInputErrors;
  handleDraftPost: (errorCb?: DraftErrorCb) => Promise<void>;
  handleCloseDraftError: () => void;
  dispatch: React.Dispatch<CreatePostAction>;
}

const Preview = ({
  post,
  draftStatus,
  draftErrors,
  handleDraftPost,
  handleCloseDraftError,
  dispatch,
}: PreviewProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const create = useCreatePost(post, () => setIsOpen(false));

  const handleGoBack = () => {
    dispatch({ type: "CHANGE_VIEW", payload: { view: "content" } });
  };

  const apiErrors: CreateInputErrors = { ...draftErrors, ...create.errors };

  const handleCloseErrorsList =
    create.createStatus === "inputError"
      ? create.handleCloseError
      : handleCloseDraftError;

  return (
    <section
      aria-live="polite"
      aria-busy="false"
      aria-labelledby="post-preview-label"
    >
      <SectionHeader
        onClick={handleGoBack}
        id="post-preview-label"
        buttonLabel="Go back to provide post content section"
        heading="Preview blog post"
        actionsMenu={
          <PreviewActionsMenu
            draftStatus={draftStatus}
            onCreate={() => setIsOpen(true)}
            onDraft={handleDraftPost}
          />
        }
      />
      <Box
        sx={{
          mt: { md: 6 },
          display: { md: "grid" },
          gridTemplateColumns: { md: "1.2fr 2fr" },
          gridTemplateRows: { md: "auto auto" },
          columnGap: { md: 4 },
          rowGap: { md: 5 },
        }}
      >
        <Aside
          description={post.description}
          excerpt={post.excerpt}
          tagIds={post.tagIds}
        />
        <Article
          title={post.title}
          imageBannerBlobUrl={post.imageBanner?.blobUrl}
          content={post.content}
        />
        <ActionButtons
          label="Create post"
          status={draftStatus}
          onDraft={() => void handleDraftPost()}
          onNext={() => setIsOpen(true)}
          sx={{ gridArea: { md: "2 / 2 / 3 / 3" }, alignSelf: { md: "start" } }}
        />
      </Box>
      <CreatePostErrorsAlert
        ariaLabel="Create post errors"
        shouldOpen={
          create.createStatus === "inputError" || draftStatus === "inputError"
        }
        onClick={handleCloseErrorsList}
        {...apiErrors}
      />
      <PreviewDialog
        isOpen={isOpen}
        createStatus={create.createStatus}
        onCloseDialog={() => setIsOpen(false)}
        handleCreatePost={create.handleCreatePost}
      />
      <Snackbar
        message={create.msg}
        open={create.createStatus === "error"}
        onClose={create.handleCloseError}
      />
    </section>
  );
};

export default Preview;
