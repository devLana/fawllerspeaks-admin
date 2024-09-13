import * as React from "react";

import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

import { useCreatePost } from "./hooks/useCreatePost";
import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";
import CreatePostErrorsAlert from "../CreatePostErrorsAlert";
import PostInfoPreview from "./components/PostInfo/PostInfoPreview";
import PostTagsPreview from "./components/PostInfo/PostTagsPreview";
import PostImageBanner from "@features/posts/components/PostImageBanner";
import PostContentView from "@features/posts/components/PostContentView";
import PostPreviewActionsMenu from "./components/PostPreviewActionsMenu";
import PostPreviewDialog from "./components/PostPreviewDialog";
import type {
  CreateInputErrors,
  CreatePostAction,
  CreatePostData,
  CreateStatus,
  DraftErrorCb,
} from "../../types";

interface CreatePostPreviewProps {
  post: CreatePostData;
  draftStatus: CreateStatus;
  draftErrors: CreateInputErrors;
  handleDraftPost: (errorCb?: DraftErrorCb) => Promise<void>;
  handleCloseDraftError: () => void;
  dispatch: React.Dispatch<CreatePostAction>;
}

const CreatePostPreview = ({
  post,
  draftStatus,
  draftErrors,
  handleDraftPost,
  handleCloseDraftError,
  dispatch,
}: CreatePostPreviewProps) => {
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
          <PostPreviewActionsMenu
            draftStatus={draftStatus}
            onCreate={() => setIsOpen(true)}
            onDraft={handleDraftPost}
          />
        }
      />
      <Box
        mt={{ md: 6 }}
        display={{ md: "grid" }}
        gridTemplateColumns={{ md: "1.2fr 2fr" }}
        gridTemplateRows={{ md: "auto auto" }}
        columnGap={{ md: 4 }}
        rowGap={{ md: 5 }}
      >
        <Box
          component="aside"
          p={{ md: 2 }}
          border={{ md: "1px solid" }}
          borderColor={{ md: "divider" }}
          borderRadius={{ md: 1 }}
          gridArea={{ md: "1 / 1 / 3 / 2" }}
          alignSelf={{ md: "start" }}
          sx={({ breakpoints: { down } }) => ({
            [down("md")]: {
              pb: 5,
              mb: 5,
              borderBottom: "1px solid",
              borderBottomColor: "divider",
            },
          })}
        >
          <PostInfoPreview
            description={post.description}
            excerpt={post.excerpt}
          />
          <PostTagsPreview tagIds={post.tagIds ?? []} />
        </Box>
        <Box
          component="article"
          pb={5}
          borderBottom="1px solid"
          borderColor="divider"
          gridArea={{ md: "1 / 2 / 2 / 3" }}
          sx={({ breakpoints: { down } }) => ({ [down("md")]: { mb: 5 } })}
        >
          <Typography
            variant="h2"
            gutterBottom
            sx={({ typography }) => ({ ...typography.h1 })}
          >
            {post.title}
          </Typography>
          {post.imageBanner?.blobUrl && (
            <PostImageBanner
              src={post.imageBanner.blobUrl}
              title={post.title}
              sx={{
                height: { height: 200, sm: 250, md: 300 },
                maxWidth: 700,
                borderRadius: 1,
                overflow: "hidden",
                mb: 3,
                mx: "auto",
              }}
            />
          )}
          <PostContentView content={post.content} />
        </Box>
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
      <PostPreviewDialog
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

export default CreatePostPreview;
