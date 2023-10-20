import * as React from "react";

import Button from "@mui/material/Button";

import CreatePostTagsDialog from "./components/CreatePostTagsDialog";

interface CreatePostTagsProps {
  onOpenSnackbar: (message: string) => void;
}

const CreatePostTags = ({ onOpenSnackbar }: CreatePostTagsProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
      >
        Create Post Tags
      </Button>
      <CreatePostTagsDialog
        onOpenSnackbar={onOpenSnackbar}
        isOpen={isOpen}
        onCloseDialog={() => setIsOpen(false)}
      />
    </>
  );
};

export default CreatePostTags;
