import * as React from "react";
import { useRouter } from "next/router";

const useStatusAlert = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { query } = useRouter();

  React.useEffect(() => {
    if (query.status && typeof query.status === "string") {
      switch (query.status) {
        case "upload":
          setAlert({ open: true, message: "Profile updated" });
          break;

        case "upload-error":
          setAlert({
            open: true,
            message:
              "Profile updated. But there was an error uploading your new profile image. Please try uploading an image later",
          });
          break;

        default:
      }
    }
  }, [query.status]);

  return { alert, setAlert };
};

export default useStatusAlert;
