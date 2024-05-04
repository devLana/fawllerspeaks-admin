import * as React from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import ChevronLeft from "@mui/icons-material/ChevronLeft";

import CKEditorComponent from "./components/CKEditorComponent";
import type { PostView, StateSetterFn } from "@types";

interface PostContentProps {
  content: string;
  draftStatus: "idle" | "loading" | "error";
  handleContent: (content: string) => void;
  handleDraftPost: () => Promise<void>;
  setView: StateSetterFn<PostView>;
}

const PostContent = ({
  content,
  draftStatus,
  handleContent,
  handleDraftPost,
  setView,
}: PostContentProps) => {
  const handleNext = () => {
    if (!content) return;
    setView("preview");
  };

  return (
    <>
      <Button onClick={() => setView("metadata")} startIcon={<ChevronLeft />}>
        Back
      </Button>
      <Typography gutterBottom>Provide your blog post content</Typography>
      <CKEditorComponent data={content} onChange={handleContent} />
      <Stack
        direction="row"
        justifyContent="center"
        flexWrap="wrap"
        rowGap={1}
        columnGap={2}
      >
        <LoadingButton
          variant="outlined"
          loading={draftStatus === "loading"}
          onClick={handleDraftPost}
        >
          <span>Save as draft</span>
        </LoadingButton>
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={draftStatus === "loading"}
        >
          Next
        </Button>
      </Stack>
    </>
  );
};

export default PostContent;
