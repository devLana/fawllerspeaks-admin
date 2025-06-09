import * as React from "react";
import { useRouter } from "next/router";

import { handleCloseAlert } from "@utils/handleCloseAlert";

const useStatusAlert = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { query } = useRouter();

  React.useEffect(() => {
    if (query.message && typeof query.message === "string") {
      switch (query.message) {
        case "unknown":
          setAlert({
            open: true,
            message: "It seems the post you tried to edit no longer exists",
          });
          break;

        case "edit-load-error":
          setAlert({
            open: true,
            message: `There was an error trying to recover your saved post. The saved data appears to be corrupted or incomplete`,
          });
          break;

        default:
      }
    }
  }, [query.message]);

  const onClose = handleCloseAlert({ ...alert, open: false }, setAlert);

  return { ...alert, onClose };
};

export default useStatusAlert;
