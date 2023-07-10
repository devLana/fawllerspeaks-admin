import { useRouter } from "next/router";
import * as React from "react";

const useStatusAlert = () => {
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const { isReady, query } = useRouter();

  React.useEffect(() => {
    if (isReady) {
      if (query.status && !Array.isArray(query.status)) {
        const message = "Unable to verify password reset token";

        switch (query.status) {
          case "empty":
            setStatusMessage("No password reset token provided");
            break;

          case "invalid":
            setStatusMessage("Wrong password reset token format provided");
            break;

          case "validation":
            setStatusMessage("Invalid password reset token provided");
            break;

          case "fail":
            setStatusMessage(message);
            break;

          case "unsupported":
            setStatusMessage(message);
            break;

          case "api":
            setStatusMessage(message);
            break;

          case "network":
            setStatusMessage(`${message}. Please try again later`);
            break;

          default:
            setStatusMessage(null);
        }
      }
    }
  }, [isReady, query.status]);

  return { statusMessage, setStatusMessage };
};

export default useStatusAlert;
