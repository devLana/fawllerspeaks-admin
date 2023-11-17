import * as React from "react";
import { useRouter } from "next/router";

const useStatusAlert = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { isReady, query } = useRouter();

  React.useEffect(() => {
    if (isReady && query.status && !Array.isArray(query.status)) {
      const message = "Unable to verify password reset token";

      switch (query.status) {
        case "empty":
          setAlert({
            open: true,
            message:
              "A password reset token is needed to reset an account password",
          });
          break;

        case "invalid":
        case "validation":
          setAlert({ open: true, message: "Invalid password reset token" });
          break;

        case "fail":
        case "unsupported":
        case "api":
          setAlert({ open: true, message });
          break;

        case "network":
        case "error":
          setAlert({
            open: true,
            message: `${message}. Please try again later`,
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
