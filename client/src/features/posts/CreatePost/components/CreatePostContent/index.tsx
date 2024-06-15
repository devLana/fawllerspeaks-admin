import * as React from "react";

import FormHelperText from "@mui/material/FormHelperText";

import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";
import CKEditorComponent from "./components/CKEditorComponent";
import type { CreatePostAction, PostView, Status } from "@types";

interface CreatePostContentProps {
  content: string;
  draftStatus: Status;
  handleDraftPost: () => Promise<void>;
  dispatch: React.Dispatch<CreatePostAction>;
}

const CreatePostContent = (props: CreatePostContentProps) => {
  const { content, draftStatus, handleDraftPost, dispatch } = props;
  const [contentIsEmpty, setContentIsEmpty] = React.useState(false);

  const handleView = (view: PostView) => {
    dispatch({ type: "CHANGE_VIEW", payload: { view } });
  };

  const handleNext = () => {
    if (content.trim().replace(/<p>(<br>)*&nbsp;<\/p>/g, "")) {
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
        data={content}
        dispatch={dispatch}
        contentIsEmpty={contentIsEmpty}
        onBlur={value => setContentIsEmpty(value)}
        onFocus={() => setContentIsEmpty(false)}
      />
      {contentIsEmpty && (
        <FormHelperText error sx={{ mb: 2.5 }}>
          Provide post content
        </FormHelperText>
      )}
      <ActionButtons
        label="Preview post"
        status={draftStatus}
        onDraft={handleDraftPost}
        onNext={handleNext}
      />
    </section>
  );
};

export default CreatePostContent;
