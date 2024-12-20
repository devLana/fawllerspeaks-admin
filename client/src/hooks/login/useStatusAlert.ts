import * as React from "react";
import { useRouter } from "next/router";

const useStatusAlert = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { query } = useRouter();

  React.useEffect(() => {
    if (query.status && typeof query.status === "string") {
      switch (query.status) {
        case "unauthorized":
        case "unauthenticated":
          setAlert({
            open: true,
            message: "You are unable to perform that action. Please log in",
          });
          break;

        case "expired":
          setAlert({
            open: true,
            message: "Current session has expired. Please log in",
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
