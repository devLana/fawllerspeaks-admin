import * as React from "react";

import FormHelperText from "@mui/material/FormHelperText";

import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";
import CKEditorComponent from "./CKEditorComponent";
import CreatePostErrorsAlert from "../CreatePostErrorsAlert";
import type {
  CreateInputErrors,
  CreatePostAction,
  CreateStatus,
  DraftErrorCb,
  PostView,
} from "types/posts/createPost";

interface ContentProps {
  content: string;
  draftStatus: CreateStatus;
  draftErrors: CreateInputErrors;
  handleDraftPost: (errorCb?: DraftErrorCb) => Promise<void>;
  handleCloseDraftError: () => void;
  dispatch: React.Dispatch<CreatePostAction>;
}

const Content = ({
  content,
  draftStatus,
  draftErrors: { contentError, ...rest },
  handleDraftPost,
  handleCloseDraftError,
  dispatch,
}: ContentProps) => {
  const [contentIsEmpty, setContentIsEmpty] = React.useState(false);

  const handleView = (view: PostView) => {
    dispatch({ type: "CHANGE_VIEW", payload: { view } });
  };

  const handleNext = () => {
    if (content.replace(/<p>(?:<br>)*&nbsp;<\/p>/g, "")) {
      handleView("preview");
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
      <SectionHeader
        onClick={() => handleView("metadata")}
        id="post-content-label"
        buttonLabel="Go back to provide post metadata section"
        heading="Provide post content"
      />
      <CKEditorComponent
        id="post-content-helper-text"
        data={content}
        contentHasError={contentIsEmpty || !!contentError}
        dispatch={dispatch}
        onBlur={value => setContentIsEmpty(value)}
        onFocus={() => setContentIsEmpty(false)}
      />
      {(contentIsEmpty || !!contentError) && (
        <FormHelperText id="post-content-helper-text" error>
          {contentIsEmpty ? "Enter post content" : contentError}
        </FormHelperText>
      )}
      <CreatePostErrorsAlert
        ariaLabel="Draft post errors"
        shouldOpen={draftStatus === "inputError"}
        onClick={handleCloseDraftError}
        {...rest}
      />
      <ActionButtons
        label="Preview post"
        status={draftStatus}
        onDraft={() => void handleDraftPost()}
        onNext={handleNext}
      />
    </section>
  );
};

export default Content;
