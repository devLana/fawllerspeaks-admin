import useHandleFileUrl from "@hooks/createPost/useHandleFileUrl";
import PostPreview from "@features/posts/components/PostPreview";
import CreatePostSectionHeader from "../CreatePostSectionHeader";
import CreatePostPreviewActionsMenu from "./CreatePostPreviewActionsMenu";
import CreatePostPreviewDialog from "./CreatePostPreviewDialog";
import CreatePostActionButtons from "../CreatePostActionButtons";
import PostErrorsAlert from "@features/posts/components/PostErrorsAlert";
import type * as creates from "types/posts/createPost";
import type * as types from "types/posts";
import type { StateSetterFn } from "@types";

interface CreatePostPreviewProps {
  isOpen: boolean;
  setIsOpen: StateSetterFn<boolean>;
  post: types.PostInputData;
  draftStatus: types.PostActionStatus;
  createStatus: types.PostActionStatus;
  errors: creates.CreatePostFieldErrors;
  shouldShowErrors: boolean;
  handleHideErrors: VoidFunction | undefined;
  handleDraftPost: (metadata?: types.PostMetadataFields) => Promise<void>;
  handleCreatePost: () => Promise<void>;
  dispatch: React.Dispatch<creates.CreatePostAction>;
}

const CreatePostPreview = ({
  isOpen,
  setIsOpen,
  post,
  draftStatus,
  createStatus,
  errors,
  shouldShowErrors,
  handleHideErrors,
  handleDraftPost,
  handleCreatePost,
  dispatch,
}: CreatePostPreviewProps) => {
  const { fileUrl } = useHandleFileUrl(post.imageBanner);

  return (
    <section
      aria-live="polite"
      aria-busy="false"
      aria-labelledby="post-preview-label"
    >
      <CreatePostSectionHeader
        onClick={() => dispatch({ type: "GO_BACK_TO_CONTENT" })}
        id="post-preview-label"
        buttonLabel="Go back to provide post content section"
        heading="Preview blog post"
        actionsMenu={
          <CreatePostPreviewActionsMenu
            draftStatus={draftStatus}
            onCreate={() => setIsOpen(true)}
            onDraft={handleDraftPost}
          />
        }
      />
      <PostPreview
        title={post.title}
        description={post.description}
        excerpt={post.excerpt}
        content={post.content}
        tagIds={post.tagIds}
        imageSrc={fileUrl}
      >
        <CreatePostActionButtons
          nextLabel="Publish post"
          actionLabel="Save as draft"
          status={draftStatus}
          onAction={() => handleDraftPost()}
          onNext={() => setIsOpen(true)}
          hasPopUp
          sx={{ gridArea: { md: "2 / 2 / 3 / 3" }, alignSelf: { md: "start" } }}
        />
      </PostPreview>
      <PostErrorsAlert
        shouldShowErrors={shouldShowErrors}
        onClick={handleHideErrors}
        {...errors}
      />
      <CreatePostPreviewDialog
        isOpen={isOpen}
        createStatus={createStatus}
        onCloseDialog={() => setIsOpen(false)}
        handleCreatePost={handleCreatePost}
      />
    </section>
  );
};

export default CreatePostPreview;
