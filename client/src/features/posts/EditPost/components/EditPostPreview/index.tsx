import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditNoteIcon from "@mui/icons-material/EditNote";

import useHandleFileUrl from "@hooks/useHandleFileUrl";
import EditPostPreviewDialog from "./EditPostPreviewDialog";
import PostViewHeader from "@features/posts/components/PostViewHeader";
import PostPreview from "@features/posts/components/PostPreview";
import EditPostErrorsAlert from "../EditPostErrorsAlert";
import type { PostStatus } from "@apiTypes";
import type { PostActionStatus } from "types/posts";
import type * as types from "types/posts/editPost";
import type { StateSetterFn } from "@types";

interface EditPostProps {
  isOpen: boolean;
  editErrors: types.EditPostFieldErrors;
  editApiStatus: PostActionStatus;
  postStatus: PostStatus;
  post: types.EditPostStateData;
  onCloseEditError: VoidFunction;
  handleEditPost: (previewStatus: PostStatus) => Promise<void>;
  dispatch: React.Dispatch<types.EditPostAction>;
  setIsOpen: StateSetterFn<boolean>;
}

const EditPostPreview = ({ postStatus, post, ...props }: EditPostProps) => {
  const { fileUrl } = useHandleFileUrl(post.imageBanner.file);

  const statusMap: Record<PostStatus, Exclude<PostStatus, "Draft">> = {
    Draft: "Published",
    Unpublished: "Published",
    Published: "Unpublished",
  };

  const previewStatus = post.editStatus ? statusMap[postStatus] : postStatus;
  const imgSizes = "(maxWidth: 600px) 450px, 640px";

  return (
    <section
      aria-live="polite"
      aria-busy="false"
      aria-label="Preview edited post"
    >
      <PostViewHeader
        status={previewStatus}
        title={post.title}
        buttonLabel="Go back to edit post content section"
        onClick={() => props.dispatch({ type: "GO_BACK_TO_CONTENT" })}
      >
        <IconButton
          size="small"
          color="secondary"
          aria-label="Edit Post"
          aria-haspopup="dialog"
          onClick={() => props.setIsOpen(true)}
        >
          <EditNoteIcon fontSize="small" />
        </IconButton>
      </PostViewHeader>
      <PostPreview
        title={post.title}
        description={post.description}
        excerpt={post.excerpt}
        content={post.content}
        tagIds={post.tagIds ?? undefined}
        imageSrc={fileUrl || post.imageBanner.url}
        imageSizes={post.imageBanner.url ? imgSizes : undefined}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gridArea: { md: "2 / 2 / 3 / 3" },
            alignSelf: { md: "start" },
          }}
        >
          <Button variant="contained" onClick={() => props.setIsOpen(true)}>
            Edit Post
          </Button>
        </Box>
      </PostPreview>
      <EditPostPreviewDialog
        isOpen={props.isOpen}
        status={postStatus}
        previewStatus={previewStatus}
        editStatus={post.editStatus}
        editApiStatus={props.editApiStatus}
        onCloseDialog={() => props.setIsOpen(false)}
        handleEditPost={props.handleEditPost}
      />
      <EditPostErrorsAlert
        shouldOpen={props.editApiStatus === "inputError"}
        onClick={props.onCloseEditError}
        {...props.editErrors}
      />
    </section>
  );
};

export default EditPostPreview;
