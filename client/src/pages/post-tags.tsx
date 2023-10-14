import * as React from "react";

import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import RootLayout from "@layouts/RootLayout";
import CreatePostTags from "@features/postTags/CreatePostTags";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";
import { handleCloseAlert } from "@utils/handleCloseAlert";

const PostTags: NextPageWithLayout = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleOpenSnackbar = (msg: string) => {
    setMessage(msg);
    setIsOpen(true);
  };

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Use post tags to categorize blog posts
      </Typography>
      <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
        <TextField size="small" fullWidth sx={{ maxWidth: 455 }} />
        <CreatePostTags onOpenSnackbar={handleOpenSnackbar} />
      </Stack>
      <Snackbar
        message={message}
        open={isOpen}
        onClose={handleCloseAlert<boolean>(false, setIsOpen)}
      />
    </>
  );
};

PostTags.layout = uiLayout(RootLayout, { title: "Blog Post Tags" });

export default PostTags;
