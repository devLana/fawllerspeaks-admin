import * as React from "react";

import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import RootLayout from "@layouts/RootLayout";
import CreatePostTags from "@features/postTags/CreatePostTags";
import GetPostTags from "@features/postTags/GetPostTags";
import uiLayout from "@utils/uiLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { NextPageWithLayout } from "@types";

const PostTags: NextPageWithLayout = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleOpenSnackbar = (msg: string) => {
    setMessage(msg);
    setIsOpen(true);
  };

  return (
    <>
      <Stack
        direction="row"
        flexWrap="wrap"
        rowGap={2}
        columnGap={5}
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h1">
          Use post tags to categorize blog posts
        </Typography>
        <CreatePostTags onOpenSnackbar={handleOpenSnackbar} />
      </Stack>
      <GetPostTags />
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
