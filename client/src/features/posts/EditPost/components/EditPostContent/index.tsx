import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";

import CKEditorComponent from "@features/posts/components/CKEditorComponent";
import PostsPageBackButton from "@features/posts/components/PostsPageBackButton";
import EditPostErrorsAlert from "../EditPostErrorsAlert";
import type { EditPostAction, EditPostFieldErrors } from "types/posts/editPost";
import type { PostActionStatus } from "types/posts";

interface EditPostContentProps {
  content: string;
  editStatus: PostActionStatus;
  editErrors: EditPostFieldErrors;
  onCloseEditError: () => void;
  dispatch: React.Dispatch<EditPostAction>;
}

const EditPostContent = ({
  content,
  editErrors: { contentError, ...errors },
  editStatus,
  dispatch,
  onCloseEditError,
}: EditPostContentProps) => {
  const [contentErrorMsg, setContentErrorMsg] = React.useState("");

  const handleNext = () => {
    if (content.replace(/<p>(?:<br>)*&nbsp;<\/p>/g, "")) {
      dispatch({ type: "PREVIEW_POST" });
    } else {
      setContentErrorMsg("Post content cannot be empty");
    }
  };

  const dispatchFn = (editorContent: string) => {
    dispatch({ type: "ADD_POST_CONTENT", payload: { content: editorContent } });
  };

  return (
    <section
      aria-live="polite"
      aria-busy="false"
      aria-label="Edit post content"
    >
      <Box sx={{ mb: 3 }}>
        <PostsPageBackButton
          buttonLabel="Go back to edit post metadata section"
          onClick={() => dispatch({ type: "GO_BACK_TO_METADATA" })}
        />
      </Box>
      <CKEditorComponent
        id="post-content-helper-text"
        data={content}
        shouldSaveToStorage={false}
        contentHasError={!!contentErrorMsg || !!contentError}
        onBlur={value => setContentErrorMsg(value ? "Enter post content" : "")}
        onFocus={() => setContentErrorMsg("")}
        dispatchFn={dispatchFn}
      />
      {(contentErrorMsg || contentError) && (
        <FormHelperText id="post-content-helper-text" error>
          {contentErrorMsg || contentError}
        </FormHelperText>
      )}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="contained" onClick={handleNext}>
          Preview post
        </Button>
      </Box>
      <EditPostErrorsAlert
        shouldOpen={editStatus === "inputError"}
        onClick={onCloseEditError}
        {...errors}
      />
    </section>
  );
};

export default EditPostContent;
