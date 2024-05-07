import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

import SectionHeader from "../SectionHeader";
import CKEditorComponent from "./components/CKEditorComponent";
import type { CreatePostAction, PostView } from "@types";

interface PostContentProps {
  content: string;
  draftStatus: "idle" | "loading" | "error";
  handleDraftPost: () => Promise<void>;
  dispatch: React.Dispatch<CreatePostAction>;
}

const PostContent = (props: PostContentProps) => {
  const { content, draftStatus, handleDraftPost, dispatch } = props;

  const handleView = (view: PostView) => {
    dispatch({ type: "CHANGE_VIEW", payload: { view } });
  };

  const handleNext = () => {
    if (content) handleView("preview");
  };

  return (
    <section>
      <SectionHeader
        onClick={() => handleView("metadata")}
        label="Go back to post metadata section"
        heading="Provide blog post content"
      />
      <CKEditorComponent data={content} dispatch={dispatch} />
      <Box
        display="flex"
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
      </Box>
    </section>
  );
};

export default PostContent;
