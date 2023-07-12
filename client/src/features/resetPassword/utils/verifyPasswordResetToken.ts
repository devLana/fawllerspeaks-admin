import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import apolloClient from "@lib/apolloClient";
import { VERIFY_PASSWORD_RESET_TOKEN } from "../mutations/VERIFY_PASSWORD_RESET_TOKEN";

interface VerifiedData {
  email: string;
  resetToken: string;
}

interface Verified {
  verified: VerifiedData;
  isUnregistered?: never;
}

interface PageView {
  isUnregistered: true;
  verified?: never;
}

export type ResetPasswordPageData = Verified | PageView;

type Query = GetServerSidePropsContext["query"];
type ReturnData = GetServerSidePropsResult<ResetPasswordPageData>;

const verifyPasswordResetToken = async (query: Query): Promise<ReturnData> => {
  const permanent = false;

  if (!query.tId) {
    return {
      redirect: { destination: "/forgot-password?status=empty", permanent },
    };
  }

  if (Array.isArray(query.tId)) {
    return {
      redirect: { destination: "/forgot-password?status=invalid", permanent },
    };
  }

  const client = apolloClient();
  const { data, errors } = await client.mutate({
    mutation: VERIFY_PASSWORD_RESET_TOKEN,
    variables: { token: query.tId },
  });

  if (errors?.[0]) {
    return {
      redirect: { destination: "/forgot-password?status=api", permanent },
    };
  }

  if (data) {
    switch (data.verifyResetToken.__typename) {
      case "VerifiedResetToken":
        return {
          props: {
            verified: {
              email: data.verifyResetToken.email,
              resetToken: data.verifyResetToken.resetToken,
            },
          },
        };

      case "RegistrationError":
        return { props: { isUnregistered: true } };

      case "NotAllowedError":
        return {
          redirect: { destination: "/forgot-password?status=fail", permanent },
        };

      case "VerifyResetTokenValidationError":
        return {
          redirect: {
            destination: "/forgot-password?status=validation",
            permanent,
          },
        };

      default:
        return {
          redirect: {
            destination: "/forgot-password?status=unsupported",
            permanent,
          },
        };
    }
  }

  return {
    redirect: { destination: "/forgot-password?status=network", permanent },
  };
};

export default verifyPasswordResetToken;
