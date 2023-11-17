import * as React from "react";
import { useRouter } from "next/router";

const useStatusAlert = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { isReady, query } = useRouter();

  React.useEffect(() => {
    if (isReady && query.status && !Array.isArray(query.status)) {
      switch (query.status) {
        case "unregistered":
          setAlert({
            open: true,
            message:
              "You need to register your account before you can perform that action",
          });
          break;

        default:
      }
    }
  }, [isReady, query.status]);

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return { ...alert, handleCloseAlert };
};

export default useStatusAlert;
