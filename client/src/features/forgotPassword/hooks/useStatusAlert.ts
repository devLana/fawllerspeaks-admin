import { useRouter } from "next/router";
import * as React from "react";

const useStatusAlert = (
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const { isReady, query } = useRouter();

  React.useEffect(() => {
    if (isReady) {
      if (query.status && !Array.isArray(query.status)) {
        const message = "Unable to verify password reset token";

        switch (query.status) {
          case "empty":
            setStatusMessage("No password reset token provided");
            setIsOpen(true);
            break;

          case "invalid":
            setStatusMessage("Wrong password reset token format provided");
            setIsOpen(true);
            break;

          case "validation":
            setStatusMessage("Invalid password reset token provided");
            setIsOpen(true);
            break;

          case "fail":
          case "unsupported":
          case "api":
            setStatusMessage(message);
            setIsOpen(true);
            break;

          case "network":
            setStatusMessage(`${message}. Please try again later`);
            setIsOpen(true);
            break;

          default:
            setStatusMessage(null);
        }
      }
    }
  }, [isReady, query.status, setIsOpen]);

  return { statusMessage, setStatusMessage };
};

export default useStatusAlert;
