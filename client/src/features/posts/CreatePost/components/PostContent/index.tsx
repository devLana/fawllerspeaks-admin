import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";
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
      <CKEditorComponent data={content} dispatch={dispatch} />
      <ActionButtons
        label="Preview post"
        status={draftStatus}
        onDraft={handleDraftPost}
        onNext={handleNext}
      />
    </section>
  );
};

export default PostContent;
