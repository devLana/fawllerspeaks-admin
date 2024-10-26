import * as React from "react";
import { useRouter } from "next/router";

const useStatusAlert = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { query } = useRouter();

  React.useEffect(() => {
    if (query.status && typeof query.status === "string") {
      switch (query.status) {
        case "invalid":
        case "validation":
          setAlert({ open: true, message: "Invalid password reset token" });
          break;

        case "fail":
        case "unsupported":
        case "api":
          setAlert({
            open: true,
            message: "Unable to verify password reset token",
          });
          break;

        case "network":
          setAlert({
            open: true,
            message:
              "Unable to verify password reset token. Please try again later",
          });
          break;

        case "error":
          setAlert({
            open: true,
            message:
              "There was an error trying to reset your password. Please try again later",
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
