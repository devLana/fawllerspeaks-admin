import * as React from "react";

import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import RootLayout from "@layouts/RootLayout";
import { PostTagsPageContext } from "@features/postTags/context/PostTagsPageContext";
import CreatePostTags from "@features/postTags/CreatePostTags";
import GetPostTags from "@features/postTags/GetPostTags";
import uiLayout from "@utils/uiLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { NextPageWithLayout } from "@types";

const PostTagsPage: NextPageWithLayout = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });

  const handleOpenAlert = (message: string) => {
    setAlert({ open: true, message });
  };

  return (
    <PostTagsPageContext.Provider value={{ handleOpenAlert }}>
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
        <CreatePostTags />
      </Stack>
      <GetPostTags />
      <Snackbar
        message={alert.message}
        open={alert.open}
        onClose={handleCloseAlert({ ...alert, open: false }, setAlert)}
      />
    </PostTagsPageContext.Provider>
  );
};

PostTagsPage.layout = uiLayout(RootLayout, { title: "Blog Post Tags" });

export default PostTagsPage;
