import * as React from "react";

import FormHelperText from "@mui/material/FormHelperText";

import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";
import CKEditorComponent from "./components/CKEditorComponent";
import CreatePostErrorsAlert from "../CreatePostErrorsAlert";
import type {
  CreatePostAction,
  DraftErrorCb,
  DraftErrors,
  PostView,
  Status,
} from "@types";

interface CreatePostContentProps {
  content: string;
  draftStatus: Status;
  draftErrors: DraftErrors;
  handleDraftPost: (errorCb?: DraftErrorCb) => Promise<void>;
  dispatch: React.Dispatch<CreatePostAction>;
}

const CreatePostContent = ({
  content,
  draftStatus,
  draftErrors: { contentError, ...rest },
  handleDraftPost,
  dispatch,
}: CreatePostContentProps) => {
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
        <FormHelperText id={id} error sx={{ mb: 2.5 }}>
          {contentErrorMsg}
        </FormHelperText>
      )}
      <CreatePostErrorsAlert {...rest} />
      <ActionButtons
        label="Preview post"
        status={draftStatus}
        onDraft={() => void handleDraftPost()}
        onNext={handleNext}
      />
    </section>
  );
};

export default CreatePostContent;
