import * as React from "react";
import { useRouter } from "next/router";

import { handleCloseAlert } from "@utils/handleCloseAlert";

const useStatusAlert = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { query } = useRouter();

  React.useEffect(() => {
    if (query.status && typeof query.status === "string") {
      switch (query.status) {
        case "unknown":
          setAlert({
            open: true,
            message: "It seems the post you tried to edit no longer exists",
          });
          break;

        default:
      }
    }
  }, [query.status]);

  const onClose = handleCloseAlert({ ...alert, open: false }, setAlert);

  return { ...alert, onClose };
};

export default useStatusAlert;
