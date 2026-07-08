import * as React from "react";
import { useRouter } from "next/router";

import { useToast } from "@hooks/common/useToast";
import Down from "@components/SlideTransitions/Down";

export const useLoginStatusAlert = () => {
  const { query } = useRouter();
  const toast = useToast();

  React.useEffect(() => {
    if (typeof query.status === "string" && query.status) {
      const toastOptions = {
        severity: "error",
        transition: Down,
        placement: { horizontal: "center", vertical: "top" },
      } as const;

      switch (query.status) {
        case "unauthorized": {
          const msg = `Something has gone wrong and you will have to log in again to continue using the dashboard`;
          toast({ key: msg, content: msg, ...toastOptions });
          break;
        }

        case "invalid": {
          const msg = `Your session has ended. Please log in again to continue`;
          toast({ key: msg, content: msg, ...toastOptions });
          break;
        }

        default:
      }
    }
  }, [query.status, toast]);
};
