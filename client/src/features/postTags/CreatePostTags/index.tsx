import * as React from "react";

import Button from "@mui/material/Button";

import PostTagsDialog from "../components/PostTagsDialog";
import CreatePostTagsForm from "./components/CreatePostTagsForm";

type Status = "idle" | "submitting";

const CreatePostTags = () => {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("idle");

  const handleCloseDialog = () => {
    setOpen(false);
    setStatus("idle");
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        Create Post Tags
      </Button>
      <PostTagsDialog
        open={open}
        onClose={status === "submitting" ? undefined : () => setOpen(false)}
        title="Create new post tags"
        contentText="You can create up to 10 post tags at a time."
        fullWidth
      >
        <CreatePostTagsForm
          status={status}
          onCloseDialog={handleCloseDialog}
          onStatusChange={(newStatus: Status) => setStatus(newStatus)}
        />
      </PostTagsDialog>
    </>
  );
};

export default CreatePostTags;
