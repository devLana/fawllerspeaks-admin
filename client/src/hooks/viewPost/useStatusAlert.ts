import * as React from "react";
import { useRouter } from "next/router";

import { handleCloseAlert } from "@utils/handleCloseAlert";

const useStatusAlert = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { query } = useRouter();

  React.useEffect(() => {
    if (query.draft && typeof query.draft === "string") {
      const message =
        query.draft === "true"
          ? "Blog post saved as draft. But there was an error uploading your post image banner. Please try uploading an image later"
          : "Blog post saved as draft";

      setAlert({ open: true, message });
    } else if (query.create && typeof query.create === "string") {
      const message =
        query.create === "true"
          ? "Blog post created and published. But there was an error uploading your post image banner. Please try uploading an image later"
          : "Blog post created and published";

      setAlert({ open: true, message });
    } else if (query.edit && typeof query.edit === "string") {
      const message =
        query.edit === "true"
          ? "Blog post edited. But there was an error uploading your post image banner. Please try uploading an image later"
          : "Blog post edited";

      setAlert({ open: true, message });
    }
  }, [query.draft, query.create, query.edit]);

  const onClose = handleCloseAlert({ ...alert, open: false }, setAlert);

  return { ...alert, onClose };
};

export default useStatusAlert;
