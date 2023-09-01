import * as React from "react";
import { useRouter } from "next/router";

const useStatusAlert = (): [
  string | null,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const { isReady, query } = useRouter();

  React.useEffect(() => {
    if (isReady) {
      if (query.status && !Array.isArray(query.status)) {
        switch (query.status) {
          case "upload":
            setStatusMessage("Profile updated");
            break;

          case "upload-error":
            setStatusMessage(
              "Profile updated. But there was an error uploading your new profile image. Please try again later"
            );
            break;

          default:
            setStatusMessage(null);
        }
      }
    }
  }, [isReady, query.status]);

  return [statusMessage, setStatusMessage];
};

export default useStatusAlert;
