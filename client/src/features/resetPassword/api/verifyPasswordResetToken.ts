import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { ApolloError } from "@apollo/client";

import apolloClient from "@context/AuthHeader/apolloClient";
import { VERIFY_PASSWORD_RESET_TOKEN } from "../operations/VERIFY_PASSWORD_RESET_TOKEN";

interface Verified {
  verified: { email: string; resetToken: string };
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

  try {
    const client = apolloClient();

    const { data } = await client.mutate({
      mutation: VERIFY_PASSWORD_RESET_TOKEN,
      variables: { token: query.tId },
    });

    switch (data?.verifyResetToken.__typename) {
      case "VerifyResetTokenValidationError":
        return {
          redirect: {
            destination: "/forgot-password?status=validation",
            permanent,
          },
        };

      case "NotAllowedError":
        return {
          redirect: { destination: "/forgot-password?status=fail", permanent },
        };

      default:
        return {
          redirect: {
            destination: "/forgot-password?status=unsupported",
            permanent,
          },
        };

      case "RegistrationError":
        return { props: { isUnregistered: true } };

      case "VerifiedResetToken":
        return {
          props: {
            verified: {
              email: data.verifyResetToken.email,
              resetToken: data.verifyResetToken.resetToken,
            },
          },
        };
    }
  } catch (err) {
    if (err instanceof ApolloError) {
      const status = err.graphQLErrors?.length > 0 ? "api" : "network";

      return {
        redirect: {
          destination: `/forgot-password?status=${status}`,
          permanent,
        },
      };
    }

    return {
      redirect: { destination: "/forgot-password?status=error", permanent },
    };
  }
};

export default verifyPasswordResetToken;
