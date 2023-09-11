import * as React from "react";
import { useRouter } from "next/router";

const useStatusAlert = (
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const { isReady, query } = useRouter();

  React.useEffect(() => {
    if (isReady) {
      if (query.status && !Array.isArray(query.status)) {
        switch (query.status) {
          case "upload":
            setIsOpen(true);
            setStatusMessage("Profile updated");
            break;

          case "upload-error":
            setIsOpen(true);
            setStatusMessage(
              "Profile updated. But there was an error uploading your new profile image. Please try again later"
            );
            break;

          default:
            setStatusMessage(null);
        }
      }
    }
  }, [isReady, query.status, setIsOpen]);

  return statusMessage;
};

export default useStatusAlert;
