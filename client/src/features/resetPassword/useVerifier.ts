import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";

import { VERIFY_PASSWORD_RESET_TOKEN as OPERATION } from "./mutations/VERIFY_PASSWORD_RESET_TOKEN";
import { onError } from "./utils/onError";

type View = "form" | "unregistered error" | "success";

export const useVerifier = () => {
  const [verifying, setVerifying] = React.useState(true);
  const [view, setView] = React.useState<View>("form");
  const isVerified = React.useRef(false);

  const { isReady, query, push } = useRouter();

  const [verify, { data: verified }] = useMutation(OPERATION, {
    onError: err => onError(err, push),
  });

  React.useEffect(() => {
    let isMounted = true;

    if (!isVerified.current && isReady) {
      const verifyPasswordResetToken = async () => {
        if (!query.tId) {
          void push(`/forgot-password?status=empty`);
        } else if (Array.isArray(query.tId)) {
          void push(`/forgot-password?status=invalid`);
        } else {
          const { data } = await verify({ variables: { token: query.tId } });

          if (data) {
            switch (data.verifyResetToken.__typename) {
              case "VerifiedResetToken":
                if (isMounted) {
                  setVerifying(false);
                  isVerified.current = true;
                }
                break;

              case "RegistrationError":
                if (isMounted) {
                  setView("unregistered error");
                  setVerifying(false);
                  isVerified.current = true;
                }
                break;

              case "NotAllowedError":
                if (isMounted) void push("/forgot-password?status=fail");
                break;

              case "VerifyResetTokenValidationError":
                if (isMounted) void push("/forgot-password?status=validation");
                break;

              default:
                if (isMounted) void push(`/forgot-password?status=unsupported`);
            }
          }
        }
      };

      void verifyPasswordResetToken();
    }

    return () => {
      isMounted = false;
    };
  }, [isReady, query.tId, verify, push]);

  return { verifying, view, setView, verified };
};
