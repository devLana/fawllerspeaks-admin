import * as React from "react";

import FormHelperText from "@mui/material/FormHelperText";

import CreatePostSectionHeader from "../CreatePostSectionHeader";
import CreatePostContentEditor from "./CreatePostContentEditor";
import CreatePostActionButtons from "@features/posts/CreatePost/components/CreatePostActionButtons";
import PostErrorsAlert from "@features/posts/components/PostErrorsAlert";
import type { PostActionStatus, PostMetadataFields } from "types/posts";
import type * as types from "types/posts/createPost";

interface CreatePostContentProps {
  content: string;
  draftStatus: PostActionStatus;
  errors: types.CreatePostFieldErrors;
  shouldShowErrors: boolean;
  handleHideErrors: () => void;
  handleDraftPost: (metadata?: PostMetadataFields) => Promise<void>;
  dispatch: React.Dispatch<types.CreatePostAction>;
}

const CreatePostContent = ({
  content,
  draftStatus,
  errors: { contentError, ...rest },
  shouldShowErrors,
  handleHideErrors,
  handleDraftPost,
  dispatch,
}: CreatePostContentProps) => {
  const [contentIsEmpty, setContentIsEmpty] = React.useState(false);

  const handleNext = () => {
    if (content.replace(/<p>(?:<br>)*&nbsp;<\/p>/g, "")) {
      dispatch({ type: "PREVIEW_POST" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setContentIsEmpty(true);
    }
  };

  return (
    <section
      aria-live="polite"
      aria-busy="false"
      aria-labelledby="post-content-label"
    >
      <CreatePostSectionHeader
        onClick={() => dispatch({ type: "GO_BACK_TO_METADATA" })}
        id="post-content-label"
        buttonLabel="Go back to provide post metadata section"
        heading="Provide post content"
      />
      <CreatePostContentEditor
        id="post-content-helper-text"
        content={content}
        contentHasError={contentIsEmpty || !!contentError}
        onBlur={value => setContentIsEmpty(value)}
        onFocus={() => setContentIsEmpty(false)}
        dispatch={dispatch}
      />
      {(contentIsEmpty || contentError) && (
        <FormHelperText id="post-content-helper-text" error>
          {contentIsEmpty ? "Enter post content" : contentError}
        </FormHelperText>
      )}
      <CreatePostActionButtons
        nextLabel="Preview post"
        actionLabel="Save as draft"
        status={draftStatus}
        onAction={() => void handleDraftPost()}
        onNext={handleNext}
      />
      <PostErrorsAlert
        shouldShowErrors={shouldShowErrors}
        onClick={handleHideErrors}
        {...rest}
      />
    </section>
  );
};

export default CreatePostContent;
