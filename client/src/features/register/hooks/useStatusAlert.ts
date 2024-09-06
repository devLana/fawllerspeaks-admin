import * as React from "react";
import { useRouter } from "next/router";

const useStatusAlert = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { query } = useRouter();

  React.useEffect(() => {
    if (query.status && typeof query.status === "string") {
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
  }, [query.status]);

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return { ...alert, handleCloseAlert };
};

export default useStatusAlert;
