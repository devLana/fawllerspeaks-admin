import { useEffect } from "react";
import { useRouter } from "next/router";

import { useToast } from "@hooks/common/useToast";
import Down from "@components/SlideTransitions/Down";

export const useForgotPasswordStatusAlert = () => {
  const { query } = useRouter();
  const showToast = useToast();

  useEffect(() => {
    if (typeof query.status === "string" && query.status) {
      const toastOptions = {
        placement: { horizontal: "center", vertical: "top" },
        severity: "info",
        transition: Down,
      } as const;

      switch (query.status) {
        case "network": {
          const msg = `We cannot verify your password reset token at this time. Please try again later`;
          showToast({ content: msg, key: msg, ...toastOptions });
          break;
        }

        case "error": {
          const msg = `You cannot reset your password right now. Please try again later`;
          showToast({ content: msg, key: msg, ...toastOptions });
          break;
        }

        default:
      }
    }
  }, [query.status, showToast]);
};
