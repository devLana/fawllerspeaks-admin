import * as React from "react";
import { useRouter } from "next/router";

import { useToast } from "@hooks/common/useToast";
import Down from "@components/SlideTransitions/Down";

const useRegisterUserStatusAlert = () => {
  const { query } = useRouter();
  const toast = useToast();

  React.useEffect(() => {
    if (typeof query.status === "string" && query.status) {
      switch (query.status) {
        case "unregistered": {
          const msg = `You need to register your account before you can perform that action`;

          toast({
            key: msg,
            content: msg,
            severity: "info",
            placement: { horizontal: "center", vertical: "top" },
            transition: Down,
          });
          break;
        }

        default:
      }
    }
  }, [query.status, toast]);
};

export default useRegisterUserStatusAlert;
