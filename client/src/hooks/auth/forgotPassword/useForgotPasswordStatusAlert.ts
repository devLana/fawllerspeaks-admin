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
        case "invalid":
        case "validation": {
          const msg = "Invalid password reset token";
          showToast({ content: msg, key: msg, ...toastOptions });
          break;
        }

        case "fail":
        case "unsupported":
        case "api": {
          const msg = "Unable to verify password reset token";
          showToast({ content: msg, key: msg, ...toastOptions });
          break;
        }

        case "network": {
          const msg = `Unable to verify password reset token. Please try again later`;
          showToast({ content: msg, key: msg, ...toastOptions });
          break;
        }

        case "error": {
          const msg = `There was an error trying to reset your password. Please try again later`;
          showToast({ content: msg, key: msg, ...toastOptions });
          break;
        }

        default:
      }
    }
  }, [query.status, showToast]);
};
