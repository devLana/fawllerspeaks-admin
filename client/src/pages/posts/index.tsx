import * as React from "react";
import { useRouter } from "next/router";

import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";

import RootLayout from "@layouts/RootLayout";
import uiLayout from "@utils/uiLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { NextPageWithLayout } from "@types";

const PostsPage: NextPageWithLayout = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { isReady, query } = useRouter();

  React.useEffect(() => {
    if (isReady && query.status && !Array.isArray(query.status)) {
      switch (query.status) {
        case "draft-upload-error":
          setAlert({
            open: true,
            message:
              "Blog post saved to draft. But there was an error uploading your post image banner. Please try again later",
          });
          break;

        case "create-upload-error":
          setAlert({
            open: true,
            message:
              "Blog post created. But there was an error uploading your post image banner. Please try again later",
          });
          break;

        default:
      }
    }
  }, [isReady, query.status]);

  return (
    <>
      <Snackbar
        open={alert.open}
        onClose={handleCloseAlert({ ...alert, open: false }, setAlert)}
        message={alert.message}
      />
      <Typography variant="h1">Posts Page</Typography>
    </>
  );
};

PostsPage.layout = uiLayout(RootLayout, { title: "Blog Posts" });

export default PostsPage;
