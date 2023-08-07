import * as React from "react";
import { useRouter } from "next/router";

const useStatusAlert = (): [
  string | null,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (router.isReady) {
      if (router.query.status && !Array.isArray(router.query.status)) {
        switch (router.query.status) {
          case "unregistered":
            setStatusMessage(
              "You need to register your account before you can perform that action"
            );
            break;

          default:
            setStatusMessage(null);
        }
      }
    }
  }, [router.isReady, router.query.status]);

  return [statusMessage, setStatusMessage];
};

export default useStatusAlert;
