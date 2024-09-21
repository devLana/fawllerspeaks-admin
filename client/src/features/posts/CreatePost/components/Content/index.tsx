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
    if (content.trim().replace(/<p>(?:<br>)*&nbsp;<\/p>/g, "")) {
      handleView("preview");
    } else {
      setContentIsEmpty(true);
    }
  };

  const id = "post-content-helper-text";
  const contentHasError = contentIsEmpty || !!contentError;
  const contentErrorMsg = contentIsEmpty ? "Enter post content" : contentError;

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
        id={id}
        data={content}
        contentHasError={contentHasError}
        dispatch={dispatch}
        onBlur={value => setContentIsEmpty(value)}
        onFocus={() => setContentIsEmpty(false)}
      />
      {contentHasError && (
        <FormHelperText id={id} error>
          {contentErrorMsg}
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
