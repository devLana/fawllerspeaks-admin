import * as React from "react";
import { useRouter } from "next/router";

import { handleCloseAlert } from "@utils/handleCloseAlert";

const useStatusAlert = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { query } = useRouter();

  React.useEffect(() => {
    if (query.image && typeof query.image === "string") {
      switch (query.image) {
        case "draft-upload-error":
          setAlert({
            open: true,
            message:
              "Blog post saved as draft. But there was an error uploading your post image banner. Please try uploading an image later",
          });
          break;

        case "create-upload-error":
          setAlert({
            open: true,
            message:
              "Blog post created and published. But there was an error uploading your post image banner. Please try uploading an image later",
          });
          break;

        default:
      }
    }
  }, [query.image]);

  const onClose = handleCloseAlert({ ...alert, open: false }, setAlert);

  return { ...alert, onClose };
};

export default useStatusAlert;
